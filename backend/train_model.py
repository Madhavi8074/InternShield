import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

# =========================
# LOAD DATA (FIXED)
# =========================
df = pd.read_csv("dataset.csv", on_bad_lines='skip', engine='python')

print("Original shape:", df.shape)

df = df[['text', 'label']]
df.dropna(inplace=True)

print("Cleaned shape:", df.shape)

# =========================
# SPLIT
# =========================
X_train, X_test, y_train, y_test = train_test_split(
    df['text'],
    df['label'],
    test_size=0.2,
    random_state=42,
    stratify=df['label']
)

# =========================
# PIPELINE (UPGRADED)
# =========================
pipeline = Pipeline([
    ("tfidf", TfidfVectorizer(
        max_features=10000,
        ngram_range=(1, 3),   # 🔥 big improvement
        stop_words="english"
    )),
    ("model", RandomForestClassifier(
        n_estimators=200,
        max_depth=20,
        random_state=42
    ))
])

# =========================
# TRAIN
# =========================
pipeline.fit(X_train, y_train)

# =========================
# EVALUATE
# =========================
y_pred = pipeline.predict(X_test)
print("\nModel Evaluation:\n")
print(classification_report(y_test, y_pred))

# =========================
# SAVE
# =========================
joblib.dump(pipeline, "pipeline.pkl")

print("✅ Pipeline saved!")