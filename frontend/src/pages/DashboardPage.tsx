import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Send, Shield, AlertTriangle, CheckCircle, AlertCircle,
  Clock, TrendingUp, ShieldAlert, ShieldCheck, Loader2
} from "lucide-react";

interface Flag {
  category: string;
  keyword: string;
  severity: "high" | "medium" | "low";
  reason: string;
}

interface AnalysisResult {
  risk_score: number;
  prediction: string;
  reasons: string[];
  safe_signs: string[];
  flags: Flag[];
  summary: string;
}

interface HistoryItem {
  id: string;
  email_text: string;
  risk_score: number;
  prediction: string;
  timestamp: string;
  user_email: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [emailText, setEmailText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, high: 0, medium: 0, safe: 0 });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const historyStr = localStorage.getItem("internshield_history") || "[]";
    const history: HistoryItem[] = JSON.parse(historyStr);
    const userHistory = history.filter(h => h.user_email === user?.email);
    setStats({
      total: userHistory.length,
      high: userHistory.filter(h => h.prediction === "High Risk Scam").length,
      medium: userHistory.filter(h => h.prediction === "Medium Risk").length,
      safe: userHistory.filter(h => h.prediction === "Safe / Legit").length,
    });
  };

  const analyzeEmail = async () => {
    if (!emailText.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
    const API = import.meta.env.VITE_API_URL || "http://internshield-backend.onrender.com/analyze-email";

const response = await fetch(`${API}/analyze-email`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email_text: emailText }),
});

      if (!response.ok) {
  const errorText = await response.text();
  throw new Error(`Server error: ${response.status} - ${errorText}`);
}

      const data: AnalysisResult = await response.json();
      setResult(data);

      // Save to history
      const historyStr = localStorage.getItem("internshield_history") || "[]";
      const history: HistoryItem[] = JSON.parse(historyStr);
      history.unshift({
        id: Date.now().toString(),
        email_text: emailText,
        risk_score: data.risk_score,
        prediction: data.prediction,
        timestamp: new Date().toISOString(),
        user_email: user?.email || "",
      });
      // Keep max 100 items
      if (history.length > 100) history.splice(100);
      localStorage.setItem("internshield_history", JSON.stringify(history));
      loadStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze. Make sure the backend server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (prediction: string) => {
    if (prediction === "High Risk Scam") return "#ef4444";
    if (prediction === "Medium Risk") return "#eab308";
    return "#22c55e";
  };

  const getRiskBadgeClass = (prediction: string) => {
    if (prediction === "High Risk Scam") return "risk-high";
    if (prediction === "Medium Risk") return "risk-medium";
    return "risk-safe";
  };

  const getRiskGlow = (prediction: string) => {
    if (prediction === "High Risk Scam") return "glow-red";
    if (prediction === "Medium Risk") return "glow-yellow";
    return "glow-emerald";
  };

  const getSeverityColor = (severity: string) => {
    if (severity === "high") return "text-red-400";
    if (severity === "medium") return "text-yellow-400";
    return "text-blue-400";
  };

  const getSeverityBg = (severity: string) => {
    if (severity === "high") return "bg-red-400/10";
    if (severity === "medium") return "bg-yellow-400/10";
    return "bg-blue-400/10";
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 fade-in-up">
        <h1 className="text-2xl font-bold text-white">
          Welcome back, <span className="gradient-text">{user?.name}</span> 👋
        </h1>
        <p className="text-slate-400 text-sm mt-1">Analyze emails to detect potential internship scams</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 fade-in-up fade-in-up-delay-1">
        <div className="glass-card p-4 stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-xs text-slate-500">Total Scans</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.high}</p>
              <p className="text-xs text-slate-500">High Risk</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.medium}</p>
              <p className="text-xs text-slate-500">Medium Risk</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.safe}</p>
              <p className="text-xs text-slate-500">Safe</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-2 gap-6 fade-in-up fade-in-up-delay-2">
        {/* Input Card */}
        <div className="glass-card overflow-hidden">
          <div className="p-5 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">Analyze Email</h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">Paste the internship offer email to scan for scam indicators</p>
          </div>
          <div className="p-5 space-y-4">
            <textarea
              className="textarea-field"
              placeholder="Paste the complete email content here...&#10;&#10;Example: 'Congratulations! You have been selected for an internship at XYZ Corp. Please pay the registration fee of Rs.5000 to confirm your seat...'"
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
              style={{ minHeight: "250px" }}
            />
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}
            <button
              onClick={analyzeEmail}
              disabled={isLoading || !emailText.trim()}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Analyze Email
                </>
              )}
            </button>
          </div>
        </div>

        {/* Result Card */}
        <div className="glass-card overflow-hidden">
          <div className="p-5 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">Analysis Result</h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">Detailed trust report for the scanned email</p>
          </div>
          <div className="p-5">
            {result ? (
              <div className="space-y-5">
                {/* Risk Score Display */}
                <div className={`glass-card p-6 text-center ${getRiskGlow(result.prediction)}`}>
                  <div className="flex items-center justify-center gap-3 mb-3">
                    {result.prediction === "High Risk Scam" && <AlertTriangle className="w-10 h-10 text-red-400" />}
                    {result.prediction === "Medium Risk" && <AlertCircle className="w-10 h-10 text-yellow-400" />}
                    {result.prediction === "Safe / Legit" && <CheckCircle className="w-10 h-10 text-emerald-400" />}
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">{result.prediction}</p>
                  <span className={`risk-badge ${getRiskBadgeClass(result.prediction)}`}>
                    Risk Score: {result.risk_score}/100
                  </span>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-2">
                    <span>Safe</span>
                    <span>Risk Level</span>
                    <span>Dangerous</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${result.risk_score}%`,
                        backgroundColor: getRiskColor(result.prediction),
                      }}
                    />
                  </div>
                </div>

                {/* Warning Signs (Flags from Backend) */}
                {result.flags && result.flags.length > 0 && (
                  <div className="rounded-xl p-4 bg-red-500/5 border border-red-500/10">
                    <h4 className="text-sm font-semibold text-red-400 flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4" />
                      Risk Reasons Identified
                    </h4>
                    <div className="space-y-3">
                      {result.flags.map((flag, i) => (
                        <div key={i} className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${getSeverityBg(flag.severity)} ${getSeverityColor(flag.severity)}`}>
                              {flag.severity}
                            </span>
                            <span className="text-sm font-medium text-slate-200">{flag.category}</span>
                          </div>
                          <p className="text-xs text-slate-400 ml-0 pl-0">{flag.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Safe Indicators (from Backend) */}
                {result.safe_signs && result.safe_signs.length > 0 && (
                  <div className="rounded-xl p-4 bg-emerald-500/5 border border-emerald-500/10">
                    <h4 className="text-sm font-semibold text-emerald-400 flex items-center gap-2 mb-3">
                      <CheckCircle className="w-4 h-4" />
                      Legitimate Indicators Found
                    </h4>
                    <ul className="space-y-2">
                      {result.safe_signs.map((safe, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-emerald-300/80">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                          {safe}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendation */}
                <div className="rounded-xl p-4 bg-blue-500/5 border border-blue-500/10">
                  <h4 className="text-sm font-semibold text-blue-400 mb-2">💡 Recommendation</h4>
                  <p className="text-sm text-slate-300">
                    {result.prediction === "High Risk Scam"
                      ? "This email shows strong scam indicators. Do NOT respond, send money, or share personal information. Report it as spam."
                      : result.prediction === "Medium Risk"
                        ? "This email has some suspicious elements. Verify the company and sender through official channels before proceeding."
                        : "This email appears legitimate. However, always verify the sender's identity and company details independently."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-slate-500">
                <Shield className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-sm font-medium">No analysis yet</p>
                <p className="text-xs mt-1">Paste an email and click Analyze to see results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
