from pydantic import BaseModel
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import crud
from typing import Optional, List

class Imagen(BaseModel):
    titulo: str
    url: Optional[str] = None

class Post(BaseModel):
    id: Optional[int]
    autor: str
    fecha: datetime
    foto: Optional[Imagen]
    contenido: str

app = FastAPI(title="Proyecto2DW API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await crud.init_db()

@app.on_event("shutdown")
async def shutdown_event():
    await crud.close_db()

# -----------
#     GET
# -----------
@app.get("/", response_model=List[Post])
async def obtener_posts(limit: int = 10, offset: int = 0):
    """Return paginated posts from the database."""
    return crud.get_posts(limit=limit, offset=offset)

@app.get("/posts/{post_id}", response_model=Post)
async def obtener_post(post_id: int):
    """Return a single post by ID."""
    post = await crud.get_post_by_id(post_id)
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

# -----------
#    POST
# -----------
@app.post("/posts", response_model=int)
async def crear_post(post: Post):
    """Create a new post and return its ID."""
    post_id = await crud.create_post(
        autor_id=None,
        autor=post.autor,
        contenido=post.contenido,
        fecha=post.fecha,
        image_id=None
    )
    return post_id

# ------------
#     PUT
# ------------
@app.put("/posts/{post_id}")
async def actualizar_post(post_id: int, post: Post):
    """Update an existing post."""
    updated = await crud.update_post(
        post_id=post_id,
        contenido=post.contenido,
        image_id=None
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"status": "success"}

# ------------
#    DELETE
# ------------
@app.delete("/posts/{post_id}")
async def eliminar_post(post_id: int):
    """Delete a post by ID."""
    deleted = await crud.delete_post(post_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"status": "success"}

# ------------
#    HEALTH
# ------------
@app.get("/health")
async def health():
    # Basic health check. Later you can add an external API probe here (Spotify call).
    return {"status": "ok"}