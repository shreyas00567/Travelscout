import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

# ------------------------------
# Step 1: Create dummy dataset
# ------------------------------
data = {
    'fever': [1, 0, 1, 0, 1, 0, 1, 0],
    'cough': [1, 1, 0, 0, 1, 0, 0, 1],
    'headache': [1, 0, 1, 0, 1, 0, 1, 0],
    'fatigue': [1, 0, 1, 0, 0, 1, 1, 0],
    'disease': [
        'Flu', 'Healthy', 'Covid', 'Healthy', 'Flu', 'Cold', 'Covid', 'Cold'
    ]
}

df = pd.DataFrame(data)

# ------------------------------
# Step 2: Train model
# ------------------------------
X = df[['fever', 'cough', 'headache', 'fatigue']]
y = df['disease']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# ------------------------------
# Step 3: Save model
# ------------------------------
os.makedirs("models", exist_ok=True)
model_path = os.path.join("models", "symptom_model.pkl")
joblib.dump(model, model_path)

print("✅ Model trained and saved successfully at:", model_path)
