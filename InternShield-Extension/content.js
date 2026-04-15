// 🧠 Extract email content safely
function extractEmailText() {
  const emailBody = document.querySelector(".a3s");

  if (emailBody) {
    return {
      text: emailBody.innerText,
      element: emailBody
    };
  }
  return null;
}

// 🎯 Add Scan Button
function addScanButton() {
  if (document.getElementById("scan-email-btn")) return;

  const toolbar = document.querySelector(".G-tF"); // Gmail toolbar
  if (!toolbar) return;

  const btn = document.createElement("button");
  btn.id = "scan-email-btn";
  btn.innerText = "Scan Email";

  btn.style.marginLeft = "10px";
  btn.style.padding = "6px 10px";
  btn.style.border = "none";
  btn.style.borderRadius = "5px";
  btn.style.background = "#007bff";
  btn.style.color = "white";
  btn.style.cursor = "pointer";

  btn.onclick = scanEmail;

  toolbar.appendChild(btn);
}

// 🚀 Scan function
async function scanEmail() {
  const emailData = extractEmailText();
  if (!emailData) return;

  const { text, element } = emailData;

  try {
    const response = await fetch("http://127.0.0.1:8000/analyze-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email_text: text })
    });

    const data = await response.json();

    showResult(data);
    highlightRiskyWords(element);

  } catch (err) {
    console.error("Scan failed", err);
  }
}

// 🎨 Show floating result
function showResult(data) {
  let existing = document.getElementById("internshield-box");
  if (existing) existing.remove();

  let color = "green";
  if (data.prediction.includes("High")) color = "red";
  else if (data.prediction.includes("Medium")) color = "orange";

  const box = document.createElement("div");

  box.id = "internshield-box";
  box.innerHTML = `
    <div style="
      position:fixed;
      top:80px;
      right:20px;
      background:white;
      padding:12px;
      border-radius:10px;
      box-shadow:0 0 10px rgba(0,0,0,0.3);
      z-index:9999;
      width:260px;
      font-family:Arial;
    ">
      <b style="color:${color}; font-size:16px;">
        ${data.prediction}
      </b><br><br>

      Confidence: ${data.confidence}%<br>
      Risk Score: ${data.risk_score}/100<br><br>

      <b>Reasons:</b><br>
      ${data.reasons.join("<br>")}
    </div>
  `;

  document.body.appendChild(box);
}

// 🔥 Highlight risky words in Gmail
function highlightRiskyWords(element) {
  const riskyWords = [
    "pay", "fee", "₹", "urgent", "limited",
    "hurry", "refundable", "bank", "upi", "guaranteed"
  ];

  if (element.getAttribute("data-highlighted")) return;
element.setAttribute("data-highlighted", "true");

let html = element.innerHTML;

  riskyWords.forEach(word => {
    const regex = new RegExp(`(${word})`, "gi");
    html = html.replace(
      regex,
      `<span style="background:yellow; font-weight:bold;">$1</span>`
    );
  });

  element.innerHTML = html;
}

// ⏳ Wait for Gmail to load
setInterval(() => {
  addScanButton();
}, 3000);