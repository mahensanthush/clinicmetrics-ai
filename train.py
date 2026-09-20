import pandas as pd
import xgboost as xgb
import joblib
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from database import engine

def train_model():
    print("Fetching data from Oracle database...")
    df = pd.read_sql("SELECT * FROM appointments", con=engine)

    print("Preprocessing data...")
    df['ScheduledDay'] = pd.to_datetime(df['ScheduledDay'])
    df['AppointmentDay'] = pd.to_datetime(df['AppointmentDay'])
    df['DaysWaiting'] = (df['AppointmentDay'] - df['ScheduledDay']).dt.days
    df['DaysWaiting'] = df['DaysWaiting'].apply(lambda x: max(x, 0))

    le_gender = LabelEncoder()
    df['Gender'] = le_gender.fit_transform(df['Gender'])

    le_neighborhood = LabelEncoder()
    df['Neighbourhood'] = le_neighborhood.fit_transform(df['Neighbourhood'])

    df['Target'] = df['No-show'].map({'Yes': 1, 'No': 0})

    numeric_cols = ['Age', 'Scholarship', 'Hipertension', 'Diabetes', 'Alcoholism', 'Handcap', 'SMS_received']
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0).astype(int)

    features = [
        'Gender', 'Age', 'Neighbourhood', 'Scholarship',
        'Hipertension', 'Diabetes', 'Alcoholism', 'Handcap',
        'SMS_received', 'DaysWaiting'
    ]
    
    X = df[features]
    y = df['Target']

    print("Splitting data into 80% training and 20% testing...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training XGBoost model...")
    model = xgb.XGBClassifier(eval_metric='logloss')
    model.fit(X_train, y_train)

    print("Evaluating model...")
    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)
    
    print(f"\nModel Accuracy: {accuracy * 100:.2f}%\n")
    print("Classification Report:")
    print(classification_report(y_test, predictions))

    print("\nSaving model and encoders to disk...")
    joblib.dump(model, "xgboost_noshow_model.joblib")
    joblib.dump(le_gender, "le_gender.joblib")
    joblib.dump(le_neighborhood, "le_neighborhood.joblib")
    
    print("Training complete. Ready for FastAPI integration.")

if __name__ == "__main__":
    train_model()