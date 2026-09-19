"""
File: app/models.py
SQLAlchemy ORM models — the real-database counterpart to demo/seed_data/*.json.
Not used by any router yet (routers currently read load_seed()). Wire these in
one router at a time once Postgres/PostGIS is running:
    1. `alembic revision --autogenerate -m "initial schema"`
    2. `alembic upgrade head`
    3. swap that router's load_seed() calls for `db.query(Model)...`
"""
import uuid
from datetime import datetime

from sqlalchemy import (
    Column, String, Float, Boolean, DateTime, ForeignKey, Text
)
from sqlalchemy.orm import relationship

from .database import Base


def _uuid() -> str:
    return str(uuid.uuid4())


class Zone(Base):
    __tablename__ = "zones"

    id = Column(String, primary_key=True, default=_uuid)
    name = Column(String, nullable=False)
    state = Column(String, nullable=False, index=True)
    district = Column(String, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    # TODO: replace lat/lng with a PostGIS Geometry(Polygon) column once
    # GeoAlchemy2 is installed, so the frontend map can draw real zone
    # boundaries instead of point markers.

    risk_score = Column(Float, default=0.0)
    confidence = Column(Float, default=0.0)
    risk_level = Column(String, default="low")
    complaint_surge_pct = Column(Float, default=0.0)
    network_risk_pct = Column(Float, default=0.0)
    crime_categories = Column(Text, default="")  # comma-separated

    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    complaints = relationship("Complaint", back_populates="zone")
    cash_out_events = relationship("CashOutEvent", back_populates="zone")
    alerts = relationship("Alert", back_populates="zone")


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(String, primary_key=True, default=_uuid)
    zone_id = Column(String, ForeignKey("zones.id"), nullable=False, index=True)
    crime_category = Column(String, nullable=False, index=True)
    status = Column(String, default="new", index=True)
    assigned_officer_id = Column(String, nullable=True)
    tokenized_account_ref = Column(String, nullable=True)
    filed_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    zone = relationship("Zone", back_populates="complaints")
    evidence = relationship("Evidence", back_populates="complaint")
    notes = relationship("CaseNote", back_populates="complaint")


class CashOutEvent(Base):
    __tablename__ = "cash_out_events"

    id = Column(String, primary_key=True, default=_uuid)
    zone_id = Column(String, ForeignKey("zones.id"), nullable=False, index=True)
    atm_id = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    occurred_at = Column(DateTime, default=datetime.utcnow, index=True)

    zone = relationship("Zone", back_populates="cash_out_events")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String, primary_key=True, default=_uuid)
    zone_id = Column(String, ForeignKey("zones.id"), nullable=False, index=True)
    priority = Column(String, default="standard")
    status = Column(String, default="draft", index=True)
    message = Column(Text, nullable=False)
    suggested_actions = Column(Text, default="")
    requires_approval = Column(Boolean, default=True)
    created_by = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    zone = relationship("Zone", back_populates="alerts")
    recipients = relationship("AlertRecipient", back_populates="alert")
    outcome = relationship("Outcome", back_populates="alert", uselist=False)


class AlertRecipient(Base):
    __tablename__ = "alert_recipients"

    id = Column(String, primary_key=True, default=_uuid)
    alert_id = Column(String, ForeignKey("alerts.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    status = Column(String, default="pending")

    alert = relationship("Alert", back_populates="recipients")


class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(String, primary_key=True, default=_uuid)
    complaint_id = Column(String, ForeignKey("complaints.id"), nullable=False, index=True)
    file_url = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    uploaded_by = Column(String, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    complaint = relationship("Complaint", back_populates="evidence")


class CaseNote(Base):
    """Append-only by design: no updated_at, and routers/complaints.py must
    never expose a PUT/PATCH/DELETE for this table."""
    __tablename__ = "case_notes"

    id = Column(String, primary_key=True, default=_uuid)
    complaint_id = Column(String, ForeignKey("complaints.id"), nullable=False, index=True)
    author = Column(String, nullable=False)
    body = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    complaint = relationship("Complaint", back_populates="notes")


class Outcome(Base):
    __tablename__ = "outcomes"

    id = Column(String, primary_key=True, default=_uuid)
    alert_id = Column(String, ForeignKey("alerts.id"), nullable=False, unique=True)
    status = Column(String, nullable=False)
    notes = Column(Text, default="")
    recorded_at = Column(DateTime, default=datetime.utcnow)

    alert = relationship("Alert", back_populates="outcome")


class AuditRecord(Base):
    __tablename__ = "audit_records"

    id = Column(String, primary_key=True, default=_uuid)
    record_type = Column(String, nullable=False, index=True)
    hash = Column(String, nullable=False)
    linked_case_id = Column(String, nullable=True, index=True)
    tx_id = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)