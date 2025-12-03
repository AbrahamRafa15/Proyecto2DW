from pydantic import BaseModel
from fastapi import FastAPI, Header, HTTPException
from datetime import datetime
import utilsdb
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

@app.on_event("startup")
async def startup_event():
    await utilsdb.connect_db()

@app.on_event("shutdown")
async def shutdown_event():
    await utilsdb.disconnect_db()

#  -----------
#     GET
# -----------
@app.get("/", response_model=List[Post])
async def obtener_posts(limit: int = 10, offset: int = 0):
    """Return paginated posts from the database."""
    rows = await utilsdb.fetch(
        "SELECT id, autor, fecha, contenido FROM posts ORDER BY fecha DESC LIMIT $1 OFFSET $2",
        limit,
        offset,
    )
    return [Post(id=r["id"], autor=r["autor"], fecha=r["fecha"], contenido=r["contenido"]) for r in rows]

#  ------------
#    HEALTH
# ------------
@app.get("/health")
async def health():
    # Basic health check. Later you can add an external API probe here (Spotify call).
    return {"status": "ok"}