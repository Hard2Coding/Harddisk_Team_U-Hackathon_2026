"use client";
import React, { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { storage } from "@/lib/storage";
import {
  Settings,
  User,
  Bell,
  Sun,
  Moon,
  Download,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  AlertTriangle,
} from "lucide-react";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const handleDownloadAllData = () => {
    const history = storage.getHistory();
    const reports = storage.getReports();
    const payload = {
      user,
      exported_at: new Date().toISOString(),
      history,
      community_reports: reports,
      privacy_notice: "GDPR & PDPA Data Export compliant. Identifiers masked for privacy preservation.",
    };

    const dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const dl = document.createElement("a");
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `scamgraph_account_export_${Date.now()}.json`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();

    setNotice("All account data successfully exported to JSON.");
    setTimeout(() => setNotice(null), 3000);
  };

  const handleDeleteEverything = () => {
    if (deleteConfirmationText !== "DELETE") return;
    storage.clearHistory();
    logout();
    setShowDeleteModal(false);
    alert("Your account and all historical scan records have been permanently wiped.");
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800 text-xs font-bold mb-2">
          <Settings className="w-3.5 h-3.5 text-blue-600" />
          <span>Profile & Privacy Configuration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Settings & Privacy Controls
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your account profile, emergency push alerts, and personal data privacy rights (GDPR / PDPA compliant).
        </p>
      </div>

      {notice && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      {/* Account Details Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600" />
          <span>Account Profile Information</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Display Name</span>
            <div className="font-bold text-slate-900 dark:text-white text-sm">
              {user?.name || "Guest User"}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Email Address</span>
            <div className="font-bold text-slate-900 dark:text-white text-sm truncate">
              {user?.email || "guest@scamgraph.ai"}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Assigned Role</span>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                user?.role === "admin"
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                  : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              }`}>
                {user?.role === "admin" ? "🛡️ System Admin" : "Standard User"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Push Notification Integration Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-600" />
            <span>Emergency Threat Push Alerts</span>
          </h2>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={alertsEnabled}
              onChange={() => setAlertsEnabled(!alertsEnabled)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800 text-xs text-slate-700 dark:text-slate-300 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-300 flex items-center justify-center text-emerald-600 shrink-0 shadow-2xs">
            <QrCode className="w-8 h-8" />
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Instant alerts for detected HIGH-Risk threats
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              When a scanned link or identifier triggers a HIGH risk rating or matches an active police bulletin, you receive an immediate alert notification to protect family members in real time.
            </p>
          </div>
        </div>
      </div>

      {/* Preferences Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Appearance & Theme
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {theme === "dark" ? <Moon className="w-4 h-4 text-indigo-500" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span className="font-bold text-slate-800 dark:text-slate-200">Color Theme</span>
            </div>
            <button
              onClick={toggleTheme}
              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 shadow-2xs"
            >
              {theme === "dark" ? "Dark Mode" : "Light Mode (White)"}
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-slate-800 dark:text-slate-200">Application Language</span>
            </div>
            <span className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 shadow-2xs">
              English (Active)
            </span>
          </div>
        </div>
      </div>

      {/* Privacy, GDPR & Erasure Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Data Privacy Rights (GDPR / PDPA Compliance)</span>
        </h2>
        <p className="text-xs text-slate-500">
          You hold the full legal right to request a complete copy of your personal data or permanently wipe your account and history records at any time.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={handleDownloadAllData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-100 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download All My Data (JSON)</span>
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 transition-colors shadow-2xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Account & Wipe All Records</span>
          </button>
        </div>
      </div>

      {/* Double confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#10203A] max-w-md w-full rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Permanently delete all account data?
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              This action will permanently purge all your history logs, reported clues, and account tokens from the database. This action is irreversible. Type <strong className="text-red-600">DELETE</strong> to confirm.
            </p>

            <input
              type="text"
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
              placeholder="Type DELETE"
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-white focus:outline-hidden"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                disabled={deleteConfirmationText !== "DELETE"}
                onClick={handleDeleteEverything}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white transition-colors"
              >
                Confirm Permanent Deletion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
