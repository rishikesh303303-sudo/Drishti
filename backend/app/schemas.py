"""
File: app/schemas.py
Pydantic request/response schemas — this is the API contract. Field names
here must match frontend/src/lib/api.js exactly — decide a name once here,
never rename later.
"""
from pydantic import BaseModel
from typing import Optional, List


class Zone(BaseModel):
    id: str
    name: str
    state: str
    district: str
    lat: float
    lng: float
    risk_score: float
    confidence: float
    risk_level: str  # low | medium | high | critical
    complaint_surge_pct: float
    network_risk_pct: float
    crime_categories: List[str]
    active_alert_status: Optional[str] = None


class ZoneRiskBreakdown(BaseModel):
    zone_id: str
    complaint_surge_pct: float
    network_risk_pct: float
    atm_density_score: float
    historical_cash_out_rate: float
    confidence: float


class Complaint(BaseModel):
    id: str
    zone_id: str
    crime_category: str
    status: str  # new | investigating | pending_approval | resolved
    assigned_officer: Optional[str] = None
    filed_at: str
    updated_at: str


class Evidence(BaseModel):
    id: str
    complaint_id: str
    file_url: str
    file_type: str
    uploaded_by: Optional[str] = None
    uploaded_at: str


class CaseNote(BaseModel):
    id: str
    complaint_id: str
    author: str
    body: str
    created_at: str


class CaseNoteCreate(BaseModel):
    author: str
    body: str


class AlertRecipient(BaseModel):
    name: str
    type: str  # lea | bank | i4c
    status: str  # sent | seen | acknowledged | actioned


class Alert(BaseModel):
    id: str
    zone_id: str
    zone_name: Optional[str] = None
    priority: str  # standard | high | critical
    status: str  # draft | approved | dispatched | actioned
    message: str
    suggested_actions: List[str]
    requires_approval: bool
    recipients: List[AlertRecipient] = []
    created_at: str


class AlertCreate(BaseModel):
    zone_id: str
    priority: str
    message: str
    suggested_actions: List[str] = []
    requires_approval: bool = True


class AddRecipientRequest(BaseModel):
    name: str
    type: str


class OutcomeStats(BaseModel):
    prevented_loss_inr: float
    avg_response_time_min: float
    precision_at_k: float
    recall: float
    false_positive_rate: float
    model_version: str
    alerts_dispatched: int
    zones_covered: int


class TrendPoint(BaseModel):
    date: str
    precision: float
    recall: float
    model_version: Optional[str] = None


class RecentWin(BaseModel):
    zone_name: str
    amount_saved_inr: float
    date: str
    description: str


class AuditRecord(BaseModel):
    id: str
    record_type: str  # prediction | alert | approval | outcome
    hash: str
    linked_case_id: Optional[str] = None
    timestamp: str
    tx_id: Optional[str] = None


class VerifyResult(BaseModel):
    id: str
    match: bool
    recomputed_hash: str  

class ComplaintCreate(BaseModel):
    """What FileComplaint.jsx POSTs to create a new complaint."""
    zone_id: str
    crime_category: str