from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import re

app = FastAPI()

# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Request model
class EmailInput(BaseModel):
    email_text: str


@app.get("/")
def root():
    return {"message": "InternShield Backend Running"}


@app.post("/analyze-email")
def analyze_email(data: EmailInput):
    text = data.email_text.lower()

    score = 0
    reasons = []
    safe_signs = []
    flags = []

    # ==============================
    # 🚨 PAYMENT DETECTION (SMART)
    # ==============================
    money_keywords = ["pay", "fee", "₹", "amount", "payment", "deposit"]

    negative_phrases = [
        "no fee", "no fees", "does not charge",
        "no payment", "free of cost", "without payment"
    ]

    if any(neg in text for neg in negative_phrases):
        score -= 30
        safe_signs.append("Clearly states no payment required")

    elif any(word in text for word in money_keywords):
        score += 40
        reasons.append("Requests payment")
        flags.append("Payment Request")

    # ==============================
    # 🚨 HIGH RISK
    # ==============================
    if "refundable" in text:
        score += 20
        reasons.append("Uses 'refundable' scam tactic")
        flags.append("Refund Scam")

    if any(word in text for word in ["no interview", "without interview", "guaranteed job"]):
        score += 30
        reasons.append("No proper hiring process")
        flags.append("Fake Hiring")

    if any(word in text for word in ["bank", "aadhar", "pan", "upi", "card"]):
        score += 30
        reasons.append("Requests sensitive personal information")
        flags.append("Data Theft Risk")

    # ==============================
    # ⚠️ MEDIUM RISK
    # ==============================
    if any(word in text for word in ["urgent", "act fast", "limited", "hurry"]):
        score += 15
        reasons.append("Uses urgency pressure")
        flags.append("Urgency")

    if any(word in text for word in ["dear candidate", "dear student"]):
        score += 10
        reasons.append("Generic greeting")
        flags.append("Mass Email")

    if any(domain in text for domain in ["@gmail.com", "@yahoo.com"]):
        score += 10
        reasons.append("Uses free email domain")
        flags.append("Unverified Sender")

    # ==============================
    # 🔍 PATTERN DETECTION
    # ==============================
    money_patterns = re.findall(r'(₹\s*\d+|\d+\s*(rs|inr))', text)
    if money_patterns:
        score += 20
        reasons.append("Mentions specific money amount")

    if any(word in text for word in ["100%", "guaranteed", "surely", "assured"]):
        score += 20
        reasons.append("Unrealistic promises")

    # ==============================
    # 🟢 SAFE SIGNALS
    # ==============================
    if "interview" in text:
        score -= 10
        safe_signs.append("Mentions interview process")

    if "official website" in text or "visit our website" in text:
        score -= 10
        safe_signs.append("Provides official website")

    if "location" in text:
        score -= 5
        safe_signs.append("Mentions company location")

    # ==============================
    # 🎯 FINAL SCORING
    # ==============================
    score = max(0, min(score, 100))

    if score >= 60:
        label = "High Risk Scam"
    elif score >= 30:
        label = "Medium Risk"
    else:
        label = "Safe / Legit"

    # ✅ Confidence Logic
    if label == "Safe / Legit":
        confidence = min(90 + len(safe_signs) * 2, 100)
    elif label == "Medium Risk":
        confidence = min(score + 20, 100)
    else:
        confidence = score

    # ✅ Fix empty reasons
    if len(reasons) == 0:
        reasons.append("No suspicious patterns found")

    # ✅ Better summary
    if label == "Safe / Legit":
        summary = "This email appears legitimate based on multiple trust signals."
    elif label == "Medium Risk":
        summary = "This email shows some suspicious patterns. Be cautious."
    else:
        summary = "This email has strong scam indicators. Avoid engaging."

    return {
        "prediction": label,
        "confidence": confidence,
        "risk_score": score,
        "reasons": reasons,
        "safe_signs": safe_signs,
        "flags": flags,
        "summary": summary
    }