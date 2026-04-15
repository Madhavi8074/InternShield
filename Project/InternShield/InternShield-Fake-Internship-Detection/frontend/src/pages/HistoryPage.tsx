import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  History as HistoryIcon, Trash2, Search, AlertTriangle,
  AlertCircle, CheckCircle, ChevronDown, ChevronUp, X
} from "lucide-react";

interface HistoryItem {
  id: string;
  email_text: string;
  risk_score: number;
  prediction: string;
  timestamp: string;
  user_email: string;
}

export default function HistoryPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRisk, setFilterRisk] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const historyStr = localStorage.getItem("internshield_history") || "[]";
    const allHistory: HistoryItem[] = JSON.parse(historyStr);
    setHistory(allHistory.filter(h => h.user_email === user?.email));
  };

  const deleteItem = (id: string) => {
    const historyStr = localStorage.getItem("internshield_history") || "[]";
    const allHistory: HistoryItem[] = JSON.parse(historyStr);
    const updated = allHistory.filter(h => h.id !== id);
    localStorage.setItem("internshield_history", JSON.stringify(updated));
    loadHistory();
  };

  const clearAll = () => {
    const historyStr = localStorage.getItem("internshield_history") || "[]";
    const allHistory: HistoryItem[] = JSON.parse(historyStr);
    const updated = allHistory.filter(h => h.user_email !== user?.email);
    localStorage.setItem("internshield_history", JSON.stringify(updated));
    loadHistory();
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.email_text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterRisk === "all" || item.prediction === filterRisk;
    return matchesSearch && matchesFilter;
  });

  const getRiskBadgeClass = (prediction: string) => {
    if (prediction === "High Risk Scam") return "risk-high";
    if (prediction === "Medium Risk") return "risk-medium";
    return "risk-safe";
  };

  const getRiskIcon = (prediction: string) => {
    if (prediction === "High Risk Scam") return <AlertTriangle className="w-4 h-4" />;
    if (prediction === "Medium Risk") return <AlertCircle className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <HistoryIcon className="w-6 h-6 text-emerald-400" />
            Scan History
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {history.length} scan{history.length !== 1 ? "s" : ""} recorded
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/30 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="glass-card p-4 mb-6 fade-in-up fade-in-up-delay-1">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            {[
              { value: "all", label: "All" },
              { value: "High Risk Scam", label: "High Risk" },
              { value: "Medium Risk", label: "Medium" },
              { value: "Safe / Legit", label: "Safe" },
            ].map(filter => (
              <button
                key={filter.value}
                onClick={() => setFilterRisk(filter.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterRisk === filter.value
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                    : "text-slate-400 hover:text-slate-300 hover:bg-white/5 border border-transparent"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-3 fade-in-up fade-in-up-delay-2">
        {filteredHistory.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <HistoryIcon className="w-16 h-16 mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400 font-medium">
              {history.length === 0 ? "No scans yet" : "No results match your filters"}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              {history.length === 0
                ? "Go to Dashboard and analyze an email to see it here"
                : "Try adjusting your search or filter criteria"}
            </p>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div key={item.id} className="glass-card overflow-hidden history-item">
              <div
                className="p-4 flex items-center gap-4 cursor-pointer"
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              >
                <div className="flex-shrink-0">
                  {getRiskIcon(item.prediction)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">
                    {item.email_text.substring(0, 100)}...
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`risk-badge text-[10px] ${getRiskBadgeClass(item.prediction)}`}>
                      {item.prediction}
                    </span>
                    <span className="text-xs text-slate-500">{formatDate(item.timestamp)}</span>
                    <span className="text-xs text-slate-500">Score: {item.risk_score}/100</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteItem(item.id);
                    }}
                    className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {expandedId === item.id ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </div>
              </div>

              {/* Expanded Content */}
              {expandedId === item.id && (
                <div className="px-4 pb-4 border-t border-white/5 pt-4">
                  <div className="rounded-lg bg-white/[0.02] p-4">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">Full Email Content</h4>
                    <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {item.email_text}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="rounded-lg bg-white/[0.02] p-3">
                      <p className="text-xs text-slate-500">Risk Score</p>
                      <p className="text-lg font-bold text-white">{item.risk_score}/100</p>
                    </div>
                    <div className="rounded-lg bg-white/[0.02] p-3">
                      <p className="text-xs text-slate-500">Scanned On</p>
                      <p className="text-sm font-medium text-white">{formatDate(item.timestamp)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
