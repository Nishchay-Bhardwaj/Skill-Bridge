from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import BertTokenizerFast, BertForTokenClassification
import fitz  # PyMuPDF
import os
import json
import torch
from itertools import groupby

app = Flask(__name__)
CORS(app, expose_headers=["Content-Type"])

# Load model and tokenizer
MODEL_DIR = "C:\\Users\\vanshika\\Downloads\\model\\resume\\checkpoint"

model = BertForTokenClassification.from_pretrained(MODEL_DIR)
tokenizer = BertTokenizerFast.from_pretrained(MODEL_DIR)
id2label = model.config.id2label

def extract_text_from_pdf(path):
    text = ""
    with fitz.open(path) as doc:
        for page in doc:
            text += page.get_text()
    return text

def get_entities(text):
    encoding = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        max_length=512,
        return_offsets_mapping=True
    )
    inputs = {k: v for k, v in encoding.items() if k != "offset_mapping"}
    offsets = encoding["offset_mapping"][0].numpy()

    with torch.no_grad():
        outputs = model(**inputs)
    logits = outputs.logits
    predictions = torch.argmax(logits, dim=2)[0].numpy()
    tokens = tokenizer.convert_ids_to_tokens(inputs["input_ids"][0])

    results = []
    for token, pred_id, offset in zip(tokens, predictions, offsets):
        if offset[0] == offset[1]:
            continue
        label = id2label[pred_id]
        results.append((token, label))
    return results

def merge_entities(results):
    merged = []
    for label, group in groupby(results, key=lambda x: x[1]):
        if label != "O":
            tokens = [token for token, _ in group]
            entity = tokenizer.convert_tokens_to_string(tokens).strip()
            merged.append({"label": label, "text": entity})
    return merged

def structure_entities(merged, raw_text):
    structured = {
        "contactInfo": [], "education": [],
        "skills": [], "projects": [],
        "workExperience": []
    }

    for ent in merged:
        lbl = ent["label"].lower()
        phrase = ent["text"]
        if "contact" in lbl:
            structured["contactInfo"].append(phrase)
        elif "education" in lbl:
            structured["education"].append(phrase)
        elif "skill" in lbl or "misc" in lbl:
            structured["skills"].append(phrase)
        elif "project" in lbl:
            structured["projects"].append(phrase)
        elif "experience" in lbl or "work" in lbl:
            structured["workExperience"].append(phrase)

    # ✅ Manual fallback for known skills based on raw text
    manual_skills = [
        "VS Code", "Data Structures and Algorithms", "Operating System",
        "DSA", "Git", "FastAPI", "Computer Networking","JavaScript","C++","css","sql"
    ]
    for skill in manual_skills:
        if skill.lower() in raw_text.lower():
            if skill not in structured["skills"]:
                structured["skills"].append(skill)

    return structured


@app.route("/api/resume-parser", methods=["POST"])
def upload_resume():
    if "file" not in request.files or "userEmail" not in request.form:
        return jsonify({"error": "File or userEmail not provided"}), 400

    file = request.files["file"]
    user_email = request.form["userEmail"]
    print(user_email)
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    temp_path = "temp.pdf"
    file.save(temp_path)

    try:
        # 1) RAW TEXT
        text = extract_text_from_pdf(temp_path)
        print("\n\n===== RAW EXTRACTED TEXT =====\n")
        print(text)
        print("\n===== END RAW TEXT =====\n")

        # 2) TOKEN‑LEVEL NER
        ner_results = get_entities(text)
        print("\n\n===== TOKEN-LEVEL NER OUTPUT =====\n")
        for token, label in ner_results[:100]:  # first 100 tokens
            print(f"{token:>10} → {label}")
        print(f"... (total tokens: {len(ner_results)})")
        print("\n===== END TOKEN NER =====\n")

        # 3) MERGED ENTITIES
        merged = merge_entities(ner_results)
        print("\n\n===== MERGED ENTITIES =====\n")
        for ent in merged:
            print(f"{ent['label']}: {ent['text']}")
        print("\n===== END MERGED =====\n")

        # 4) STRUCTURED JSON
        structured = structure_entities(merged,text)
        print("\n\n===== STRUCTURED OUTPUT =====\n")
        print(json.dumps(structured, indent=2))
        print("\n===== END STRUCTURED =====\n")

        # format and save
        formatted_entities = [f"B-{ent['label']}: {ent['text']}" for ent in merged]
        safe_name = user_email.replace("@", "_at_").replace(".", "_")
        os.makedirs("parsed_data", exist_ok=True)
        out_path = f"parsed_data/{safe_name}.json"
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(structured, f, indent=2)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

    return jsonify({
        "data": structured,
        "entities": formatted_entities
    }), 200

if __name__ == "__main__":
    os.makedirs("parsed_data", exist_ok=True)
    app.run(debug=True, port=5001)

