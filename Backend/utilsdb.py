import os
import asyncpg
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")

# Global pool reference
pool: Optional[asyncpg.Pool] = None

async def connect_db():
    """Create a connection pool (idempotent)."""
    global pool
    if pool is None:
        pool = await asyncpg.create_pool(
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
            host=DB_HOST,
            port=DB_PORT,
            min_size=1,
            max_size=10,
        )
    return pool

async def disconnect_db():
    global pool
    if pool:
        await pool.close()
        pool = None

async def fetch(query: str, *args):
    """Return a list of records for a SELECT-style query."""
    if pool is None:
        raise RuntimeError("Database pool is not initialized. Call connect_db() first.")
    async with pool.acquire() as conn:
        return await conn.fetch(query, *args)

async def execute(query: str, *args):
    """Execute a non-SELECT SQL statement (INSERT/UPDATE/DELETE)."""
    if pool is None:
        raise RuntimeError("Database pool is not initialized. Call connect_db() first.")
    async with pool.acquire() as conn:
        return await conn.execute(query, *args)