from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
from config import Config
from database.models import db, Patient
import joblib
import pandas as pd
import os

# ------------------------
# Initialize Flask app
# ------------------------
app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

# ------------------------
# Load ML model
# ------------------------
model_path = os.path.join("models", "symptom_model.pkl")
model = joblib.load(model_path)

# ------------------------
# Home route
# ------------------------
@app.route('/')
def home():
    return render_template('index.html')

# ------------------------
# Prediction route
# ------------------------
@app.route('/predict', methods=['POST'])
def predict():
    name = request.form['name']
    age = int(request.form['age'])
    fever = 1 if 'fever' in request.form else 0
    cough = 1 if 'cough' in request.form else 0
    headache = 1 if 'headache' in request.form else 0
    fatigue = 1 if 'fatigue' in request.form else 0

    # Prepare data for model
    df = pd.DataFrame([[fever, cough, headache, fatigue]],
                      columns=['fever', 'cough', 'headache', 'fatigue'])

    # Predict disease
    prediction = model.predict(df)[0]

    # Save to database
    new_patient = Patient(
        name=name,
        age=age,
        symptoms=f"Fever:{fever}, Cough:{cough}, Headache:{headache}, Fatigue:{fatigue}",
        predicted_disease=prediction
    )
    db.session.add(new_patient)
    db.session.commit()

    return render_template('result.html', name=name, disease=prediction)

# ------------------------
# Admin Dashboard
# ------------------------
@app.route('/admin')
def admin():
    patients = Patient.query.all()
    return render_template('admin.html', patients=patients)

# ------------------------
# Run app
# ------------------------
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
