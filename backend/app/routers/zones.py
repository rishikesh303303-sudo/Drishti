from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List

from ..database import load_seed
from ..schemas import Zone, ZoneRiskBreakdown
from ..ml.hotspot_forecaster import predict_transaction

router = APIRouter(prefix="/api/zones", tags=["zones"])

_zones_cache: Optional[list] = None


def _zones() -> list:
    global _zones_cache
    if _zones_cache is None:
        _zones_cache = load_seed("zones.json")
    return _zones_cache


def bump_zone_risk(zone_id: str, crime_category: str, transaction_data: Optional[dict] = None):
    """
    Called by complaints.py right after a new complaint is filed.
    Ab yeh real ML model (`predict_transaction`) ka use karke zone ka risk score update karega.
    """
    zones = _zones()
    
    # Agar transaction data nahi diya toh default values ke sath dictionary banao
    if not transaction_data:
        transaction_data = {
            "amount": 50000.0,
            "oldbalanceOrg": 50000.0,
            "newbalanceOrig": 0.0,
            "type_CASH_OUT": 1,
            "type_TRANSFER": 0
        }
        
    # ML model se prediction nikal lo
    ml_result = predict_transaction(transaction_data)
    ml_risk_score = ml_result.get("risk_score", 0.5)

    for z in zones:
        if z["id"] == zone_id:
            # Model ke risk score ke mutabiq zone metrics update karo
            z["risk_score"] = round(float(ml_risk_score), 2)
            z["complaint_surge_pct"] = round(z.get("complaint_surge_pct", 0) + 4, 1)
            z["network_risk_pct"] = round(z.get("network_risk_pct", 0) + 1, 1)
            z["confidence"] = round(min(0.95, z.get("confidence", 0.5) + 0.02), 2)

            # Risk level assign karo score ke base par
            if z["risk_score"] >= 0.75:
                z["risk_level"] = "critical" if z["risk_score"] >= 0.9 else "high"
            elif z["risk_score"] >= 0.5:
                z["risk_level"] = "medium"
            else:
                z["risk_level"] = "low"

            if crime_category not in z.get("crime_categories", []):
                z.setdefault("crime_categories", []).append(crime_category)
            return z
            
    return None


@router.get("", response_model=List[Zone])
def list_zones(
    state: Optional[str] = None,
    crime_category: Optional[str] = None,
    min_risk: Optional[float] = Query(None, ge=0, le=1),
):
    zones = _zones()
    if state:
        zones = [z for z in zones if z["state"].lower() == state.lower()]
    if crime_category:
        zones = [z for z in zones if crime_category in z.get("crime_categories", [])]
    if min_risk is not None:
        zones = [z for z in zones if z["risk_score"] >= min_risk]
    return zones


@router.get("/top", response_model=List[Zone])
def top_risk_zones(limit: int = 5):
    zones = sorted(_zones(), key=lambda z: z["risk_score"], reverse=True)
    return zones[:limit]


@router.get("/{zone_id}", response_model=Zone)
def get_zone(zone_id: str):
    for z in _zones():
        if z["id"] == zone_id:
            return z
    raise HTTPException(status_code=404, detail="Zone not found")


@router.get("/{zone_id}/breakdown", response_model=ZoneRiskBreakdown)
def get_zone_breakdown(zone_id: str):
    for z in _zones():
        if z["id"] == zone_id:
            return ZoneRiskBreakdown(
                zone_id=z["id"],
                complaint_surge_pct=z.get("complaint_surge_pct", 0),
                network_risk_pct=z.get("network_risk_pct", 0),
                atm_density_score=z.get("atm_density_score", 0.5),
                historical_cash_out_rate=z.get("historical_cash_out_rate", 0.5),
                confidence=z.get("confidence", 0.5),
            )
    raise HTTPException(status_code=404, detail="Zone not found")
