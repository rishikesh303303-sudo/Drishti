<div align="center">

# 🛡️ DRISHTI

### AI-Powered Financial Crime Hotspot Detection & Command Centre

</div>

## About

DRISHTI helps Law Enforcement Agencies, Banks/FIs, and I4C administrators detect and act on emerging **cash-out fraud hotspots** before they escalate. It scores zones for risk using a machine-learning pipeline and gives investigators a single dashboard to monitor live risk, manage cases, dispatch alerts, and verify a tamper-proof, blockchain-anchored audit trail.

## Features

- **Live Command Centre** — real-time risk heatmap with filters and a timeline scrubber
- **Case Management** — searchable case list, timeline, evidence tray, notes thread
- **Alerts Kanban** — Draft → Approved → Dispatched → Actioned, with role-gated approvals
- **Outcomes Dashboard** — stats, trend charts, and recent-wins tracking
- **Audit Trail** — hash-anchored records with one-click integrity verification
- **ML Risk Engine** — hotspot forecasting, anomaly detection, and mule-network graph risk

## Tech Stack

- **Frontend:** React (JSX) + Vite, Mapbox GL
- **Backend:** FastAPI (Python)
- **Database:** PostgreSQL + PostGIS
- **ML:** pandas, scikit-learn, XGBoost / LightGBM
- **Audit Ledger:** Hyperledger Fabric

## Getting Started

### Prerequisites

- Node.js ≥ 18
- Python ≥ 3.10
- PostgreSQL + PostGIS *(production mode only)*
- A Mapbox access token

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        
pip install -r requirements.txt
cp .env.example .env            
uvicorn app.main:app --reload --port 8000
```

Runs at `http://localhost:8000`. Demo mode reads from `demo/seed_data/*.json`, so no database is required to get started.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env            
npm run dev
```

Runs at `http://localhost:3000`.

### Moving to Production

```bash
alembic revision --autogenerate -m "initial schema"
alembic upgrade head
```

## Testing

```bash
cd backend
pytest tests/
```

## License

Licensed under the **MIT License**.
