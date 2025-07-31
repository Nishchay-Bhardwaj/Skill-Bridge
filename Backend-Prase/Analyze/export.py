
def export_analysis(analysis, format='json'):
    """Export analysis in different formats"""
    if format.lower() == 'json':
        # Create a deep copy of the analysis to avoid modifying the original
        analysis_copy = analysis.copy() 

        # Convert any NumPy float32/float64 values to regular Python floats
        def convert_numpy_floats(obj):
            if isinstance(obj, (np.float32, np.float64)):
                return float(obj)
            elif isinstance(obj, dict):
                return {k: convert_numpy_floats(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [convert_numpy_floats(item) for item in obj]
            else:
                return obj
            
        analysis_copy = convert_numpy_floats(analysis_copy)

        with open('skill_gap_analysis.json', 'w') as f:
            json.dump(analysis_copy, f, indent=2)
    elif format.lower() == 'pdf':
        # ... (rest of the pdf export code remains the same)
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        
        # Add title
        pdf.cell(200, 10, txt=f"Skill Gap Analysis: {analysis['job_role']}", 
                ln=1, align='C')
        
        # Add sections
        sections = [
            ("Your Skills", ', '.join(analysis['candidate_skills'])),
            ("Missing Skills", ', '.join(analysis['missing_skills'])),
            ("Match Percentage", f"{analysis['match_percentage']:.1f}%")
        ]
        
        for title, content in sections:
            pdf.set_font("Arial", 'B', 12)
            pdf.cell(200, 10, txt=title, ln=1)
            pdf.set_font("Arial", size=12)
            pdf.multi_cell(0, 10, txt=content)
            pdf.ln(5)
        
        # Add visualizations if they exist
        if os.path.exists('skill_match.png'):
            pdf.image('skill_match.png', x=10, w=190)
        if os.path.exists('similarity_heatmap.png'):
            pdf.image('similarity_heatmap.png', x=10, w=190)
        
        pdf.output("skill_gap_analysis.pdf")
