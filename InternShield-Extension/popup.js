const API = "https://internshield-backend.onrender.com";
document.getElementById("scanBtn").addEventListener("click", check);

async function check() {
  const text = document.getElementById("text").value;

  // 🚫 Empty input check
  if (!text.trim()) {
    alert("Enter email text");
    return;
  }

  try {
    const response = await fetch(`${API}/analyze-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email_text: text })
    });

    if (!response.ok) throw new Error("Server error");

    const data = await response.json();

    // 🎯 Show result card
    document.getElementById("card").style.display = "block";

    // =========================
    // 🔴 Prediction Color
    // =========================
    let color = "green";
    if (data.prediction.includes("High")) color = "red";
    else if (data.prediction.includes("Medium")) color = "orange";

    document.getElementById("prediction").innerHTML =
      `<b style="color:${color};">${data.prediction}</b>`;

    // =========================
    // 📊 Risk Meter
    // =========================
    const risk = data.risk_score;
    const fill = document.getElementById("riskFill");

    fill.style.width = risk + "%";

    // clean class handling
    fill.classList.remove("red", "orange", "green");

    if (risk >= 60) fill.classList.add("red");
    else if (risk >= 30) fill.classList.add("orange");
    else fill.classList.add("green");

    // =========================
    // 📈 Confidence
    // =========================
    document.getElementById("confidence").innerHTML = `
      <b>Confidence:</b> ${data.confidence}%<br>
      <b>Risk Score:</b> ${risk}/100
    `;

    // =========================
    // 🚨 Reasons
    // =========================
    document.getElementById("reasons").innerHTML =
      data.reasons.length
        ? data.reasons.map(r => `<div class="tag danger">${r}</div>`).join("")
        : "<i>No suspicious patterns found</i>";

    // =========================
    // 🟢 Safe Signs
    // =========================
    document.getElementById("safe").innerHTML =
  data.safe_signs.length
    ? data.safe_signs.map(s => `<li>${s}</li>`).join("")
    : "<i>No strong trust signals</i>";
    // =========================
    // 🔍 Highlighted Email (Popup Safe)
    // =========================
    const keywords = [
      "pay", "fee", "₹", "urgent", "limited",
      "hurry", "refundable", "bank", "upi", "guaranteed"
    ];

    let highlighted = text;

    keywords.forEach(word => {
      const regex = new RegExp(`\\b(${word})\\b`, "gi");
      highlighted = highlighted.replace(
        regex,
        `<mark style="background:yellow;">$1</mark>`
      );
    });

    // fallback if no keywords found
    if (!highlighted.includes("<mark")) {
      highlighted = "<i>No risky keywords detected</i><br><br>" + highlighted;
    }

    // preserve line breaks
    highlighted = highlighted.replace(/\n/g, "<br>");

   document.getElementById("highlighted").innerHTML = `
  <div style="
    max-height:150px;
    overflow-y:auto;
    padding:8px;
    border:1px solid #ddd;
    border-radius:6px;
    background:#fafafa;
    font-size:12px;
  ">
    ${highlighted}
  </div>
`;
  } catch (error) {
    alert("Backend not running");
    console.error(error);
  }
}