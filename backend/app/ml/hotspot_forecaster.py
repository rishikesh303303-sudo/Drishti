import os
import joblib
import pandas as pd


current_dir = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(current_dir, "../../fraud_model.pkl")


try:
    model = joblib.load(MODEL_PATH)
    print(f"✅ Success! Model loaded from backend root: {MODEL_PATH}")
except Exception as e:
    model = None
    print(f"❌ Error loading model from {MODEL_PATH}: {e}")

def predict_transaction(data: dict):
    
    if model is None:
        return {
            "is_fraud": 0,
            "risk_score": 0.0,
            "explanation": ["ML Model file not found in backend root, running in fallback mode"]
        }

    amount = float(data.get("amount", 50000.0))
    old_balance = float(data.get("oldbalanceOrg", amount))
    
    payload = {
        "step": int(data.get("step", 1)),
        "amount": amount,
        "oldbalanceOrg": old_balance,
        "newbalanceOrig": float(data.get("newbalanceOrig", 0.0)),
        "oldbalanceDest": float(data.get("oldbalanceDest", 0.0)),
        "newbalanceDest": float(data.get("newbalanceDest", amount)),
        "type_CASH_OUT": int(data.get("type_CASH_OUT", 1)),
        "type_DEBIT": int(data.get("type_DEBIT", 0)),
        "type_PAYMENT": int(data.get("type_PAYMENT", 0)),
        "type_TRANSFER": int(data.get("type_TRANSFER", 0))
    }
    
    df_input = pd.DataFrame([payload])
    
    prediction = int(model.predict(df_input)[0])
    
    if hasattr(model, "predict_proba"):
        probabilities = model.predict_proba(df_input)[0]
        probability = float(probabilities[1] if len(probabilities) > 1 else probabilities[0])
    else:
        probability = float(prediction)
    
   
    reasons = []
    if amount > 200000:
        reasons.append("High transaction amount threshold breached")
    if old_balance > 0 and payload["newbalanceOrig"] == 0:
        reasons.append("Account completely emptied out (Typical of ATM Cash-Out fraud)")
    if payload["type_TRANSFER"] == 1 or payload["type_CASH_OUT"] == 1:
        reasons.append("High-risk transaction type (TRANSFER/CASH_OUT hotspot match)")
        
    if not reasons and prediction == 1:
        reasons.append("Unusual spatial-temporal anomaly pattern detected by model")

    return {
        "is_fraud": prediction,
        "risk_score": probability,
        "explanation": reasons if prediction == 1 else ["Transaction and location pattern appear normal"]
    }
    