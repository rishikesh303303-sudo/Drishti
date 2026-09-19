"""
File: app/routers/outcomes.py
Powers: Outcomes.jsx — 8-up stat grid, trend chart, Recent Wins carousel.
"""
from fastapi import APIRouter
from typing import List

from ..database import load_seed
from ..schemas import OutcomeStats, TrendPoint, RecentWin

router = APIRouter(prefix="/api/outcomes", tags=["outcomes"])


@router.get("/stats", response_model=OutcomeStats)
def stats():
    """The 8-up stat grid at the top of the Outcomes & Learning page."""
    data = load_seed("outcomes.json")
    return data.get("stats", {})


@router.get("/trend", response_model=List[TrendPoint])
def trend():
    """Precision/recall over time, with model-version markers."""
    data = load_seed("outcomes.json")
    return data.get("trend", [])


@router.get("/recent-wins", response_model=List[RecentWin])
def recent_wins():
    """Feeds the 'Recent Wins' vertical stacked carousel."""
    data = load_seed("outcomes.json")
    return data.get("recent_wins", [])