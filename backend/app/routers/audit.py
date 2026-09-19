"""
File: app/routers/audit.py
Powers: Audit.jsx — records table + inline "Verify Integrity" per row.
"""
import hashlib
import json
from fastapi import APIRouter, HTTPException
from typing import List, Optional

from ..database import load_seed
from ..schemas import AuditRecord, VerifyResult

router = APIRouter(prefix="/api/audit", tags=["audit"])


@router.get("", response_model=List[AuditRecord])
def list_records(record_type: Optional[str] = None):
    """Audit.jsx's records table, filterable by type (prediction/alert/
    approval/outcome) via the top filter bar."""
    records = load_seed("audit.json")
    if record_type:
        records = [r for r in records if r["record_type"] == record_type]
    return records


@router.post("/{record_id}/verify", response_model=VerifyResult)
def verify_record(record_id: str):
    """
    Recomputes the SHA-256 hash of the off-chain record and compares it to
    the on-chain hash. In this demo, both sides read from the same seed
    file, so it always matches — wire this up to the real Postgres row +
    Hyperledger Fabric query in production (see blockchain/hash_utils.py).
    """
    records = load_seed("audit.json")
    for r in records:
        if r["id"] == record_id:
            recomputed = hashlib.sha256(
                json.dumps(r, sort_keys=True).encode("utf-8")
            ).hexdigest()[:16]
            match = True  # demo always resolves true
            return VerifyResult(id=record_id, match=match, recomputed_hash=recomputed)
    raise HTTPException(status_code=404, detail="Audit record not found")