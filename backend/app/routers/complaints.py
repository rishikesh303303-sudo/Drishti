"""
File: app/routers/complaints.py
Powers: Home.jsx (case-status strip + category breakdown), CaseList.jsx
(filtered table), CaseDetail.jsx (header, timeline, evidence tray, notes
thread), FileComplaint.jsx (create a new complaint, which bumps the
affected zone's risk score live).
"""
from datetime import datetime
from collections import Counter
from typing import Optional, List

from fastapi import APIRouter, HTTPException, UploadFile, File

from ..database import load_seed
from ..schemas import Complaint, Evidence, CaseNote, CaseNoteCreate, ComplaintCreate
from . import zones as zones_router

router = APIRouter(prefix="/api/complaints", tags=["complaints"])

# In-memory demo stores — swap for real DB tables later.
_evidence_store: dict[str, list] = {}
_notes_store: dict[str, list] = {}
_complaints_cache: Optional[list] = None


def _complaints() -> list:
    global _complaints_cache
    if _complaints_cache is None:
        _complaints_cache = load_seed("complaints.json")
    return _complaints_cache


@router.get("", response_model=List[Complaint])
def list_complaints(
    zone_id: Optional[str] = None,
    status: Optional[str] = None,
    crime_category: Optional[str] = None,
):
    """CaseList.jsx — every filter chip maps to one of these query params."""
    complaints = _complaints()
    if zone_id:
        complaints = [c for c in complaints if c["zone_id"] == zone_id]
    if status:
        complaints = [c for c in complaints if c["status"] == status]
    if crime_category:
        complaints = [c for c in complaints if c["crime_category"] == crime_category]
    return complaints


@router.get("/overview")
def overview():
    """Home.jsx's 4-card case-status strip."""
    complaints = _complaints()
    status_counts = Counter(c["status"] for c in complaints)
    return {
        "total_active": len(complaints),
        "new_unassigned": status_counts.get("new", 0),
        "under_investigation": status_counts.get("investigating", 0),
        "pending_approval": status_counts.get("pending_approval", 0),
    }


@router.get("/by-category")
def by_category():
    """Home.jsx's 'breakdown by crime category' bar list, sorted by volume."""
    complaints = _complaints()
    counts = Counter(c["crime_category"] for c in complaints)
    return sorted(
        [{"category": k, "count": v} for k, v in counts.items()],
        key=lambda x: x["count"],
        reverse=True,
    )


@router.get("/{complaint_id}", response_model=Complaint)
def get_complaint(complaint_id: str):
    """CaseDetail.jsx header + timeline source data."""
    for c in _complaints():
        if c["id"] == complaint_id:
            return c
    raise HTTPException(status_code=404, detail="Complaint not found")


@router.post("")
def create_complaint(payload: ComplaintCreate):
    """
    FileComplaint.jsx submits here. Right after saving the complaint, this
    bumps that zone's risk score via zones.py's bump_zone_risk() — this is
    the "live" moment: file a complaint, watch the zone's number move.
    Note: no response_model here (deliberately) so we can return both the
    new complaint AND the updated zone in one response for the frontend's
    "Live Impact Preview".
    """
    complaint = Complaint(
        id=f"c-{len(_complaints()) + 1}",
        zone_id=payload.zone_id,
        crime_category=payload.crime_category,
        status="new",
        assigned_officer=None,
        filed_at=datetime.utcnow().isoformat(),
        updated_at=datetime.utcnow().isoformat(),
    )
    _complaints().append(complaint.model_dump())

    updated_zone = zones_router.bump_zone_risk(payload.zone_id, payload.crime_category)

    return {"complaint": complaint.model_dump(), "updated_zone": updated_zone}


# ---------- Evidence ----------

@router.get("/{complaint_id}/evidence", response_model=List[Evidence])
def list_evidence(complaint_id: str):
    return _evidence_store.get(complaint_id, [])


@router.post("/{complaint_id}/evidence", response_model=Evidence)
async def upload_evidence(complaint_id: str, file: UploadFile = File(...)):
    file_type = "image"
    if file.content_type:
        if "pdf" in file.content_type:
            file_type = "pdf"
        elif "audio" in file.content_type:
            file_type = "audio"
        elif "image" not in file.content_type:
            file_type = "chat_export"

    record = Evidence(
        id=f"ev-{len(_evidence_store.get(complaint_id, [])) + 1}",
        complaint_id=complaint_id,
        file_url=f"/uploads/{complaint_id}/{file.filename}",
        file_type=file_type,
        uploaded_by="current_user",
        uploaded_at=datetime.utcnow().isoformat(),
    )
    _evidence_store.setdefault(complaint_id, []).append(record.model_dump())
    return record


# ---------- Notes (append-only) ----------

@router.get("/{complaint_id}/notes", response_model=List[CaseNote])
def list_notes(complaint_id: str):
    return _notes_store.get(complaint_id, [])


@router.post("/{complaint_id}/notes", response_model=CaseNote)
def add_note(complaint_id: str, payload: CaseNoteCreate):
    note = CaseNote(
        id=f"note-{len(_notes_store.get(complaint_id, [])) + 1}",
        complaint_id=complaint_id,
        author=payload.author,
        body=payload.body,
        created_at=datetime.utcnow().isoformat(),
    )
    _notes_store.setdefault(complaint_id, []).append(note.model_dump())
    return note