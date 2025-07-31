import os
import json
import requests
import base64
from io import BytesIO
from flask import Flask, request, jsonify
from flask_cors import CORS
from urllib.parse import quote_plus
import matplotlib
matplotlib.use('Agg')  # Set the backend to Agg
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from math import pi
import seaborn as sns
from flask import request, jsonify
from datetime import datetime
import uuid
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# Configuration
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PARSED_DATA_FOLDER = os.path.join(BASE_DIR, 'parsed_data')
os.makedirs(PARSED_DATA_FOLDER, exist_ok=True)

# API Configuration
COURSERA_API_KEY = "API KEY"
GITHUB_API_KEY = "API KEY"
VISUALIZATION_STYLE = 'whitegrid'

def load_resume_data(email: str) -> dict:
    """Load and clean resume data from parsed_data folder (using first gap only)"""
    print(f"Loading resume data for email: {email}")
    safe_email = email.replace('@', '_at_').replace('.', '_')
    filepath = os.path.join(PARSED_DATA_FOLDER, f"{safe_email}.json")

    try:
        with open(filepath, 'r') as f:
            raw_data = json.load(f)

            # Extract only the first gap entry
            gap_list = raw_data.get('gap', [])
            if not gap_list:
                print(f"No 'gap' data found for {email}")
                return None

            first_gap = gap_list[-1]

            # Build a simplified response using the first gap
            data = {
                "job_role": first_gap.get("job_role"),
                "skills": first_gap.get("skills", []),
                "candidate_skills": first_gap.get("candidate_skills", []),
                "required_skills": first_gap.get("required_skills", []),
                "match_percentage": first_gap.get("match_percentage"),
                "skill_match_image": first_gap.get("images", {}).get("skill_match"),
                "resume_text": " ".join(first_gap.get("skills", []))  # or candidate_skills
            }

            print(f"Resume data loaded successfully for {email}")
            return data

    except Exception as e:
        print(f"Error loading resume data: {str(e)}")
        return None


def fetch_coursera_courses(skill: str) -> list:
    """Fetch courses from Coursera API"""
    print(f"Fetching Coursera courses for skill: {skill}")
    url = f"https://api.coursera.org/api/courses.v1?q=search&query={quote_plus(skill)}&fields=name,primaryLanguages,partnerIds,slug"
    headers = {'Authorization': f'Bearer {COURSERA_API_KEY}'}
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            print(f"Coursera API response: {response.json()}")
            return [{
                'type': 'Course',
                'platform': 'Coursera',
                'title': course.get('name', f'{skill} Course'),
                'url': f"https://www.coursera.org/learn/{course.get('slug', '')}",
                'language': course.get('primaryLanguages', ['English'])[0],
                'priority': 'High'
            } for course in response.json().get('elements', [])[:3]]
    except Exception as e:
        print(f"Error fetching Coursera courses: {str(e)}")
    return []

def fetch_github_projects(skill: str) -> list:
    """Fetch relevant GitHub projects"""
    print(f"Fetching GitHub projects for skill: {skill}")
    url = f"https://api.github.com/search/repositories?q={quote_plus(skill)}+in:readme+language:python"
    headers = {'Authorization': f'token {GITHUB_API_KEY}'}
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            print(f"GitHub API response: {response.json()}")
            return [{
                'type': 'Project',
                'platform': 'GitHub',
                'title': item.get('name', f'{skill} Project'),
                'url': item.get('html_url', ''),
                'difficulty': 'Medium',
                'duration': '2-4 weeks',
                'priority': 'Medium'
            } for item in response.json().get('items', [])[:3]]
    except Exception as e:
        print(f"Error fetching GitHub projects: {str(e)}")
    return []

def generate_visualizations(analysis: dict) -> dict:
    """Generate visualizations and return as base64 encoded images"""
    print("Generating visualizations...")
    sns.set_theme(style=VISUALIZATION_STYLE)
    visualizations = {}

    # Skill Match Gauge
    fig, ax = plt.subplots(figsize=(6, 6))
    match_percentage = analysis.get('match_percentage', 0)
    ax.barh([0], [match_percentage], 
            color=['green' if match_percentage >= 70 
                  else 'yellow' if match_percentage >= 40 
                  else 'red'])
    ax.set_xlim(0, 100)
    ax.set_yticks([])
    ax.set_xlabel('Skill Match Percentage')
    ax.set_title('Skill Match Percentage', pad=20)
    ax.text(match_percentage, 0, f'{match_percentage:.1f}%', 
           ha='center', va='center', color='black', fontweight='bold')
    
    buf = BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', dpi=100)
    visualizations['skill_match'] = base64.b64encode(buf.getvalue()).decode('utf-8')
    plt.close(fig)

    # Skill Radar Chart
    # Skill Radar Chart
    categories = {
    'Frontend': ['html', 'css', 'javascript', 'react', 'angular'],
    'Backend': ['node.js', 'express', 'python', 'java', 'php'],
    'Database': ['sql', 'mongodb', 'postgresql', 'mysql', 'firebase'],
    'DevOps': ['aws', 'docker', 'kubernetes', 'git', 'ci/cd']
    }

    radar_data = []
    for category, skills in categories.items():
       total = len([s for s in skills if s in analysis['required_skills']])
       if total > 0:
         matched = len([s for s in skills if s in analysis['required_skills'] and s in analysis['matched_skills']])
         radar_data.append({'category': category, 'percentage': (matched / total) * 100})


    if radar_data:
        df = pd.DataFrame(radar_data)
        N = len(df)
        angles = [n / float(N) * 2 * pi for n in range(N)] + [0]
        values = df['percentage'].tolist() + [df['percentage'].tolist()[0]]

        fig = plt.figure(figsize=(8, 8))
        ax = fig.add_subplot(111, polar=True)
        ax.plot(angles, values, linewidth=2, linestyle='solid', 
               color='#1f77b4', marker='o', markersize=8)
        ax.fill(angles, values, '#1f77b4', alpha=0.25)
        ax.set_xticks(angles[:-1])
        ax.set_xticklabels(df['category'], size=12)
        ax.set_rlabel_position(30)
        plt.yticks([20, 40, 60, 80], ["20%", "40%", "60%", "80%"], color="grey", size=10)
        plt.ylim(0, 100)
        plt.title('Skill Match by Category', size=14, pad=20)
        
        buf = BytesIO()
        plt.savefig(buf, format='png', bbox_inches='tight', dpi=100)
        visualizations['skill_radar'] = base64.b64encode(buf.getvalue()).decode('utf-8')
        plt.close(fig)

    print("Visualizations generated successfully.")
    return visualizations


@app.route('/api/learn', methods=['POST'])
def analyze():
    """Main endpoint for skill gap analysis"""
    try:
        data = request.get_json()
        email = data.get('email')

        if not email:
            print("Error: Email is required")
            return jsonify({"error": "Email is required"}), 400

        print(f"Received analysis request for email: {email}")

        # Load user data (returns first gap object already)
        resume_data = load_resume_data(email)
        if not resume_data:
            print(f"Error: Resume data not found for {email}")
            return jsonify({"error": "Resume data not found"}), 404

        # Use data directly from resume_data
        analysis = {
            'job_role': resume_data.get('job_role'),
            'match_percentage': resume_data.get('match_percentage'),
            'required_skills': resume_data.get('required_skills', []),
            'matched_skills': list(set(resume_data.get('candidate_skills', [])) & set(resume_data.get('required_skills', []))),
            'missing_skills': list(set(resume_data.get('required_skills', [])) - set(resume_data.get('candidate_skills', []))),
            'candidate_skills': resume_data.get('candidate_skills', [])
        }

        # print(f"Analysis data for {email}: {analysis}")

        # Generate visualizations
        visualizations = generate_visualizations(analysis)

        # Generate recommendations
        recommendations = []
        for skill in analysis['missing_skills'][:3]:
            recommendations.extend(fetch_coursera_courses(skill))
            recommendations.extend(fetch_github_projects(skill))
            print(fetch_coursera_courses(skill))
        print(recommendations)
        # Prepare response
        response = {
            "timestamp": datetime.now().isoformat(),
            "job_role": analysis['job_role'],
            "match_percentage": analysis['match_percentage'],
            "required_skills": analysis['required_skills'],
            "matched_skills": analysis['matched_skills'],
            "missing_skills": analysis['missing_skills'],
            "recommendations": recommendations,
            "visualizations": visualizations
        }

        # print(f"Analysis response for {email}: {response}")

        # Save to parsed_data (optional)
        save_analysis_result(email, response)

        return jsonify(response), 200

    except Exception as e:
        print(f"Error during analysis: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


def save_analysis_result(email: str, analysis: dict):
    """Save analysis results to parsed_data folder"""
    print(f"Saving analysis result for {email}")
    safe_email = email.replace('@', '_at_').replace('.', '_')
    filepath = os.path.join(PARSED_DATA_FOLDER, f"{safe_email}.json")
    
    try:
        existing_data = {}
        if os.path.exists(filepath):
            with open(filepath, 'r') as f:
                existing_data = json.load(f)
        
        if 'gap_analyses' not in existing_data:
            existing_data['gap_analyses'] = []
        
        existing_data['gap_analyses'].append(analysis)
        
        with open(filepath, 'w') as f:
            json.dump(existing_data, f, indent=2)

        print(f"Analysis saved successfully for {email}")

    except Exception as e:
        print(f"Error saving analysis: {str(e)}")

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(debug=True, port=5002)
