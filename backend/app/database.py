"""
File: app/database.py
Two responsibilities, kept deliberately separate:
  1. load_seed()  -> demo mode, reads demo/seed_data/*.json (used right now
                     by every router in app/routers/).
  2. get_db()     -> real mode, a SQLAlchemy session dependency for Postgres,
                     used once you switch a router over from load_seed() to
                     real queries (see ARCHITECTURE.md section 4).
Both are always defined so a router can be migrated one at a time without
touching this file again.
"""
import json
from functools import lru_cache
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from .config import SEED_DATA_DIR, DATABASE_URL

# ---------- Demo mode ----------

@lru_cache(maxsize=None)
def load_seed(filename: str):
    """Load one demo JSON file, e.g. load_seed('zones.json'). Cached so we
    don't re-read disk on every request; the demo data doesn't change."""
    path: Path = SEED_DATA_DIR / filename
    if not path.exists():
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def clear_seed_cache():
    """Call this after any in-place edit to a seed file during local dev."""
    load_seed.cache_clear()


# ---------- Real mode (Postgres) ----------

Base = declarative_base()

engine = None
SessionLocal = None

if DATABASE_URL:
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """FastAPI dependency: `db: Session = Depends(get_db)`.
    Only works once DATABASE_URL is set in .env — raises clearly otherwise."""
    if SessionLocal is None:
        raise RuntimeError(
            "DATABASE_URL is not set — this router path needs a real database. "
            "Either set DATABASE_URL in .env, or use load_seed() instead for demo mode."
        )
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()