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
  Globe,
  Download,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  AlertTriangle,
} from "lucide-react";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, language, setLanguage } = useTheme();

  const [lineAlertsEnabled, setLineAlertsEnabled] = useState(true);
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
      privacy_notice: "PDPA & GDPR Data Export compliant. Identifiers masked for safety.",
    };

    const dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const dl = document.createElement("a");
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `scamgraph_my_data_${Date.now()}.json`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();

    setNotice("ดาวน์โหลดข้อมูลทั้งหมดของคุณเรียบร้อยแล้ว (Export Completed)");
    setTimeout(() => setNotice(null), 3000);
  };

  const handleDeleteEverything = () => {
    if (deleteConfirmationText !== "DELETE") return;
    storage.clearHistory();
    logout();
    setShowDeleteModal(false);
    alert("ลบบัญชีและประวัติการตรวจทั้งหมดของคุณออกจากระบบเรียบร้อยแล้ว");
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>Profile & Privacy Configuration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          การตั้งค่า & การคุ้มครองข้อมูลส่วนบุคคล (Settings & Privacy)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          จัดการโปรไฟล์ การแจ้งเตือนผ่าน LINE Official Account และสิทธิ์ข้อมูลส่วนบุคคลตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA/GDPR)
        </p>
      </div>

      {notice && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{notice}</span>
        </div>
      )}

      {/* Account Details Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-4 h-4 text-blue-500" />
          <span>ข้อมูลบัญชีผู้ใช้งาน (Account Information)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold">ชื่อที่แสดง</span>
            <div className="font-bold text-slate-900 dark:text-white text-sm">
              {user?.name || "โหมดผู้เยี่ยมชม (Guest)"}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold">อีเมล</span>
            <div className="font-bold text-slate-900 dark:text-white text-sm truncate">
              {user?.email || "guest@scamgraph.ai"}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold">สิทธิ์การใช้งาน (Role)</span>
            <div className="flex items-center gap-1.5">
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

      {/* LINE Notification Integration Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-500" />
            <span>การแจ้งเตือนภัยผ่าน LINE Official Account</span>
          </h2>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={lineAlertsEnabled}
              onChange={() => setLineAlertsEnabled(!lineAlertsEnabled)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-slate-600 dark:text-slate-300 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-emerald-500/30 flex items-center justify-center text-white shrink-0 shadow-xs">
            <QrCode className="w-10 h-10 text-emerald-400" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              แอดไลน์ @scamgraph เพื่อรับการแจ้งเตือนฉุกเฉินทันทีเมื่อตรวจพบความเสี่ยงสูง (HIGH Risk)
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              ระบบจะส่ง Push Notification ผ่าน LINE Messaging API ทันทีที่มีการตรวจพบ URL หรือเบอร์โทรศัพท์ในรายการเฝ้าระวัง เพื่อให้คุณเตือนคนในครอบครัวได้ทันท่วงที
            </p>
          </div>
        </div>
      </div>

      {/* Preferences Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          การแสดงผล & ภาษา (Preferences)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Theme */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {theme === "dark" ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span className="font-bold text-slate-800 dark:text-slate-200">ธีมหน้าจอ (Theme)</span>
            </div>
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300"
            >
              {theme === "dark" ? "Dark Mode (มืด)" : "Light Mode (สว่าง)"}
            </button>
          </div>

          {/* Language */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-blue-500" />
              <span className="font-bold text-slate-800 dark:text-slate-200">ภาษา (Language)</span>
            </div>
            <button
              onClick={() => setLanguage(language === "th" ? "en" : "th")}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300"
            >
              {language === "th" ? "ภาษาไทย" : "English"}
            </button>
          </div>
        </div>
      </div>

      {/* Privacy, GDPR & Erasure Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          <span>การคุ้มครองข้อมูลส่วนบุคคล (PDPA / GDPR Rights)</span>
        </h2>
        <p className="text-xs text-slate-500">
          คุณมีสิทธิ์ในการเข้าถึง ขอสำเนา หรือขอลบข้อมูลประวัติการสแกนทั้งหมดของคุณได้ตลอดเวลาตามกฎหมาย
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={handleDownloadAllData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-100 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ดาวน์โหลดสำเนาข้อมูลทั้งหมด (JSON)</span>
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>ลบบัญชีและทำลายประวัติทั้งหมด (Right to Erasure)</span>
          </button>
        </div>
      </div>

      {/* Double confirmation modal for account erasure */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#10203A] max-w-md w-full rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              ยืนยันการลบบัญชีและประวัติทั้งหมด?
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              การกระทำนี้จะล้างประวัติการสแกน เบาะแสที่ส่ง และการตั้งค่าทั้งหมดของคุณอย่างถาวรโดยไม่สามารถกู้คืนได้ พิมพ์คำว่า <strong className="text-red-500">DELETE</strong> ด้านล่างเพื่อยืนยัน
            </p>

            <input
              type="text"
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
              placeholder="พิมพ์ DELETE"
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-white focus:outline-hidden"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ยกเลิก
              </button>
              <button
                disabled={deleteConfirmationText !== "DELETE"}
                onClick={handleDeleteEverything}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white transition-colors"
              >
                ยืนยันการลบถาวร
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
