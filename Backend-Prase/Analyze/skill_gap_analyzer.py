import requests
from bs4 import BeautifulSoup
from transformers import AutoModel, AutoTokenizer
import torch
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import re
from collections import defaultdict
import json

# Initialize SBERT model
tokenizer = AutoTokenizer.from_pretrained('sentence-transformers/all-mpnet-base-v2')
model = AutoModel.from_pretrained('sentence-transformers/all-mpnet-base-v2')

# Skill normalization dictionary
SKILL_NORMALIZATION = {
    # same dictionary as in your original code
     'aws': 'amazon web services',
    'js': 'javascript',
    'reactjs': 'react',
    'postgres': 'postgresql',
    'ai': 'artificial intelligence',
    'ml': 'machine learning',
    'dl': 'deep learning',
    'nlp': 'natural language processing',
    'node': 'node.js',
    'nodejs': 'node.js',
    'golang': 'go',
    'c#': 'csharp',
    'tf': 'tensorflow',
    'k8s': 'kubernetes'

}

def get_embeddings(texts):
    """Get SBERT embeddings for multiple texts"""
    inputs = tokenizer(texts, return_tensors="pt", padding=True, truncation=True, max_length=128)
    with torch.no_grad():
        outputs = model(**inputs)
    return outputs.last_hidden_state.mean(dim=1).numpy()

def extract_skills_from_job_postings(job_role):
    """Extract skills from multiple job postings"""
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        url = f"https://www.indeed.com/jobs?q={job_role.replace(' ', '+')}&limit=5"
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract job descriptions
        descriptions = [desc.get_text() for desc in soup.select('.job-snippet')[:5]]
        
        # Enhanced technical skills pattern
        skill_pattern = re.compile(
            r'\b(?:proficient in|experienced with|worked with|skills in)\s+([\w\+#\.]+)|'
            r'\b(python|java|c\+\+|c#|go|rust|swift|kotlin|typescript|'
            r'scala|r|ruby|php|perl|haskell|elixir|erlang|'
            r'sql|nosql|javascript|html|css|react|angular|vue|svelte|'
            r'django|flask|fastapi|node\.?js|express|nestjs|spring|'
            r'aws|azure|gcp|docker|kubernetes|terraform|ansible|'
            r'machine learning|deep learning|data science|ai|llms|'
            r'tensorflow|pytorch|keras|pandas|numpy|spark|hadoop|'
            r'git|jenkins|github actions|linux|unix|bash|'
            r'ci/cd|tdd|agile|scrum|devops|mlops)\b',
            re.IGNORECASE
        )
        
        # Extract and normalize skills
        skills = defaultdict(int)
        for desc in descriptions:
            found_skills = re.findall(skill_pattern, desc.lower())
            for skill in found_skills:
                # Handle both group matches
                skill = skill[0] if skill[0] else skill[1]
                # Normalize skill names
                skill = SKILL_NORMALIZATION.get(skill, skill)
                skills[skill] += 1
        
        # Get top 15 most frequently mentioned skills
        top_skills = sorted(skills.items(), key=lambda x: x[1], reverse=True)[:15]
        return [skill[0] for skill in top_skills]
    
    except Exception as e:
        print(f"Error fetching job postings: {e}")
        return []



def extract_skills_from_resume(resume_text):
    """Extract skills from resume text using pattern matching"""
    # Enhanced technical skills pattern
    skill_pattern = re.compile(
        r'\b(?:proficient in|experienced with|worked with|skills in)\s+([\w\+#\.]+)|'
        r'\b(python|java|c\+\+|c#|go|rust|swift|kotlin|typescript|'
        r'scala|r|ruby|php|perl|haskell|elixir|erlang|'
        r'sql|nosql|javascript|data structures and algorithms|html|css|react|angular|vue|svelte|'
        r'django|flask|fastapi|node\.?js|express|nestjs|spring|'
        r'aws|azure|gcp|docker|javascript||kubernetes|terraform|ansible|'
        r'machine learning|deep learning|data science|ai|llms|'
        r'tensorflow|pytorch|keras|pandas|numpy|spark|hadoop|'
        r'git|jenkins|github actions|linux|unix|bash|'
        r'ci/cd|tdd|agile|scrum|devops|mlops)\b',
        re.IGNORECASE
    )
    
    # Soft skills pattern
    soft_skill_pattern = re.compile(
        r'\b(communication|teamwork|leadership|problem solving|creativity|'
        r'adaptability|time management|critical thinking|collaboration|'
        r'emotional intelligence|negotiation|presentation|public speaking)\b',
        re.IGNORECASE
    )
    
    # Extract and normalize skills
    skills = set()
    found_skills = re.findall(skill_pattern, resume_text.lower())
    for skill in found_skills:
        # Handle both group matches
        skill = skill[0] if skill[0] else skill[1]
        skills.add(SKILL_NORMALIZATION.get(skill, skill))
    
    return list(skills)


def analyze_skill_gap(job_role, resume_text, similarity_threshold=0.7):
    """Perform complete skill gap analysis"""
    # Get required skills
    required_skills = extract_skills_from_job_postings(job_role)
    if not required_skills:
        required_skills = get_fallback_skills(job_role)
    
    # Get candidate skills
    candidate_skills = extract_skills_from_resume(resume_text)
    
    # Get embeddings for all skills
    all_skills = list(set(required_skills + candidate_skills))
    skill_embeddings = get_embeddings(all_skills)
    skill_to_embedding = {skill: emb for skill, emb in zip(all_skills, skill_embeddings)}
    
    # Find matches
    matching_skills = []
    missing_skills = []
    
    for req_skill in required_skills:
        best_match = None
        highest_similarity = 0
        
        for cand_skill in candidate_skills:
            similarity = cosine_similarity(
                [skill_to_embedding[req_skill]],
                [skill_to_embedding[cand_skill]]
            )[0][0]
            
            if similarity > highest_similarity:
                highest_similarity = similarity
                best_match = cand_skill
        
        if highest_similarity >= similarity_threshold:
            matching_skills.append({
                'required': req_skill,
                'candidate': best_match,
                'similarity': highest_similarity
            })
        else:
            missing_skills.append(req_skill)
    
    # Calculate match percentage
    match_percentage = len(matching_skills) / len(required_skills) * 100 if required_skills else 0
    
    return {
        'job_role': job_role,
        'required_skills': required_skills,
        'candidate_skills': candidate_skills,
        'matching_skills': sorted(matching_skills, key=lambda x: x['similarity'], reverse=True),
        'missing_skills': missing_skills,
        'match_percentage': match_percentage
    }


def get_fallback_skills(job_role):
    """Fallback skills if web scraping fails"""
    job_role = job_role.lower()
    if 'data' in job_role and 'scien' in job_role:
        return ['python', 'sql', 'machine learning', 'statistics', 'pandas', 
                'numpy', 'data visualization', 'tensorflow', 'pytorch', 'llms']
    elif 'python' in job_role:
        return ['python', 'django', 'flask', 'sql', 'aws', 'rest api', 'git', 'fastapi']
    elif 'web' in job_role:
        return ['JavaScript', 'html', 'css', 'react', 'node.js', 'express', 'typescript','mongodb','sql']
    elif 'devops' in job_role:
        return ['docker', 'kubernetes', 'aws', 'ci/cd', 'terraform', 'ansible']
    elif 'software' in job_role:
        return ['Data Structures and Algorithms', 'c + +', 'python', 'problem solving', 'git', 'testing']
    else:
        return ['python', 'sql', 'git', 'problem solving', 'communication']


def analyze_soft_skills(text):
    """Analyze soft skills from text"""
    soft_skill_pattern = re.compile(
        r'\b(communication|teamwork|leadership|problem solving|creativity|'
        r'adaptability|time management|critical thinking|collaboration|'
        r'emotional intelligence|negotiation|presentation|public speaking)\b',
        re.IGNORECASE
    )
    return list(set([skill.lower() for skill in re.findall(soft_skill_pattern, text)]))
