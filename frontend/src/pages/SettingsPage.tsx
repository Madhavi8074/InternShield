import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Settings as SettingsIcon, User, Bell, Shield, Trash2,
  Save, Check, Info
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem("internshield_notifications") !== "false";
  });
  const [autoSave, setAutoSave] = useState(() => {
    return localStorage.getItem("internshield_autosave") !== "false";
  });
  const [saved, setSaved] = useState(false);

  const saveSettings = () => {
    localStorage.setItem("internshield_notifications", String(notifications));
    localStorage.setItem("internshield_autosave", String(autoSave));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const clearHistory = () => {
    const historyStr = localStorage.getItem("internshield_history") || "[]";
    const allHistory = JSON.parse(historyStr);
    const updated = allHistory.filter((h: { user_email: string }) => h.user_email !== user?.email);
    localStorage.setItem("internshield_history", JSON.stringify(updated));
    alert("Scan history cleared successfully!");
  };

  const getHistoryCount = () => {
    const historyStr = localStorage.getItem("internshield_history") || "[]";
    const allHistory = JSON.parse(historyStr);
    return allHistory.filter((h: { user_email: string }) => h.user_email === user?.email).length;
  };

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-6 fade-in-up">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-emerald-400" />
          Settings
        </h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <div className="glass-card overflow-hidden mb-4 fade-in-up fade-in-up-delay-1">
        <div className="p-5 border-b border-white/5">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-400" />
            Profile Information
          </h2>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Full Name</label>
            <div className="input-field bg-white/[0.02] cursor-default flex items-center">
              <span className="text-white">{user?.name}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Email Address</label>
            <div className="input-field bg-white/[0.02] cursor-default flex items-center">
              <span className="text-white">{user?.email}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
            <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <p className="text-xs text-blue-300">Profile information is set during registration and stored locally.</p>
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="glass-card overflow-hidden mb-4 fade-in-up fade-in-up-delay-2">
        <div className="p-5 border-b border-white/5">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-400" />
            Preferences
          </h2>
        </div>
        <div className="p-5 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Analysis Notifications</p>
              <p className="text-xs text-slate-500 mt-0.5">Show alerts after email analysis completes</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                notifications ? "bg-emerald-500" : "bg-slate-600"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  notifications ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>

          <div className="border-t border-white/5" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Auto-Save History</p>
              <p className="text-xs text-slate-500 mt-0.5">Automatically save all email scans to history</p>
            </div>
            <button
              onClick={() => setAutoSave(!autoSave)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                autoSave ? "bg-emerald-500" : "bg-slate-600"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  autoSave ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Data Section */}
      <div className="glass-card overflow-hidden mb-4 fade-in-up fade-in-up-delay-3">
        <div className="p-5 border-b border-white/5">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            Data & Storage
          </h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div>
              <p className="text-sm font-medium text-white">Scan History</p>
              <p className="text-xs text-slate-500 mt-0.5">{getHistoryCount()} scans stored locally</p>
            </div>
            <button
              onClick={clearHistory}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
            <Info className="w-4 h-4 text-yellow-400 flex-shrink-0" />
            <p className="text-xs text-yellow-300">All data is stored locally in your browser. Clearing browser data will remove all stored information.</p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="fade-in-up fade-in-up-delay-3">
        <button
          onClick={saveSettings}
          className="btn-primary flex items-center gap-2"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Settings
            </>
          )}
        </button>
      </div>

      {/* About Section */}
      <div className="glass-card overflow-hidden mt-6 fade-in-up fade-in-up-delay-3">
        <div className="p-5">
          <h2 className="text-base font-semibold text-white mb-3">About InternShield</h2>
          <div className="space-y-2 text-sm text-slate-400">
            <p>InternShield is an AI-powered system designed to detect fake internship offer emails in real time.</p>
            <p>It combines rule-based heuristics with NLP analysis to provide explainable Trust Reports that help students identify scams.</p>
            <div className="flex items-center gap-4 pt-3 border-t border-white/5 mt-3">
              <span className="text-xs text-slate-500">Version 1.0.0</span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-emerald-400">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
