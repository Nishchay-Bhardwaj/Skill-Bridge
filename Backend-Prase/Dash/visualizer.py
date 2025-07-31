# visualizer.py

import streamlit as st
import matplotlib.pyplot as plt
from collections import Counter
import plotly.graph_objects as go
import streamlit as st

def show_skill_chart(skills):
    if not skills:
        st.info("No skills detected.")
        return
    skill_counts = Counter(skills)
    labels = list(skill_counts.keys())
    values = list(skill_counts.values())

    fig, ax = plt.subplots()
    ax.barh(labels, values, color='skyblue')
    ax.set_xlabel("Count")
    ax.set_title("Skill Distribution")
    st.pyplot(fig)

def show_experience_chart(experience):
    if not experience:
        st.info("No experience data found.")
        return
    domain_counts = Counter(["Software" if "developer" in e.lower() else "Other" for e in experience])
    labels = list(domain_counts.keys())
    sizes = list(domain_counts.values())

    fig, ax = plt.subplots()
    ax.pie(sizes, labels=labels, autopct='%1.1f%%')
    ax.set_title("Experience Domains")
    st.pyplot(fig)

def show_certification_chart(certifications):
    if not certifications:
        st.info("No certifications found.")
        return
    categories = Counter(["Technical" if any(kw in c.lower() for kw in ["python", "ml", "ai", "data"]) else "General"
                          for c in certifications])
    labels = list(categories.keys())
    sizes = list(categories.values())

    fig, ax = plt.subplots()
    ax.pie(sizes, labels=labels, autopct='%1.1f%%')
    ax.set_title("Certification Categories")
    st.pyplot(fig)

def show_skill_bar_chart(skills):
    """
    skills: dict of skill name -> percentage, e.g.:
    {
        "Front-End Development": 90,
        "Back-End Development": 65,
        ...
    }
    """
    colors = [
        "#A020F0", "#1E90FF", "#32CD32", "#FFA500", "#FF8C00", "#FF4500", "#FF69B4"
    ]

    fig = go.Figure()

    for i, (skill, percent) in enumerate(skills.items()):
        fig.add_trace(go.Bar(
            x=[percent],
            y=[skill],
            orientation='h',
            marker=dict(color=colors[i % len(colors)]),
            text=f"{percent}%",
            textposition='outside'
        ))

    fig.update_layout(
        title="Technical Skills",
        xaxis=dict(range=[0, 100], showgrid=False),
        yaxis=dict(showgrid=False),
        plot_bgcolor='black',
        paper_bgcolor='black',
        font=dict(color='white'),
        margin=dict(l=100, r=20, t=40, b=20),
        height=400 + 40 * len(skills)
    )

    st.plotly_chart(fig, use_container_width=True)
