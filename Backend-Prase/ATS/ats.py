from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import io
import re
import pickle
import xgboost as xgb
import pandas as pd
import pdfplumber
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)


# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'txt'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# File paths
model_path = "C:/Users/vanshika/Downloads/ats score checker-20250507T140126Z-1-001/ats score checker/ats_scoring_model.json"
skill_encoder_path = "C:/Users/vanshika/Downloads/ats score checker-20250507T140126Z-1-001/ats score checker/skill_encoder.pkl"
education_encoder_path = "C:/Users/vanshika/Downloads/ats score checker-20250507T140126Z-1-001/ats score checker/education_encoder.pkl"
scaler_path = "C:/Users/vanshika/Downloads/ats score checker-20250507T140126Z-1-001/ats score checker/scaler.pkl"


# Load models and encoders at startup
model = None
skill_encoder = None
education_encoder = None
scaler = None

def load_models():
    global model, skill_encoder, education_encoder, scaler
    try:
        model = xgb.XGBRegressor()
        model.load_model(model_path)

        with open(skill_encoder_path, 'rb') as f:
            skill_encoder = pickle.load(f)

        with open(education_encoder_path, 'rb') as f:
            education_encoder = pickle.load(f)

        with open(scaler_path, 'rb') as f:
            scaler = pickle.load(f)

        print("Model and encoders loaded successfully.")
    except Exception as e:
        print(f"Error loading models: {str(e)}")
        raise

# Load models when the app starts
load_models()

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_resume_data(resume_text):
    # Extract skills
    skill_keywords = [
        'python', 'java', 'c++', 'sql', 'html', 'css', 'javascript',
        'machine learning', 'deep learning', 'tensorflow', 'keras', 'pandas', 'numpy'
    ]
    skills = [skill for skill in skill_keywords if skill.lower() in resume_text.lower()]
    
    # Extract experience
    experience_matches = re.findall(r'(\d+)\+?\s+years?', resume_text.lower())
    experience = int(experience_matches[0]) if experience_matches else 0
    
    # Extract education
    if 'phd' in resume_text.lower():
        education = ["PhD"]
    elif 'master' in resume_text.lower():
        education = ["Masters"]
    elif 'bachelor' in resume_text.lower():
        education = ["Bachelors"]
    else:
        education = ["Unknown"]
    
    return skills, experience, education

def predict_ats_score(skills, experience, education):
    try:
        # Encode skills
        skills_encoded = pd.DataFrame(skill_encoder.transform([skills]), columns=skill_encoder.classes_)

        # One-hot encode education
        education_array = education_encoder.transform([[education[0]]])
        if hasattr(education_encoder, 'classes_'):
            education_encoded = pd.DataFrame(education_array, columns=education_encoder.classes_)
        else:
            education_encoded = pd.DataFrame(education_array, columns=education_encoder.classes_.tolist())

        # Scale experience
        experience_scaled = scaler.transform([[experience]])[0][0]

        # Combine all features
        test_data = pd.concat([skills_encoded, education_encoded], axis=1)
        test_data['experience'] = experience_scaled

        # Predict
        ats_score = float(model.predict(test_data)[0])
        
        return ats_score
    except Exception as e:
        raise Exception(f"Prediction failed: {str(e)}")

@app.route('/api/check-ats', methods=['POST'])
def check_ats():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        try:
            # Save the file temporarily
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            # Parse the resume
            if filename.endswith(".pdf"):
                with pdfplumber.open(filepath) as pdf:
                    resume_text = "".join([page.extract_text() or "" for page in pdf.pages])
            else:
                with open(filepath, 'r') as f:
                    resume_text = f.read()
            
            # Clean up the temporary file
            os.remove(filepath)
            
            # Extract features
            skills, experience, education = extract_resume_data(resume_text)
            
            # Predict ATS score
            ats_score = predict_ats_score(skills, experience, education)
            
            return jsonify({
                'ats_score': ats_score
            })
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Invalid file type'}), 400

@app.route('/predict-ats-score', methods=['POST'])
def predict_resume():
    try:
        data = request.get_json()
        
        if not data or 'skills' not in data or 'experience' not in data or 'education' not in data:
            return jsonify({'error': 'Invalid request data'}), 400
        
        # Predict ATS score
        ats_score = predict_ats_score(data['skills'], data['experience'], data['education'])
        print(ats_score)
        return jsonify({'ats_score': ats_score})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(debug=True, port=5006)