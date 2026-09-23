"""
File: app/main.py
App wiring only — no business logic here. Creates the FastAPI app, adds
CORS for the frontend dev server, and includes every router.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import CORS_ORIGINS
from .routers import zones, complaints, alerts, outcomes, audit
from app.ml.hotspot_forecaster import predict_transaction
from app.routers.cfcfrms import send_to_cfcfrms

app = FastAPI(
    title="DRISHTI API",
    description="Predictive analytics API for cybercrime cash-out hotspot prediction.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(zones.router)
app.include_router(complaints.router)
app.include_router(alerts.router)
app.include_router(outcomes.router)
app.include_router(audit.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/predict-fraud")
def api_predict(data: dict):
    result = predict_transaction(data)
    return result


@app.post("/api/sync-cfcfrms")
def api_cfcfrms_sync(alert_data: dict):
    
    result = send_to_cfcfrms(alert_data)
    return result
