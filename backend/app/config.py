"""
File: app/config.py
Reads all environment variables in one place so nothing else in the app
calls os.getenv() directly.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()


DATABASE_URL: str = os.getenv("DATABASE_URL", "")

# Where the demo JSON fixtures live.
SEED_DATA_DIR: Path = Path(
    os.getenv("SEED_DATA_DIR", Path(__file__).resolve().parents[2] / "demo" / "seed_data")
)

# Frontend Mapbox token is separate (lives in frontend/.env), this is only
# used if the backend ever needs to proxy a tile/geocoding request itself.
MAPBOX_TOKEN: str = os.getenv("MAPBOX_TOKEN", "")

# Where trained model files (.pkl / .joblib) are loaded from once the real
# ML models replace the placeholder math in app/ml/*.py.
ML_MODEL_DIR: Path = Path(os.getenv("ML_MODEL_DIR", Path(__file__).resolve().parent / "ml" / "trained_models"))

CORS_ORIGINS: list[str] = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")