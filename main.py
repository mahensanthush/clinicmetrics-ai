from fastapi import FastAPI, Depends, HTTPException
from schemas import PredictionRequest
from database import engine, get_db
import models
from sqlalchemy.orm import Session
from sqlalchemy import text
import joblib
import pandas as pd

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ClinicMetrics AI Backend",
    version="1.0.0"
)

# Load ML artifacts into memory
try:
    model = joblib.load("xgboost_noshow_model.joblib")
    le_gender = joblib.load("le_gender.joblib")
    le_neighborhood = joblib.load("le_neighborhood.joblib")
except Exception as e:
    print(f"Warning: Model files not found. Did you run train.py? {e}")

@app.get("/")
def read_root():
    return {"status": "API is running."}

@app.get("/test-db")
def test_db(db: Session = Depends(get_db)):
    try:
        result = db.execute(text("SELECT COUNT(*) FROM appointments")).scalar()
        return {"status": "success", "row_count": result}
    except Exception as e:
        return {"status": "error", "details": str(e)}

@app.post("/predict-no-show")
def predict_no_show(request: PredictionRequest, db: Session = Depends(get_db)):
    try:
        # Safely encode categorical data (fallback to 0 if an unseen neighborhood is submitted)
        gender_encoded = le_gender.transform([request.Gender])[0] if request.Gender in le_gender.classes_ else 0
        neighborhood_encoded = le_neighborhood.transform([request.Neighbourhood])[0] if request.Neighbourhood in le_neighborhood.classes_ else 0

        # Construct DataFrame matching the exact feature order used during training
        input_data = pd.DataFrame([{
            'Gender': gender_encoded,
            'Age': request.Age,
            'Neighbourhood': neighborhood_encoded,
            'Scholarship': request.Scholarship,
            'Hipertension': request.Hipertension,
            'Diabetes': request.Diabetes,
            'Alcoholism': request.Alcoholism,
            'Handcap': request.Handcap,
            'SMS_received': request.SMS_received,
            'DaysWaiting': request.DaysWaiting
        }])

        # Predict probability of a no-show (Class 1)
        risk_score = float(model.predict_proba(input_data)[0][1])
        
        return {
            "prediction_risk": round(risk_score, 4),
            "will_no_show": risk_score > 0.5,
            "patient_data_received": request.model_dump()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))