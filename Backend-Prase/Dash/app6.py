import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
from io import BytesIO
import fitz  # PyMuPDF
from parser import parse_resume, compute_skill_percentages, SKILL_CATEGORIES
from visualizer import show_skill_chart, show_experience_chart, show_certification_chart

app = Flask(__name__)
CORS(app)

def generate_chart_image(chart_function, data):
    """Helper function to generate base64 encoded chart images"""
    import matplotlib.pyplot as plt
    buf = BytesIO()
    fig = plt.figure()
    chart_function(data)
    fig.savefig(buf, format='png', bbox_inches='tight')
    plt.close(fig)
    return base64.b64encode(buf.getvalue()).decode('utf-8')

def extract_text_from_pdf(file_stream):
    """Extracts text from a PDF file stream"""
    text = ""
    try:
        # Rewind the stream to beginning
        file_stream.seek(0)
        
        with fitz.open(stream=file_stream.read(), filetype="pdf") as doc:
            for page in doc:
                text += page.get_text()
    except Exception as e:
        print(f"Error during PDF extraction: {e}")
        raise e
    return text


def process_resume_text(text):
    """Processes resume text and generates analysis results"""
    try:
        # Parse the resume text
        parsed_data = parse_resume(text)
        
        # Debug print to check structure
        print("Parsed Data Structure:", type(parsed_data))
        if isinstance(parsed_data, tuple):
            print("Parsed Data is a tuple, converting to dict")
            # If parse_resume returns a tuple, convert it to a dict
            keys = ['profile', 'skills', 'education', 'experience', 'certifications', 'projects']
            parsed_data = dict(zip(keys, parsed_data))
        
        # Compute skill percentages - now passing both skills and SKILL_CATEGORIES
        skill_percentages = compute_skill_percentages(
            parsed_data.get('skills', []),
            SKILL_CATEGORIES  # Make sure this is imported from parser
        )
        
        # Generate charts
        charts = {
            'skills': generate_chart_image(show_skill_chart, skill_percentages),
            'experience': generate_chart_image(show_experience_chart, parsed_data.get('experience', [])),
            'certifications': generate_chart_image(show_certification_chart, parsed_data.get('certifications', []))
        }
        
        return {
            'profile': parsed_data.get('profile', {}),
            'skills': parsed_data.get('skills', []),  # Empty array if missing
            'education': parsed_data.get('education', []),
            'experience': parsed_data.get('experience', []),
            'certifications': parsed_data.get('certifications', []),
            'projects': parsed_data.get('projects', []),
            'charts': {
                    'skills': generate_chart_image(show_skill_chart, skill_percentages),
                    'experience': generate_chart_image(show_experience_chart, parsed_data.get('experience', [])),
                     'certifications': generate_chart_image(show_certification_chart, parsed_data.get('certifications', []))
              },
             'skill_percentages': skill_percentages

        }
    except Exception as e:
        print(f"Error in process_resume_text: {str(e)}")
        raise e

@app.route('/api/parse-resume', methods=['POST'])
def handle_parse_resume():
    try:
        text = ""
        
        if 'file' in request.files:
            # Handle PDF file upload
            file = request.files['file']
            if file.filename == '':
                return jsonify({"error": "No selected file"}), 400
                
            if not file.filename.lower().endswith('.pdf'):
                return jsonify({"error": "File must be a PDF"}), 400
                
            # Create in-memory file stream
            file_stream = BytesIO()
            file.save(file_stream)
            text = extract_text_from_pdf(file_stream)
            
        elif 'text' in request.form:
            # Handle plain text input
            text = request.form['text']
            if not text.strip():
                return jsonify({"error": "No text provided"}), 400
        else:
            return jsonify({"error": "No resume data provided"}), 400
        
        # Process the extracted text
        result = process_resume_text(text)
        return jsonify(result), 200
        
    except Exception as e:
        print(f"Error in resume parsing: {str(e)}")
        return jsonify({"error": "Failed to process resume", "details": str(e)}), 500

if __name__ == '__main__':
    os.makedirs('uploads', exist_ok=True)
    app.run(host='0.0.0.0', port=5007, debug=True)