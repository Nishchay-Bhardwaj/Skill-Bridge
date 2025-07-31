from flask import Flask, request, jsonify, send_file
import os
import uuid
import base64
from skill_gap_analyzer import analyze_skill_gap
import json
from flask_cors import CORS
import base64
from io import BytesIO
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import logging
from matplotlib.patches import Patch
import logging
from datetime import datetime
from werkzeug.utils import secure_filename

# Initialize Flask app
app = Flask(__name__)
CORS(app, expose_headers=["Content-Type"])
TECH_KEYWORDS = {
    'programming': ['python', 'java', 'javascript', 'c++', 'c#', 'go', 'rust', 'swift', 'kotlin'],
    'web': ['html', 'css', 'react', 'angular', 'vue', 'django', 'flask', 'node.js', 'express'],
    'devops': ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'terraform', 'jenkins', 'ansible'],
    'data': ['sql', 'mongodb', 'pandas', 'numpy', 'spark', 'hadoop', 'tensorflow', 'pytorch'],
    'mobile': ['android', 'ios', 'flutter', 'react native', 'xamarin']
}

# Configuration
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PARSED_DATA_FOLDER = os.path.join(BASE_DIR, 'parsed_data')
IMAGE_FOLDER = 'static/images'
# PARSED_DATA_FOLDER = 'parsed_data'

# Ensure directories exist
os.makedirs(IMAGE_FOLDER, exist_ok=True)
os.makedirs(PARSED_DATA_FOLDER, exist_ok=True)

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def clean_old_images():
    """Remove image files older than 1 day"""
    now = datetime.now()
    for filename in os.listdir(IMAGE_FOLDER):
        filepath = os.path.join(IMAGE_FOLDER, filename)
        if os.path.isfile(filepath):
            file_time = datetime.fromtimestamp(os.path.getmtime(filepath))
            if now - file_time > timedelta(days=1):
                try:
                    os.remove(filepath)
                    print(f"Removed old file: {filename}")
                except Exception as e:
                    print(f"Error removing file {filename}: {str(e)}")

def clean_skills(skills: list) -> list:
    """Clean and normalize skills from the resume data"""
    cleaned = []
    for skill in skills:
        skill = skill.replace('##', '').strip().lower()
        skill = skill.replace('c / c++', 'c++').replace('c + +', 'c++')
        if skill and skill not in cleaned:
            cleaned.append(skill)
    return cleaned

def load_resume_data(email: str) -> dict:
    """Load resume data and ensure proper structure"""
    filename = email.replace('@', '_at_').replace('.', '_') + '.json'
    filepath = os.path.join(PARSED_DATA_FOLDER, filename)
    
    try:
        with open(filepath, 'r') as f:
            data = json.load(f)
            if 'skills' not in data:
                data['skills'] = []
            data['skills'] = clean_skills(data['skills'])
            if 'resume_text' not in data:
                data['resume_text'] = " ".join(data['skills'])
            return data
    except Exception as e:
        app.logger.error(f"Error loading {filename}: {str(e)}")
        return None
    

def get_tech_breakdown(text: str) -> dict:
    """Generate a technology breakdown from resume text"""
    breakdown = {}
    text_lower = text.lower()
    
    # Initialize all categories with 0 count
    for category in TECH_KEYWORDS.keys():
        breakdown[category] = 0
    
    # Count occurrences of each technology keyword
    for category, keywords in TECH_KEYWORDS.items():
        for kw in keywords:
            if kw in text_lower:
                breakdown[category] += 1
    
    # Convert counts to percentages
    total = sum(breakdown.values())
    if total > 0:
        return {k: round(v/total*100, 1) for k, v in breakdown.items()}
    return {}

def generate_visualizations(analysis):
    """Generate visualization images and return as base64 strings"""
    try:
        logger.debug("Starting visualization generation")
        
        # Validate analysis data
        if not analysis or 'required_skills' not in analysis or 'matching_skills' not in analysis:
            raise ValueError("Invalid analysis data structure")
        
        skills = analysis['required_skills']
        if not skills or not isinstance(skills, list):
            raise ValueError("Invalid skills data")

        # Initialize result dict
        image_data = {}

        # === Skill Match Bar Chart ===
        plt.figure(figsize=(14, 6))
        matched_skills = {m['required'] for m in analysis['matching_skills']}
        match_status = [skill in matched_skills for skill in skills]
        colors = ['#4CAF50' if matched else '#F44336' for matched in match_status]

        bars = plt.bar(skills, [1] * len(skills), color=colors, edgecolor='black')

        # Add value labels on bars
        for bar, matched in zip(bars, match_status):
            height = bar.get_height()
            label = '✓' if matched else '✗'
            plt.text(bar.get_x() + bar.get_width() / 2.0, height + 0.02, label,
                     ha='center', va='bottom', fontsize=12, weight='bold')

        # Add legend
        legend_elements = [
            Patch(facecolor='#4CAF50', edgecolor='black', label='Matched'),
            Patch(facecolor='#F44336', edgecolor='black', label='Not Matched')
        ]
        plt.legend(handles=legend_elements, loc='upper right', fontsize=10)

        plt.title('Skill Match Overview', fontsize=16, pad=20, weight='bold')
        plt.xticks(rotation=45, ha='right', fontsize=10)
        plt.yticks([])
        plt.grid(axis='y', linestyle='--', alpha=0.6)
        plt.tight_layout()

        img = BytesIO()
        plt.savefig(img, format='png', bbox_inches='tight')
        img.seek(0)
        image_data['skill_match.png'] = base64.b64encode(img.read()).decode('utf-8')
        plt.close()
        logger.debug("Skill match visualization generated")

        # === Technology Pie Chart ===
        if 'tech_breakdown' in analysis and analysis['tech_breakdown']:
            tech_breakdown = analysis['tech_breakdown']
            plt.figure(figsize=(10, 8))
            
            # Filter out categories with 0%
            filtered_breakdown = {k: v for k, v in tech_breakdown.items() if v > 0}
            
            if filtered_breakdown:
                labels = list(filtered_breakdown.keys())
                sizes = list(filtered_breakdown.values())
                
                # Enhanced color palette
                colors = ['#4CAF50', '#2196F3', '#FFC107', '#FF5722', '#9C27B0']
                
                # Create pie chart with graduated explosion effect
                explode = [0.05 if size > 30 else 0.01 for size in sizes]
                
                # Draw the pie chart
                wedges, texts, autotexts = plt.pie(
                    sizes, 
                    explode=explode, 
                    labels=labels, 
                    colors=colors, 
                    autopct='%1.1f%%', 
                    shadow=True, 
                    startangle=90,
                    textprops={'fontsize': 12, 'fontweight': 'bold'},
                    wedgeprops={'edgecolor': 'white', 'linewidth': 1.5}
                )
                
                # Style percentage text
                for autotext in autotexts:
                    autotext.set_color('white')
                    autotext.set_fontweight('bold')
                
                plt.axis('equal')
                plt.title('Technology Category Distribution', fontsize=16, fontweight='bold', pad=20)
                
                # Add legend
                plt.legend(
                    [f"{labels[i]} ({sizes[i]}%)" for i in range(len(labels))],
                    loc="lower center", 
                    bbox_to_anchor=(0.5, -0.15),
                    ncol=2
                )
                
                img2 = BytesIO()
                plt.savefig(img2, format='png', bbox_inches='tight', dpi=150)
                img2.seek(0)
                image_data['tech_pie_chart.png'] = base64.b64encode(img2.read()).decode('utf-8')
                plt.close()
                logger.debug("Technology pie chart visualization generated")
            else:
                logger.debug("No tech breakdown data to visualize")
        else:
            logger.debug("No tech_breakdown in analysis data")

        return image_data

    except Exception as e:
        logger.error(f"Error in visualization generation: {str(e)}", exc_info=True)
        raise

def clean_old_images(max_files=10):
    """Keep only the most recent image files"""
    try:
        images = [os.path.join(IMAGE_FOLDER, f) for f in os.listdir(IMAGE_FOLDER) 
                 if f.endswith(('.png', '.jpg', '.jpeg'))]
        
        if len(images) > max_files:
            images.sort(key=lambda x: os.path.getmtime(x))
            for old_img in images[:-max_files]:
                try:
                    os.remove(old_img)
                    logger.debug(f"Removed old image: {old_img}")
                except Exception as e:
                    logger.error(f"Error removing {old_img}: {str(e)}")
    except Exception as e:
        logger.error(f"Error cleaning old images: {str(e)}")
@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        print("🔵 /api/analyze endpoint hit")
        data = request.get_json()
        print("Received JSON payload:", data)
        
        job_role = data.get('job_role')
        email = data.get('email')

        if not job_role or not email:
            return jsonify({"error": "Job role and email are required"}), 400

        resume_data = load_resume_data(email)
        if not resume_data:
            print(f"No resume data found for email: {email}")
            return jsonify({"error": "Resume data not found"}), 404

        print("Loaded resume data:", resume_data)

        # Perform analysis
        skills_text = ", ".join(resume_data['skills'])
        full_text = f"{resume_data.get('resume_text', '')} {skills_text}"
        analysis = analyze_skill_gap(job_role, full_text)
        print("Skill gap analysis result:", analysis)

        if 'tech_breakdown' not in analysis:
            analysis['tech_breakdown'] = get_tech_breakdown(full_text)

        # Generate visualizations
        image_data = generate_visualizations(analysis)
        print("Visualizations generated. Available images:", list(image_data.keys()))

        # Generate unique filenames for images
        images = {}
        
        try:
            # Save skill match image
            if 'skill_match.png' in image_data:
                skill_match_filename = f'skill_match_{uuid.uuid4().hex}.png'
                skill_match_path = os.path.join(IMAGE_FOLDER, skill_match_filename)
                
                with open(skill_match_path, 'wb') as f:
                    f.write(base64.b64decode(image_data['skill_match.png']))
                
                images['skill_match'] = f'/api/images/{skill_match_filename}'
                print(f"Saved skill match image to {skill_match_path}")
            else:
                print("Warning: skill_match.png not in image_data")

            # Save tech pie chart if it exists
            if 'tech_pie_chart.png' in image_data:
                tech_pie_filename = f'tech_pie_{uuid.uuid4().hex}.png'
                tech_pie_path = os.path.join(IMAGE_FOLDER, tech_pie_filename)
                
                with open(tech_pie_path, 'wb') as f:
                    f.write(base64.b64decode(image_data['tech_pie_chart.png']))
                
                images['tech_pie_chart'] = f'/api/images/{tech_pie_filename}'
                print(f"Saved tech pie chart to {tech_pie_path}")
            else:
                print("No tech pie chart data to save")

            # Verify images saved
            for img_type, img_path in images.items():
                full_path = os.path.join(IMAGE_FOLDER, os.path.basename(img_path))
                if not os.path.exists(full_path):
                    print(f"ERROR: {img_type} image was not saved at {full_path}")
                else:
                    print(f"Successfully verified {img_type} at {full_path}")

        except Exception as e:
            print(f"Detailed error saving images: {str(e)}")
            import traceback
            traceback.print_exc()
            return jsonify({"error": f"Failed to save visualizations: {str(e)}"}), 500
        
        # Clean up old images
        clean_old_images()

        # Prepare result for storage
        output = {
            "timestamp": datetime.now().isoformat(),
            "job_role": job_role,
            "skills": resume_data['skills'],
            "match_percentage": analysis['match_percentage'],
            "required_skills": analysis['required_skills'],
            "candidate_skills": analysis['candidate_skills'],
            "tech_breakdown": analysis.get('tech_breakdown', {}),
            "images": images
        }

        # Append to parsed_data/<email>.json under "gap"
        safe_name = email.replace('@', '_at_').replace('.', '_')
        file_path = os.path.join(PARSED_DATA_FOLDER, f"{safe_name}.json")

        try:
            if os.path.exists(file_path):
                with open(file_path, "r", encoding="utf-8") as f:
                    existing_data = json.load(f)
            else:
                existing_data = {}

            if "gap" not in existing_data:
                existing_data["gap"] = []

            existing_data["gap"].append(output)

            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(existing_data, f, indent=2)

        except Exception as e:
            return jsonify({"error": f"Failed to save gap analysis: {str(e)}"}), 500

        return jsonify(output), 200

    except Exception as e:
        print("Exception occurred:", str(e))
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/images/<filename>')
def serve_image(filename):
    try:
        # Security checks
        if '..' in filename or filename.startswith('/'):
            logger.warning(f"Invalid filename requested: {filename}")
            return jsonify({"error": "Invalid filename"}), 400
            
        image_path = os.path.join(IMAGE_FOLDER, filename)
        print('pp',image_path)
        # Check if file exists and is an image
        if not os.path.isfile(image_path):
            logger.error(f"Image not found: {image_path}")
            return jsonify({"error": "Image not found"}), 404
            
        if not filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            logger.warning(f"Invalid file type requested: {filename}")
            return jsonify({"error": "Invalid file type"}), 400
            
        # Serve image with CORS
        response = send_file(image_path, mimetype='image/png')
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
        
    except Exception as e:
        logger.error(f"Error serving image {filename}: {str(e)}", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(debug=True,port=5000)