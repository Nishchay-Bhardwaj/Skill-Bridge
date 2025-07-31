from flask import Flask, request, jsonify, render_template
import os
from werkzeug.utils import secure_filename
import matplotlib
matplotlib.use('Agg')
import base64
import io
import re
import docx
import PyPDF2
import spacy
import matplotlib.pyplot as plt
import numpy as np
import requests
from bs4 import BeautifulSoup
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

# Load models
model = SentenceTransformer('all-MiniLM-L6-v2')
nlp = spacy.load("en_core_web_sm")

SKILL_KEYWORDS = {
    "technical": ["python", "sql", "machine learning", "deep learning", "nlp", "pandas", "numpy", "scikit-learn", "tensorflow", "keras"],
    "tools": ["git", "docker", "aws", "gcp", "linux", "tableau"],
    "soft": ["communication", "leadership", "collaboration", "problem solving"]
}

SECTIONS = ["objective", "summary", "skills", "projects", "work experience", "certifications"]

def extract_text_from_pdf(file_path):
    with open(file_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        return ' '.join(page.extract_text() for page in reader.pages if page.extract_text())

def extract_text_from_docx(file_path):
    doc = docx.Document(file_path)
    return ' '.join([para.text for para in doc.paragraphs])

def extract_text(file_path):
    if file_path.endswith('.pdf'):
        return extract_text_from_pdf(file_path)
    elif file_path.endswith('.docx'):
        return extract_text_from_docx(file_path)
    else:
        raise ValueError("Unsupported file type. Use PDF or DOCX.")

def compute_similarity(resume_text, jd_text):
    embeddings = model.encode([resume_text, jd_text])
    return round(cosine_similarity([embeddings[0]], [embeddings[1]])[0][0] * 100, 2)

def extract_skills(text):
    text = text.lower()
    return {k: [s for s in v if s in text] for k, v in SKILL_KEYWORDS.items()}

def completeness_score(text):
    text = text.lower()
    present_sections = [s for s in SECTIONS if re.search(s, text)]
    missing_sections = [s for s in SECTIONS if s not in present_sections]
    score = round(len(present_sections) / len(SECTIONS) * 100, 2)
    return missing_sections, score

def experience_timeline(text):
    pattern = r'(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s+)?experience\s*(?:in|with)?\s*(\w+)'
    matches = re.findall(pattern, text.lower())
    return [(skill, int(years)) for years, skill in matches]

def generate_radar_chart(scores1, scores2, labels, title):
    angles = np.linspace(0, 2 * np.pi, len(labels), endpoint=False).tolist()
    scores1 += scores1[:1]
    scores2 += scores2[:1]
    angles += angles[:1]

    fig, ax = plt.subplots(figsize=(6, 6), subplot_kw=dict(polar=True))
    ax.plot(angles, scores1, 'b-', label='Resume 1')
    ax.fill(angles, scores1, 'b', alpha=0.1)
    ax.plot(angles, scores2, 'r-', label='Resume 2')
    ax.fill(angles, scores2, 'r', alpha=0.1)

    ax.set_thetagrids(np.degrees(angles[:-1]), labels)
    plt.title(title)
    plt.legend()
    return fig

def generate_pie_chart(jd_skills, r1_skills, r2_skills):
    combined = set(jd_skills)
    r1_only = set(r1_skills) - combined
    r2_only = set(r2_skills) - combined
    overlap = set(r1_skills) & set(r2_skills) & combined

    sizes = [len(r1_only), len(r2_only), len(overlap)]
    labels = ['R1 Unique', 'R2 Unique', 'Overlap']
    colors = ['#66b3ff', '#ff9999', '#99ff99']
    
    fig, ax = plt.subplots()
    ax.pie(sizes, labels=labels, colors=colors, autopct='%1.1f%%')
    plt.title("Skill Overlap")
    return fig

def generate_similarity_chart(sim1, sim2, coverage1, coverage2):
    labels = ['Resume 1', 'Resume 2']
    similarity = [sim1, sim2]
    skill_cov = [coverage1, coverage2]

    x = np.arange(len(labels))
    width = 0.35

    fig, ax = plt.subplots()
    ax.bar(x - width/2, similarity, width, label='Similarity %', color='skyblue')
    ax.bar(x + width/2, skill_cov, width, label='Skill Coverage %', color='lightgreen')

    ax.set_ylabel('Percentage')
    ax.set_title('Resume vs JD: Similarity & Skill Match')
    ax.set_xticks(x)
    ax.set_xticklabels(labels)
    ax.legend()
    plt.tight_layout()
    return fig

def generate_experience_chart(exps1, exps2):
    all_skills = list({s for s, _ in exps1 + exps2})
    if not all_skills:
        return None
        
    r1_vals = [next((y for x, y in exps1 if x == s), 0) for s in all_skills]
    r2_vals = [next((y for x, y in exps2 if x == s), 0) for s in all_skills]

    x = np.arange(len(all_skills))
    width = 0.35
    
    fig, ax = plt.subplots()
    ax.bar(x - width/2, r1_vals, width, label='Resume 1')
    ax.bar(x + width/2, r2_vals, width, label='Resume 2')

    ax.set_ylabel('Years')
    ax.set_title('Years of Experience by Skill')
    ax.set_xticks(x)
    ax.set_xticklabels(all_skills, rotation=45)
    ax.legend()
    plt.tight_layout()
    return fig

def scrape_linkedin_profile(url):
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        return ""
    soup = BeautifulSoup(response.text, 'html.parser')
    return soup.get_text(separator=' ')

def fig_to_base64(fig):
    buf = io.BytesIO()
    fig.savefig(buf, format='png', bbox_inches='tight')
    plt.close(fig)
    return base64.b64encode(buf.getbuffer()).decode('ascii')

# ... [imports remain unchanged] ...

@app.route('/api/compare', methods=['POST'])
def compare_resumes_api():
    try:
        print("Received request to /api/compare")
        
        if 'resume1' not in request.files or 'resume2' not in request.files:
            print("One or both resumes are missing in the request")
            return jsonify({'error': 'Missing resume files'}), 400
            
        resume1 = request.files['resume1']
        resume2 = request.files['resume2']
        jd_text = request.form.get('job_description', '')
        linkedin_url = request.form.get('linkedin_url', '')

        print(f"Received resumes: {resume1.filename}, {resume2.filename}")
        print(f"Received job description length: {len(jd_text)}")
        print(f"LinkedIn URL: {linkedin_url}")

        # Save files
        resume1_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(resume1.filename))
        resume2_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(resume2.filename))
        resume1.save(resume1_path)
        resume2.save(resume2_path)
        print("Saved resume files locally.")

        # Extract text
        r1_text = extract_text(resume1_path)
        r2_text = extract_text(resume2_path)
        print("Extracted text from resumes.")

        if linkedin_url:
            linkedin_text = scrape_linkedin_profile(linkedin_url)
            print(f"Scraped LinkedIn profile content (length: {len(linkedin_text)})")
            jd_text += linkedin_text

        # Similarity
        sim1 = compute_similarity(r1_text, jd_text)
        sim2 = compute_similarity(r2_text, jd_text)
        print(f"Similarity computed: Resume 1 -> {sim1}%, Resume 2 -> {sim2}%")

        # Skills
        r1_skills = extract_skills(r1_text)
        r2_skills = extract_skills(r2_text)
        jd_skills = extract_skills(jd_text)
        print("Extracted skills from resumes and job description.")

        r1_flat = [s for v in r1_skills.values() for s in v]
        r2_flat = [s for v in r2_skills.values() for s in v]
        jd_flat = [s for v in jd_skills.values() for s in v]

        scores1 = [len(r1_skills[k])/len(jd_skills[k]) * 100 if jd_skills[k] else 0 for k in SKILL_KEYWORDS]
        scores2 = [len(r2_skills[k])/len(jd_skills[k]) * 100 if jd_skills[k] else 0 for k in SKILL_KEYWORDS]
        print("Calculated skill coverage scores.")

        coverage1 = dict(zip(SKILL_KEYWORDS.keys(), [round(s, 2) for s in scores1]))
        coverage2 = dict(zip(SKILL_KEYWORDS.keys(), [round(s, 2) for s in scores2]))

        # Completeness
        missing1, comp1 = completeness_score(r1_text)
        missing2, comp2 = completeness_score(r2_text)
        print("Calculated completeness score.")

        # Experience timeline
        exp1 = experience_timeline(r1_text)
        exp2 = experience_timeline(r2_text)
        print(f"Experience timelines extracted. Resume 1: {exp1}, Resume 2: {exp2}")

        # Generate charts
        charts = {}
        charts['radar'] = fig_to_base64(generate_radar_chart(
            scores1, scores2, list(SKILL_KEYWORDS.keys()), "Skill Match Radar"
        ))
        print("Generated radar chart.")

        charts['pie'] = fig_to_base64(generate_pie_chart(jd_flat, r1_flat, r2_flat))
        print("Generated pie chart.")

        charts['similarity'] = fig_to_base64(generate_similarity_chart(
            sim1, sim2, np.mean(list(coverage1.values())), np.mean(list(coverage2.values()))
        ))
        print("Generated similarity comparison chart.")

        exp_chart = generate_experience_chart(exp1, exp2)
        if exp_chart:
            charts['experience'] = fig_to_base64(exp_chart)
            print("Generated experience chart.")
        else:
            print("No valid experience data to generate chart.")

        result = {
            "Resume 1": {
                "Similarity": f"{sim1}%",
                "Completeness Score": f"{comp1}%",
                "Missing Sections": missing1,
                "Skill Coverage (%)": coverage1
            },
            "Resume 2": {
                "Similarity": f"{sim2}%",
                "Completeness Score": f"{comp2}%",
                "Missing Sections": missing2,
                "Skill Coverage (%)": coverage2
            },
            "BestFit": "Resume 1" if sim1 > sim2 else "Resume 2"
        }

        print("Returning final JSON response.")
        return jsonify({
            'result': result,
            'charts': charts
        })

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return jsonify({'error': str(e)}), 500

    finally:
        # Clean up
        if 'resume1_path' in locals() and os.path.exists(resume1_path):
            os.remove(resume1_path)
            print("Cleaned up resume1 file.")
        if 'resume2_path' in locals() and os.path.exists(resume2_path):
            os.remove(resume2_path)
            print("Cleaned up resume2 file.")

if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(debug=True, port=5004)