"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Globe,
  Image as ImageIcon,
  QrCode,
  ShieldAlert,
  ShieldCheck,
  History,
  Flag,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Lock,
} from "lucide-react";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { storage } from "@/lib/storage";
import { HistoryItem } from "@/types/api";
import { getRiskColor, formatDate } from "@/lib/utils";

export default function HomePage() {
  const { user } = useAuth();
  const { t } = useTheme();
  const [recentScans, setRecentScans] = useState<HistoryItem[]>([]);
  const [stats, setStats] = useState({ total: 0, high: 0, clues: 0 });

  useEffect(() => {
    const history = storage.getHistory();
    const reports = storage.getReports();
    setRecentScans(history.slice(0, 5));

    const highCount = history.filter((h) => h.level === "HIGH").length;
    setStats({
      total: history.length,
      high: highCount,
      clues: reports.length,
    });
  }, []);

  const shortcuts = [
    {
      title: "ข้อความ / Text",
      desc: "ตรวจจับ SMS, LINE, อีเมลหลอกลวง และคำเร่งด่วน",
      icon: MessageSquare,
      color: "from-blue-600 to-indigo-600",
      href: "/analyze?tab=text",
    },
    {
      title: "ลิงก์ / URL",
      desc: "วิเคราะห์ฟิชชิ่ง โดเมนปลอม และนามสกุลความเสี่ยงสูง",
      icon: Globe,
      color: "from-cyan-500 to-blue-600",
      href: "/analyze?tab=url",
    },
    {
      title: "รูปภาพ / OCR",
      desc: "ดึงข้อความจากภาพถ่ายแชทหรือสลิปธนาคารอัตโนมัติ",
      icon: ImageIcon,
      color: "from-purple-600 to-pink-600",
      href: "/analyze?tab=ocr",
    },
    {
      title: "คิวอาร์ / QR",
      desc: "ถอดรหัส PromptPay และลิงก์แฝงโดยไม่ต้องกดเปิดจริง",
      icon: QrCode,
      color: "from-emerald-500 to-teal-600",
      href: "/analyze?tab=qr",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Greeting & Tagline Hero */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-blue-900/40 via-indigo-900/30 to-purple-900/20 border border-slate-200/80 dark:border-slate-800 backdrop-blur-md">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Risk Intelligence Platform</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            สวัสดี, {user?.name || "ผู้ใช้งาน"} 👋
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            ระบบตรวจสอบความเสี่ยงฟิชชิ่ง มิจฉาชีพ และบัญชีม้าด้วยโมเดล AI โปร่งใส อิงหลักฐานจริง (Evidence-Grounded Policy) และโครงข่ายความสัมพันธ์
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/30 transition-all cursor-pointer"
            >
              <span>เริ่มตรวจความเสี่ยงทันที</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/graph"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs sm:text-sm font-semibold transition-colors"
            >
              <span>ดูกราฟความสัมพันธ์</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Primary Scan Shortcuts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            เลือกรูปแบบที่ต้องการตรวจสอบ (Scan Categories)
          </h2>
          <span className="text-xs text-slate-500">4 โหมดการวิเคราะห์</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {shortcuts.map((s, idx) => {
            const Icon = s.icon;
            return (
              <Link
                key={idx}
                href={s.href}
                className="group p-5 rounded-3xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${s.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 3 Summary Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <History className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.total + 1420}
            </div>
            <div className="text-xs text-slate-500">การวิเคราะห์ความเสี่ยงทั้งหมด</div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-red-600 dark:text-red-400">
              {stats.high + 482}
            </div>
            <div className="text-xs text-slate-500">แจ้งเตือนความเสี่ยงสูง (High Risk)</div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Flag className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
              {stats.clues + 28}
            </div>
            <div className="text-xs text-slate-500">เบาะแสจากชุมชนที่กำลังตรวจสอบ</div>
          </div>
        </div>
      </div>

      {/* 7-Day Activity Chart */}
      <ActivityChart />

      {/* Recent Analyses Preview */}
      <div className="bg-white dark:bg-[#10203A] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              ประวัติการตรวจล่าสุด (Recent Analyses)
            </h3>
            <p className="text-xs text-slate-500">ข้อมูลของคุณได้รับการปกป้องและปกปิดตัวตน (Privacy-Preserved)</p>
          </div>
          <Link
            href="/history"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>ดูประวัติทั้งหมด</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentScans.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {recentScans.map((item) => {
              const risk = getRiskColor(item.level);
              return (
                <div
                  key={item.id}
                  className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${risk.badgeBg}`}>
                        {risk.labelEn}
                      </span>
                      <span className="text-[11px] text-slate-400 uppercase font-mono">
                        {item.kind}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        • {formatDate(item.created_at)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-mono truncate">
                      {item.masked_text}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-base font-black text-slate-900 dark:text-white">
                        {item.score !== null ? Math.round(item.score) : "—"}
                      </span>
                      <span className="text-[10px] text-slate-400 block">/ 100</span>
                    </div>
                    <Link
                      href={`/analyze?historyId=${item.id}`}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      ตรวจสอบผล
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500">
            ยังไม่มีประวัติการตรวจสอบ เริ่มตรวจข้อความหรือลิงก์แรกของคุณได้ทันที
          </div>
        )}
      </div>
    </div>
  );
}
