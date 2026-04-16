import random
import pandas as pd

scam_templates = [
    "Pay a refundable onboarding fee of Rs {} to proceed",
    "Submit a training deposit of Rs {} before joining",
    "Processing fee of Rs {} required for HR verification",
    "Security deposit of Rs {} needed to confirm internship",
    "Small refundable onboarding charge of Rs {} applies",
    "Training fee of Rs {} will be refunded after completion",
    "Pay Rs {} to activate your internship account",
    "Verification fee of Rs {} required before interview",
    "Registration fee of Rs {} required urgently",
    "Limited slots. Pay Rs {} immediately to secure position"
]

legit_templates = [
    "You are invited for an interview process next week",
    "No payment is required at any stage of recruitment",
    "Selection is based on interviews and assessments",
    "Please attend the interview via official link",
    "Offer letter will be given after interview rounds",
    "We do not charge any fees from candidates",
    "Interview details are shared via official email",
    "Shortlisted candidates will undergo multiple interview rounds",
    "Kindly visit our official website for more details",
    "This is a paid internship with no registration fee"
]

data = []

# 300 scam (more weight = better detection)
for _ in range(300):
    text = random.choice(scam_templates).format(random.randint(500, 5000))
    data.append([text, 1])

# 300 legit
for _ in range(300):
    text = random.choice(legit_templates)
    data.append([text, 0])

df = pd.DataFrame(data, columns=["text", "label"])
df.to_csv("dataset.csv", index=False, quoting=1)

print("✅ 600 rows dataset created")
import pandas as pd

df1 = pd.read_csv("dataset.csv", on_bad_lines='skip', engine='python')
df2 = pd.read_csv("dataset_generated.csv")

df = pd.concat([df1, df2])
df.to_csv("final_dataset.csv", index=False)