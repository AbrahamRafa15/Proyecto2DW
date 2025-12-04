"""
CRUD para la gestión de posts usando la estructura REAL de las tablas.
"""

from datetime import datetime
from typing import Optional, List, Dict, Any
import utilsdb as udb


# Database initialization and shutdown helpers
async def init_db():
    await udb.connect_db()

async def close_db():
    await udb.disconnect_db()


# ------------------------------------------------
#                 POSTS CRUD
# ------------------------------------------------

async def get_posts(limit: int = 10, offset: int = 0) -> List[Dict[str, Any]]:
    """
    Obtiene posts con paginación usando los campos correctos.
    """
    query = """
        SELECT id, autor_id, autor, fecha, contenido, image_id, created_at
        FROM posts
        ORDER BY fecha DESC
        LIMIT $1 OFFSET $2
    """
    return await udb.fetch(query, limit, offset)


async def get_post_by_id(post_id: int) -> Optional[Dict[str, Any]]:
    """
    Obtiene un post por su ID.
    """
    query = """
        SELECT id, autor_id, autor, fecha, contenido, image_id, created_at
        FROM posts
        WHERE id = $1
    """
    rows = await udb.fetch(query, post_id)
    return rows[0] if rows else None


async def create_post(
    autor_id: Optional[int],
    autor: str,
    contenido: str,
    fecha: Optional[datetime] = None,
    image_id: Optional[int] = None
) -> int:
    """
    Crea un nuevo post y devuelve su ID.
    """
    query = """
        INSERT INTO posts (autor_id, autor, fecha, contenido, image_id)
        VALUES ($1, $2, COALESCE($3, now()), $4, $5)
        RETURNING id
    """
    rows = await udb.fetch(query, autor_id, autor, fecha, contenido, image_id)
    return rows[0]["id"]


async def update_post(
    post_id: int,
    contenido: Optional[str] = None,
    image_id: Optional[int] = None
) -> bool:
    """
    Actualiza campos permitidos en un post.
    """
    query = """
        UPDATE posts
        SET contenido = COALESCE($2, contenido),
            image_id = COALESCE($3, image_id)
        WHERE id = $1
    """
    result = await udb.execute(query, post_id, contenido, image_id)
    return result.startswith("UPDATE")


async def delete_post(post_id: int) -> bool:
    """
    Elimina un post por su ID.
    """
    query = "DELETE FROM posts WHERE id = $1"
    result = await udb.execute(query, post_id)
    return result.startswith("DELETE")