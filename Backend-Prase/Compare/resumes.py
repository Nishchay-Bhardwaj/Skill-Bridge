# resume_comparator_enhanced.py

import os
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

def radar_chart(scores1, scores2, labels, title):
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
    plt.show()

def pie_chart_overlap(jd_skills, r1_skills, r2_skills):
    combined = set(jd_skills)
    r1_only = set(r1_skills) - combined
    r2_only = set(r2_skills) - combined
    overlap = set(r1_skills) & set(r2_skills) & combined

    sizes = [len(r1_only), len(r2_only), len(overlap)]
    labels = ['R1 Unique', 'R2 Unique', 'Overlap']
    colors = ['#66b3ff', '#ff9999', '#99ff99']
    plt.pie(sizes, labels=labels, colors=colors, autopct='%1.1f%%')
    plt.title("Skill Overlap")
    plt.show()

def similarity_vs_skill_chart(sim1, sim2, coverage1, coverage2):
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
    plt.show()


def experience_bar(exps1, exps2):
    all_skills = list({s for s, _ in exps1 + exps2})
    if not all_skills:
        print("⚠ No experience data found to plot.")
        return
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
    plt.show()

def scrape_linkedin_profile(url):
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        return ""
    soup = BeautifulSoup(response.text, 'html.parser')
    return soup.get_text(separator=' ')

def compare_resumes(resume1_path, resume2_path, jd_text, linkedin_url=None):
    r1_text = extract_text(resume1_path)
    r2_text = extract_text(resume2_path)

    if linkedin_url:
        jd_text += scrape_linkedin_profile(linkedin_url)

    sim1 = compute_similarity(r1_text, jd_text)
    sim2 = compute_similarity(r2_text, jd_text)

    r1_skills = extract_skills(r1_text)
    r2_skills = extract_skills(r2_text)
    jd_skills = extract_skills(jd_text)

    r1_flat = [s for v in r1_skills.values() for s in v]
    r2_flat = [s for v in r2_skills.values() for s in v]
    jd_flat = [s for v in jd_skills.values() for s in v]

    scores1 = [len(r1_skills[k])/len(jd_skills[k]) * 100 if jd_skills[k] else 0 for k in SKILL_KEYWORDS]
    scores2 = [len(r2_skills[k])/len(jd_skills[k]) * 100 if jd_skills[k] else 0 for k in SKILL_KEYWORDS]
    coverage1 = dict(zip(SKILL_KEYWORDS.keys(), [round(s, 2) for s in scores1]))
    coverage2 = dict(zip(SKILL_KEYWORDS.keys(), [round(s, 2) for s in scores2]))

    missing1, comp1 = completeness_score(r1_text)
    missing2, comp2 = completeness_score(r2_text)

    exp1 = experience_timeline(r1_text)
    exp2 = experience_timeline(r2_text)

    radar_chart(scores1, scores2, list(SKILL_KEYWORDS.keys()), "Skill Match Radar")
    pie_chart_overlap(jd_flat, r1_flat, r2_flat)
    similarity_vs_skill_chart(sim1, sim2, np.mean(list(coverage1.values())), np.mean(list(coverage2.values()))) # passing sim1, sim2 and mean of coverage1 and coverage2 dictionaries 

    if exp1 or exp2:
        experience_bar(exp1, exp2)

    return {
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
        "Best Fit": "Resume 1" if sim1 > sim2 else "Resume 2"
    }

if _name_ == "_main_":
    resume1 = "/content/22103278 Manav Upadhyay (1).pdf"
    resume2 = "/content/22103284 Nishchay Bhardwaj.pdf"
    job_description = """
    Looking for a data scientist proficient in Python, machine learning, SQL, and model deployment.
    Familiarity with deep learning, NLP, TensorFlow, and soft skills like communication and leadership preferred.
    """
    linkedin_url = "https://www.linkedin.com/in/nishchay-bhardwaj-223358253"

    result = compare_resumes(resume1, resume2, job_description, linkedin_url)
    for k, v in result.items():
        print(f"\n📌 {k}")
        if isinstance(v, dict):
            for key, val in v.items():
                print(f"   {key}: {val}")
        else:
            print(f"   {v}")