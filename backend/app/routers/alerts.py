"""
File: app/routers/alerts.py
Powers: HotspotDetail.jsx (create alert), Alerts.jsx (kanban board, approve,
dispatch, add recipient).
"""
from datetime import datetime
from typing import Optional, List

from fastapi import APIRouter, HTTPException

from ..database import load_seed
from ..schemas import Alert, AlertCreate, AlertRecipient, AddRecipientRequest
from . import zones as zones_router

router = APIRouter(prefix="/api/alerts", tags=["alerts"])

_alerts_cache: Optional[list] = None


def _alerts() -> list:
    global _alerts_cache
    if _alerts_cache is None:
        _alerts_cache = load_seed("alerts.json")
    return _alerts_cache


def _find(alert_id: str) -> dict:
    for a in _alerts():
        if a["id"] == alert_id:
            return a
    raise HTTPException(status_code=404, detail="Alert not found")


@router.get("", response_model=List[Alert])
def list_alerts(status: Optional[str] = None):
    """Alerts.jsx's kanban board — call once per column (status=draft,
    approved, dispatched, actioned). Attaches each alert's zone_name so
    the card shows "North Delhi Zone 14" instead of a raw zone_id."""
    alerts = _alerts()
    if status:
        alerts = [a for a in alerts if a["status"] == status]

    zone_lookup = {z["id"]: z["name"] for z in zones_router._zones()}
    result = []
    for a in alerts:
        a_copy = {**a, "zone_name": zone_lookup.get(a["zone_id"], a["zone_id"])}
        result.append(a_copy)
    return result


@router.get("/{alert_id}", response_model=Alert)
def get_alert(alert_id: str):
    """Alerts.jsx's detail drawer when a card is opened."""
    return _find(alert_id)


@router.post("", response_model=Alert)
def create_alert(payload: AlertCreate):
    """Submitted from HotspotDetail.jsx's alert-creation form. Always
    starts in 'draft' status."""
    alert = Alert(
        id=f"alert-{len(_alerts()) + 1}",
        zone_id=payload.zone_id,
        priority=payload.priority,
        status="draft",
        message=payload.message,
        suggested_actions=payload.suggested_actions,
        requires_approval=payload.requires_approval,
        recipients=[],
        created_at=datetime.utcnow().isoformat(),
    )
    _alerts().append(alert.model_dump())
    return alert


@router.post("/{alert_id}/approve", response_model=Alert)
def approve_alert(alert_id: str):
    """Draft -> Approved only."""
    alert = _find(alert_id)
    if alert["status"] != "draft":
        raise HTTPException(status_code=400, detail=f"Cannot approve an alert in '{alert['status']}' status")
    alert["status"] = "approved"
    return alert


@router.post("/{alert_id}/reject", response_model=Alert)
def reject_alert(alert_id: str):
    alert = _find(alert_id)
    alert["status"] = "rejected"
    return alert


@router.post("/{alert_id}/dispatch", response_model=Alert)
def dispatch_alert(alert_id: str):
    """Approved -> Dispatched only."""
    alert = _find(alert_id)
    if alert["status"] != "approved":
        raise HTTPException(status_code=400, detail="Only approved alerts can be dispatched")
    alert["status"] = "dispatched"
    for r in alert.get("recipients", []):
        r["status"] = "sent"
    return alert


@router.post("/{alert_id}/actioned", response_model=Alert)
def mark_actioned(alert_id: str):
    alert = _find(alert_id)
    alert["status"] = "actioned"
    return alert


@router.post("/{alert_id}/recipients", response_model=Alert)
def add_recipient(alert_id: str, payload: AddRecipientRequest):
    """Alerts.jsx's 'Add recipient' control — cross-jurisdiction sharing."""
    alert = _find(alert_id)
    recipient = AlertRecipient(name=payload.name, type=payload.type, status="pending")
    alert.setdefault("recipients", []).append(recipient.model_dump())
    return alert