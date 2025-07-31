# parser.py

import re
from io import BytesIO
from pdfminer.high_level import extract_text
import spacy

nlp = spacy.load("en_core_web_sm")

SKILL_CATEGORIES = {
    "Front-End Development": ["HTML", "CSS", "JavaScript", "React", "Bootstrap", "Tailwind"],
    "Back-End Development": ["Node.js", "Express", "Django", "Flask", "Spring", "Ruby on Rails"],
    "Database Management": ["MySQL", "PostgreSQL", "MongoDB", "SQLite", "Oracle"],
    "DevOps & CI/CD": ["Docker", "Kubernetes", "Jenkins", "GitHub Actions", "CI/CD", "Terraform"],
    "Cloud Services (AWS/Azure)": ["AWS", "Azure", "GCP", "Lambda", "EC2", "S3"],
    "UI/UX Design": ["Figma", "Adobe XD", "Sketch", "Wireframing", "Prototyping"]
}

def extract_text_from_pdf(uploaded_file):
    return extract_text(BytesIO(uploaded_file.read()))

def extract_contact_info(text):
    if isinstance(text, tuple):  # added check
        text = " ".join(text)

    name = re.findall(r'^[A-Z][a-z]+\s[A-Z][a-z]+', text)
    email = re.findall(r'\S+@\S+', text)
    phone = re.findall(r'\+?\d[\d\s]{8,}', text)
    github = re.findall(r'https?://github\.com/\S+', text)
    linkedin = re.findall(r'https?://(www\.)?linkedin\.com/\S+', text)

    return (
        name[0] if name else "Not Found",
        phone[0] if phone else "Not Found",
        email[0] if email else "Not Found",
        github[0] if github else "Not Found",
        linkedin[0] if linkedin else "Not Found"
    )

def extract_skills(text):
    skill_keywords = ['python', 'java', 'c++', 'html', 'css', 'javascript', 'react', 'node', 'machine learning',
                      'nlp', 'sql', 'mongodb', 'git', 'docker', 'aws', 'tensorflow', 'pytorch']
    skills_found = [kw.title() for kw in skill_keywords if re.search(r'\b' + kw + r'\b', text, re.IGNORECASE)]
    return skills_found

def extract_sections(text, keyword):
    pattern = rf'{keyword}\s*:?[\n\-•]*([\s\S]*?)(\n\n|$)'
    result = re.findall(pattern, text, re.IGNORECASE)
    return [line.strip("•- ") for block in result for line in block[0].split("\n") if line.strip()] if result else []

def compute_skill_percentages(resume_text, skill_categories):
    text = resume_text.lower()
    category_percentages = {}

    for category, subskills in skill_categories.items():
        found = 0
        for skill in subskills:
            # Simple presence check (case-insensitive)
            if re.search(r'\b' + re.escape(skill.lower()) + r'\b', text):
                found += 1
        percentage = int((found / len(subskills)) * 100) if subskills else 0
        category_percentages[category] = percentage

    return category_percentages

def parse_resume(resume_input, from_pdf=False):
    if from_pdf:
        text = extract_text_from_pdf(resume_input)
    else:
        text = resume_input

    name, phone, email, github, linkedin = extract_contact_info(text)
    skills = extract_skills(text)
    education = extract_sections(text, "Education")
    experience = extract_sections(text, "Experience")
    certifications = extract_sections(text, "Certifications")
    projects = extract_sections(text, "Projects")

    return name, phone, email, github, linkedin, skills, education, experience, certifications, projects
