from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import re
import joblib

app = FastAPI()

# =========================
# ✅ CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# 🤖 Load ML Model
# =========================
pipeline = joblib.load("pipeline.pkl")

# =========================
# 📥 Input Model
# =========================
class EmailInput(BaseModel):
    email_text: str


@app.get("/")
def root():
    return {"message": "InternShield Hybrid Backend Running"}


@app.post("/analyze-email")
def analyze_email(data: EmailInput):
    text = data.email_text
    text_lower = text.lower()

    score = 0
    reasons = []
    safe_signs = []
    flags = []

    # ==============================
    # 🤖 ML PREDICTION
    # ==============================
    ml_prob = pipeline.predict_proba([text])[0][1]
    ml_score = int(ml_prob * 100)

    # ==============================
    # 🚨 RULE-BASED DETECTION
    # ==============================

    money_keywords = ["pay", "fee", "₹", "amount", "payment", "deposit"]
    negative_phrases = [
        "no fee", "no fees", "does not charge",
        "no payment", "free of cost", "without payment"
    ]

    if any(neg in text_lower for neg in negative_phrases):
        score -= 20
        safe_signs.append("Clearly states no payment required")

    elif any(word in text_lower for word in money_keywords):
        score += 40
        reasons.append("Requests payment")
        flags.append("Payment Request")

    if "refundable" in text_lower:
        score += 20
        reasons.append("Uses 'refundable' scam tactic")
        flags.append("Refund Scam")

    if any(word in text_lower for word in ["no interview", "without interview", "guaranteed job"]):
        score += 30
        reasons.append("No proper hiring process")
        flags.append("Fake Hiring")

    if any(word in text_lower for word in ["bank", "aadhar", "pan", "upi", "card"]):
        score += 30
        reasons.append("Requests sensitive information")
        flags.append("Data Theft Risk")

    if any(word in text_lower for word in ["urgent", "act fast", "limited", "hurry"]):
        score += 15
        reasons.append("Uses urgency pressure")
        flags.append("Urgency")

    if any(word in text_lower for word in ["dear candidate", "dear student"]):
        score += 10
        reasons.append("Generic greeting")
        flags.append("Mass Email")

    if any(domain in text_lower for domain in ["@gmail.com", "@yahoo.com"]):
        score += 10
        reasons.append("Uses free email domain")
        flags.append("Unverified Sender")

    money_patterns = re.findall(r'(₹\s*\d+|\d+\s*(rs|inr))', text_lower)
    if money_patterns:
        score += 20
        reasons.append("Mentions specific money amount")

    if any(word in text_lower for word in ["100%", "guaranteed", "assured"]):
        score += 20
        reasons.append("Unrealistic promises")

    # ==============================
    # 🟢 SAFE SIGNALS
    # ==============================
    if "interview" in text_lower:
        score -= 10
        safe_signs.append("Mentions interview process")

    if "website" in text_lower:
        score -= 10
        safe_signs.append("Provides official website")

    if "location" in text_lower:
        score -= 5
        safe_signs.append("Mentions company location")

    # ==============================
    # 🎯 HYBRID FINAL SCORE
    # ==============================
    rule_score = max(0, min(score, 100))

    # Combine ML + Rules (weighted)
    final_score = int((0.8 * ml_score) + (0.2 * rule_score))

    # ==============================
    # 🎯 LABEL DECISION
    # ==============================
    if final_score >= 70:
        label = "High Risk Scam"
    elif final_score >= 40:
        label = "Medium Risk"
    else:
        label = "Safe / Legit"

    # ==============================
    # 📊 CONFIDENCE
    # ==============================
    confidence = int(max(ml_score,final_score))

    # ==============================
    # 🧾 SUMMARY
    # ==============================
    if label == "High Risk Scam":
        summary = f"High scam probability detected (ML: {ml_score}%, Rules: {rule_score}%)."
    elif label == "Medium Risk":
        summary = f"Moderate risk detected (ML: {ml_score}%, Rules: {rule_score}%)."
    else:
        summary = f"Low risk detected (ML: {ml_score}%, Rules: {rule_score}%)."

    # fallback
    if not reasons:
        reasons.append("No strong scam indicators detected")

    return {
        "prediction": label,
        "confidence": confidence,
        "risk_score": final_score,
        "ml_score": ml_score,
        "rule_score": rule_score,
        "reasons": reasons,
        "safe_signs": safe_signs,
        "flags": flags,
        "summary": summary
    }