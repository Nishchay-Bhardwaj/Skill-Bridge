import base64
from io import BytesIO
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import logging
from matplotlib.patches import Patch

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

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

        # === Improved Skill Match Bar Chart ===
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
        skill_match_img_base64 = base64.b64encode(img.read()).decode('utf-8')
        plt.close()
        logger.debug("Skill match visualization generated")

        # === Improved Similarity Heatmap ===
       
       

        img2 = BytesIO()
        plt.savefig(img2, format='png', bbox_inches='tight')
        img2.seek(0)
        similarity_heatmap_img_base64 = base64.b64encode(img2.read()).decode('utf-8')
        plt.close()
        logger.debug("Heatmap visualization generated")

        return {
            'skill_match.png': skill_match_img_base64,
        }

    except Exception as e:
        logger.error(f"Error in visualization generation: {str(e)}", exc_info=True)
        raise
