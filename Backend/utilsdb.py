import os
import asyncpg
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Global pool reference
pool: Optional[asyncpg.Pool] = None

async def connect_db():
    """Create a connection pool (idempotent)."""
    global pool
    if pool is None:
        if not DATABASE_URL:
            raise RuntimeError("DATABASE_URL is not set")

        pool = await asyncpg.create_pool(
            DATABASE_URL,
            min_size=1,
            max_size=10,
            ssl="require"
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