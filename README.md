# 🚀 InternShield – Fake Internship Detection System

InternShield is a Chrome Extension + Web App that detects fake internship emails using rule-based AI analysis and highlights scam indicators in real time.

---

## 🔥 Features

- 🔍 Scan internship emails instantly
- 🚨 Detect scam patterns (fees, urgency, fake offers)
- 🎯 Risk classification:
  - 🟢 Safe / Legit
  - 🟡 Medium Risk
  - 🔴 High Risk Scam
- 📊 Confidence score + risk score
- 🧠 Explainable AI (reasons + safe signals)
- ✨ Highlight suspicious keywords inside emails
- 📩 Gmail integration (auto scan + manual scan button)

---

## 🧠 How It Works

1. User opens email (Gmail or extension popup)
2. Chrome Extension extracts email content
3. Sends data to FastAPI backend
4. Backend analyzes using:
   - Keyword detection
   - Pattern matching
   - Risk scoring logic
5. Returns:
   - Prediction
   - Confidence
   - Reasons
6. UI displays result + highlights risky words

---

## 🏗️ Project Structure
InternShield/
├── backend/ # FastAPI backend
│ ├── main.py
│ ├── requirements.txt
│ └── start.sh
│
├── frontend/ # React + Tailwind UI
│ ├── src/
│ └── package.json
│
├── InternShield-Extension/ # Chrome Extension
│ ├── manifest.json
│ ├── popup.html
│ ├── popup.js
│ └── content.js
│
├── README.md
└── .gitignore

---

## ⚙️ Tech Stack

- **Backend:** FastAPI (Python)
- **Frontend:** React + Tailwind CSS
- **Extension:** Chrome Extension (Manifest v3)
- **Logic:** Rule-based NLP + Pattern Detection

---

## 🚀 Setup Instructions

### 🔹 1. Clone Repository
git clone https://github.com/Madhavi8074/InternShield.git

cd InternShield

---

### 🔹 2. Backend Setup
cd backend
python -m venv venv
venv\Scripts\activate # Windows

pip install -r requirements.txt
uvicorn main:app --reload

👉 Runs on: `http://127.0.0.1:8000`

---

### 🔹 3. Frontend Setup
cd frontend
npm install
npm run dev

---

### 🔹 4. Chrome Extension Setup

1. Open Chrome → `chrome://extensions/`
2. Enable **Developer Mode**
3. Click **Load Unpacked**
4. Select `InternShield-Extension` folder

---

## 🌐 Deployment

Backend deployed on:
👉 https://your-app-name.onrender.com

---

## 📊 Example Results

### ✅ Legit Email
- Prediction: Safe / Legit
- Confidence: 98%
- Reasons: No suspicious patterns
- Safe Signs:
  - No payment required
  - Interview process mentioned

---

### ❌ Scam Email
- Prediction: High Risk Scam
- Confidence: 85%
- Reasons:
  - Requests payment
  - Uses urgency
  - Generic greeting

---

## 🧪 Future Improvements

- 🤖 ML-based classification model
- 📧 Gmail auto-scan on open
- 🔐 Authentication system
- 📊 Dashboard for scan history
- 🌍 Multi-language support

---

## 👩‍💻 Author

- Your Name

---

## ⭐ Why This Project Matters

Fake internship scams are increasing rapidly.  
InternShield helps students identify and avoid fraud by analyzing emails intelligently and transparently.

---

## 📌 License

This project is open-source and free to use.
