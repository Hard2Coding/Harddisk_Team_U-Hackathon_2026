"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { storage } from "@/lib/storage";
import { AdminStats, CommunityReport } from "@/types/api";
import { formatDate } from "@/lib/utils";
import {
  ShieldCheck,
  Activity,
  Sliders,
  CheckCircle,
  XCircle,
  Clock,
  Cpu,
  RefreshCw,
  Database,
  Lock,
  Sparkles,
  AlertCircle,
} from "lucide-react";

export default function AdminPage() {
  const { user, loginAsDemoAdmin } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [thresholds, setThresholds] = useState({ medium: 40, high: 70 });
  const [moderationReason, setModerationReason] = useState("");
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [isRetraining, setIsRetraining] = useState(false);

  const loadData = async () => {
    try {
      const s = await api.getAdminStats();
      const r = await api.listReports();
      setStats(s);
      setReports(r);
      setThresholds(s.thresholds);
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleModerate = async (id: string, status: "confirmed" | "rejected") => {
    if (!moderationReason.trim()) {
      alert("กรุณาระบุเหตุผลการตรวจสอบ (Mandatory Moderation Reason)");
      return;
    }
    await api.moderateReport(id, status, moderationReason);
    setModerationReason("");
    setActionNotice(`บันทึกสถานะรายงานเป็น ${status === "confirmed" ? "อนุมัติ" : "ปฏิเสธ"} เรียบร้อยแล้ว`);
    loadData();
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleSaveThresholds = async () => {
    await api.updateThresholds(thresholds);
    setActionNotice("บันทึกค่าเกณฑ์การตัดสินความเสี่ยงเรียบร้อยแล้ว (Thresholds Updated)");
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleTriggerTraining = () => {
    setIsRetraining(true);
    setTimeout(() => {
      setIsRetraining(false);
      setActionNotice("โมเดลจำแนกข้อความ (TF-IDF LR) และ XGBoost URL ได้รับการฝึกสอนใหม่เรียบร้อยแล้ว (F1 Score: 0.942)");
      setTimeout(() => setActionNotice(null), 4000);
    }, 2000);
  };

  // Guard: if user is not admin
  if (user?.role !== "admin") {
    return (
      <div className="p-8 sm:p-12 text-center max-w-lg mx-auto bg-white dark:bg-[#10203A] rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 my-8">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          ต้องใช้สิทธิ์ผู้ดูแลระบบ (Admin Role Required)
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          หน้านี้สงวนไว้สำหรับเจ้าหน้าที่ดูแลระบบและการตรวจสอบคัดกรองเบาะแสภัยคุกคาม
        </p>
        <button
          onClick={loginAsDemoAdmin}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-purple-500/30 hover:opacity-90 transition-opacity"
        >
          สลับเป็นบัญชี Demo Admin ทันที
        </button>
      </div>
    );
  }

  const pendingReports = reports.filter((r) => r.status === "pending");

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Security Operations & Threat Moderation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          ศูนย์ควบคุมระบบและความปลอดภัย (Admin Control Center)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          ตรวจสอบคัดกรองเบาะแส ปรับเกณฑ์ความเสี่ยงระบบ และบริหารจัดการชุดโมเดลการประเมินภัย
        </p>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-xs text-slate-400">การสแกนทั้งหมด</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {stats.total_analyses}
            </div>
            <div className="text-[10px] text-emerald-500 mt-0.5">Active Traffic</div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-xs text-slate-400">ภัยความเสี่ยงสูง (High)</div>
            <div className="text-2xl font-black text-red-500 mt-1">
              {stats.high_risk_count}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">{(stats.high_risk_count / stats.total_analyses * 100).toFixed(1)}% of total</div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-xs text-slate-400">เบาะแสรอคัดกรอง</div>
            <div className="text-2xl font-black text-amber-500 mt-1">
              {pendingReports.length}
            </div>
            <div className="text-[10px] text-amber-500 mt-0.5">ต้องการการตรวจสอบ</div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-xs text-slate-400">สถานะโมเดล ML</div>
            <div className="text-sm font-bold text-purple-600 dark:text-purple-400 mt-2">
              v2 Production
            </div>
            <div className="text-[10px] text-emerald-500 mt-0.5">Healthy & Calibrated</div>
          </div>
        </div>
      )}

      {/* Report Moderation Queue */}
      <div className="bg-white dark:bg-[#10203A] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>คิวตรวจสอบเบาะแสจากประชาชน (Moderation Queue)</span>
          </h2>
          <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            {pendingReports.length} รายการรอดำเนินการ
          </span>
        </div>

        {pendingReports.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {pendingReports.map((r) => (
              <div key={r.id} className="py-4 first:pt-0 last:pb-0 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">{r.user_name}</span>
                    <span className="text-slate-400">• {formatDate(r.created_at)}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md font-mono text-[10px] uppercase bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {r.kind}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 break-words">
                  {r.text}
                </div>

                {r.detail && (
                  <p className="text-xs text-slate-500 italic">
                    บริบท: {r.detail}
                  </p>
                )}

                {/* Moderation Action Box */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    placeholder="ระบุเหตุผลการคัดกรอง (จำเป็น)..."
                    value={moderationReason}
                    onChange={(e) => setModerationReason(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-hidden"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleModerate(r.id, "confirmed")}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>ยืนยันเป็นภัย (Approve)</span>
                    </button>
                    <button
                      onClick={() => handleModerate(r.id, "rejected")}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>ปฏิเสธ (Reject)</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-400">
            ไม่มีเบาะแสคงค้างในคิว ระบบตรวจสอบครบถ้วนทุกรายการแล้ว
          </div>
        )}
      </div>

      {/* Dynamic Threshold Sliders */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-500" />
            <span>ปรับค่าเกณฑ์ตัดสินความเสี่ยงแบบเรียลไทม์ (Threshold Sliders)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ปรับเปลี่ยนเกณฑ์การตัดระดับ Medium Risk และ High Risk โดยไม่ต้องรีสตาร์ตเซิร์ฟเวอร์
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-amber-500">เกณฑ์ความเสี่ยงปานกลาง (Medium Cutoff)</span>
              <span className="font-mono text-slate-900 dark:text-white">{thresholds.medium} คะแนน</span>
            </div>
            <input
              type="range"
              min="20"
              max="60"
              value={thresholds.medium}
              onChange={(e) => setThresholds({ ...thresholds, medium: Number(e.target.value) })}
              className="w-full accent-amber-500"
            />
            <span className="text-[11px] text-slate-400 block">ค่ามาตรฐาน: 40.0</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-red-500">เกณฑ์ความเสี่ยงสูง (High Cutoff)</span>
              <span className="font-mono text-slate-900 dark:text-white">{thresholds.high} คะแนน</span>
            </div>
            <input
              type="range"
              min="55"
              max="90"
              value={thresholds.high}
              onChange={(e) => setThresholds({ ...thresholds, high: Number(e.target.value) })}
              className="w-full accent-red-500"
            />
            <span className="text-[11px] text-slate-400 block">ค่ามาตรฐาน: 70.0</span>
          </div>
        </div>

        <button
          onClick={handleSaveThresholds}
          className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
        >
          บันทึกการเปลี่ยนแปลงเกณฑ์
        </button>
      </div>

      {/* Model Retraining Simulation */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Cpu className="w-4 h-4 text-purple-500" />
          <span>การฝึกสอนโมเดล ML เพิ่มเติม (Continuous Training Pipeline)</span>
        </h2>
        <p className="text-xs text-slate-500">
          จำลองกระบวนการรวบรวมเบาะแสที่ผ่านการอนุมัติใหม่ และสั่ง Background Worker ฝึกสอนโมเดล TF-IDF และ XGBoost ใหม่
        </p>

        <button
          onClick={handleTriggerTraining}
          disabled={isRetraining}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-purple-500/20 hover:opacity-95 disabled:opacity-50 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRetraining ? "animate-spin" : ""}`} />
          <span>{isRetraining ? "กำลังคำนวณและประเมินผลโมเดล..." : "เริ่มกระบวนการเทรนโมเดลใหม่ (Trigger Retraining)"}</span>
        </button>
      </div>
    </div>
  );
}
