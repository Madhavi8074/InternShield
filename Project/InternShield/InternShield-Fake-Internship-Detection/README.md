# InternShield 🚀

InternShield is a hybrid AI-powered system designed to detect fake internship offer emails
in real time. It combines rule-based heuristics with NLP using DistilBERT and provides
an explainable Trust Report to help students identify scams.

## 🔍 Problem Statement
Students frequently receive fake internship offers via email that request money or personal
information. Existing systems are static and lack explainability.

## 💡 Solution
InternShield analyzes email content using:
- Rule-based detection (urgent language, payment requests, fake domains)
- NLP-based analysis using DistilBERT
- Hybrid scoring for high scam recall
- Explainable Trust Reports

## 🏗 System Architecture
- Frontend: Web UI (Lovable-generated, Chrome-extension ready)
- Backend: FastAPI (Python)
- ML Model: DistilBERT (Hugging Face)
- Database: PostgreSQL (feedback storage)

## 🧪 Features
- Real-time email scanning
- High-risk scam detection
- Explainable results
- Feedback-based learning

## 🚀 Future Scope
- Chrome Extension for Gmail
- Full fine-tuned DistilBERT model
- Deployment on cloud

## 👩‍💻 Team
See CONTRIBUTORS.md
