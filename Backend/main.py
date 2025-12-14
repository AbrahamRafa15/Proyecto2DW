from pydantic import BaseModel
from fastapi import FastAPI, Header, HTTPException, Depends
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import crud
from typing import Optional, List
import httpx
import os
from fastapi import Query

SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")

spotify_token_cache = {"token": None, "expires_at": 0}

async def get_spotify_token():
    import time
    if spotify_token_cache["token"] and spotify_token_cache["expires_at"] > time.time():
        return spotify_token_cache["token"]

    url = "https://accounts.spotify.com/api/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {"grant_type": "client_credentials"}
    auth = (SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET)

    async with httpx.AsyncClient() as client:
        r = await client.post(url, data=data, auth=auth)
        r.raise_for_status()
        resp = r.json()
        token = resp["access_token"]
        expires_in = resp["expires_in"]
        spotify_token_cache["token"] = token
        spotify_token_cache["expires_at"] = time.time() + expires_in - 30
        return token

app = FastAPI(title="Proyecto2DW API", version="1.0")

FRONTEND_ORIGINS = os.getenv(
    "FRONTEND_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/spotify/new-releases")
async def spotify_new_releases(limit: int = Query(10, ge=1, le=50)):
    """Return new releases from Spotify."""
    token = await get_spotify_token()
    url = f"https://api.spotify.com/v1/browse/new-releases?limit={limit}"
    headers = {"Authorization": f"Bearer {token}"}

    async with httpx.AsyncClient() as client:
        r = await client.get(url, headers=headers)
        r.raise_for_status()
        data = r.json()
        # Simplify the data for frontend
        simplified = [
            {
                "name": album["name"],
                "artists": [a["name"] for a in album["artists"]],
                "release_date": album["release_date"],
                "total_tracks": album["total_tracks"],
                "url": album["external_urls"]["spotify"],
            }
            for album in data.get("albums", {}).get("items", [])
        ]
        return simplified

class Imagen(BaseModel):
    titulo: str
    url: Optional[str] = None

class PostCreate(BaseModel):
    contenido: str
    image_id: Optional[int] = None
    fecha: Optional[datetime] = None

class PostUpdate(BaseModel):
    contenido: Optional[str] = None
    image_id: Optional[int] = None

class Post(BaseModel):
    id: Optional[int]
    autor: str
    fecha: datetime
    foto: Optional[Imagen]
    contenido: str

@app.on_event("startup")
async def startup_event():
    await crud.init_db()

@app.on_event("shutdown")
async def shutdown_event():
    await crud.close_db()

async def get_current_user(x_user: str = Header(...)):
    if not x_user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return x_user

# -----------
#     GET
# -----------
@app.get("/posts", response_model=List[Post])
async def obtener_posts(limit: int = 10, offset: int = 0):
    """Return paginated posts from the database."""
    rows = await crud.get_posts(limit=limit, offset=offset)

    posts: List[Post] = []
    for r in rows:
        posts.append(
            Post(
                id=r["id"],
                autor=r["autor"],
                fecha=r["fecha"],
                contenido=r["contenido"],
                foto=None,
            )
        )

    return posts

@app.get("/posts/{post_id}", response_model=Post)
async def obtener_post(post_id: int):
    """Return a single post by ID."""
    r = await crud.get_post_by_id(post_id)
    if r is None:
        raise HTTPException(status_code=404, detail="Post not found")

    return Post(
        id=r["id"],
        autor=r["autor"],
        fecha=r["fecha"],
        contenido=r["contenido"],
        foto=None,
    )

# -----------
#    POST
# -----------
@app.post("/posts", response_model=int)
async def crear_post(post: PostCreate, user: str = Depends(get_current_user)):
    """Create a new post and return its ID."""
    post_id = await crud.create_post(
        autor_id=None,
        autor=user,
        contenido=post.contenido,
        fecha=post.fecha,
        image_id=post.image_id
    )
    return post_id

# ------------
#     PATCH
# ------------
@app.patch("/posts/{post_id}")
async def actualizar_post(post_id: int, post: PostUpdate, user: str = Depends(get_current_user)):
    """Update an existing post if the user is the author."""
    existing_post = await crud.get_post_by_id(post_id)
    if not existing_post:
        raise HTTPException(status_code=404, detail="Post not found")
    if existing_post["autor"] != user:
        raise HTTPException(status_code=403, detail="You cannot edit this post")

    updated = await crud.update_post(
        post_id=post_id,
        contenido=post.contenido,
        image_id=post.image_id
    )
    return {"updated": updated}

# ------------
#    DELETE
# ------------
@app.delete("/posts/{post_id}")
async def eliminar_post(post_id: int, user: str = Depends(get_current_user)):
    """Delete a post by ID if the user is the author."""
    existing_post = await crud.get_post_by_id(post_id)
    if not existing_post:
        raise HTTPException(status_code=404, detail="Post not found")
    if existing_post["autor"] != user:
        raise HTTPException(status_code=403, detail="You cannot delete this post")

    deleted = await crud.delete_post(post_id)
    return {"deleted": deleted}

#
#  OPEN GRAPH
# ------------
@app.get("/og/posts/{post_id}", response_class=HTMLResponse)
async def og_post(post_id: int):
    """
    OpenGraph endpoint for a post.
    This endpoint is meant to be consumed by crawlers (WhatsApp, Facebook, etc.)
    """
    r = await crud.get_post_by_id(post_id)
    if r is None:
        raise HTTPException(status_code=404, detail="Post not found")

    lineas = (r["contenido"] or "").split("\n")
    texto = lineas[0] if lineas else ""
    imagen = lineas[1] if len(lineas) > 1 else ""

    # URL pública base (Render o local)
    PUBLIC_BASE_URL = os.getenv("PUBLIC_BASE_URL", "http://localhost:8000")

    html = f"""
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="utf-8" />
        <title>{texto}</title>

        <!-- OpenGraph -->
        <meta property="og:type" content="article" />
        <meta property="og:title" content="{texto}" />
        <meta property="og:description" content="Post de {r['autor']}" />
        <meta property="og:url" content="{PUBLIC_BASE_URL}/og/posts/{post_id}" />
        {"<meta property='og:image' content='" + imagen + "' />" if imagen else ""}

        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="{texto}" />
        <meta name="twitter:description" content="Post de {r['autor']}" />
        {"<meta name='twitter:image' content='" + imagen + "' />" if imagen else ""}
    </head>
    <body>
        <p>Este enlace es solo para previsualización.</p>
        <p><strong>{texto}</strong></p>
    </body>
    </html>
    """
    return HTMLResponse(content=html)

# ------------
#    HEALTH
# ------------
@app.get("/health")
async def health():
    """Checamos que la API esté funcionando correctamente así como la API de Spotify."""
    spotify_ok = False
    try:
        token = await get_spotify_token()
        spotify_ok = token is not None
    except Exception:
        spotify_ok = False

    return {
        "status": "ok",
        "spotify": "ok" if spotify_ok else "error"
    }