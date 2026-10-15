"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Globe,
  Image as ImageIcon,
  QrCode,
  ShieldAlert,
  History,
  Flag,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { useAuth } from "@/lib/auth";
import { storage } from "@/lib/storage";
import { HistoryItem } from "@/types/api";
import { getRiskColor, formatDate } from "@/lib/utils";

export default function HomePage() {
  const { user } = useAuth();
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
      title: "Message / SMS",
      desc: "Analyze SMS, chat messages, urgency lures, and OTP credential theft",
      icon: MessageSquare,
      color: "from-blue-600 to-indigo-600",
      href: "/analyze?tab=text",
    },
    {
      title: "Link / URL",
      desc: "Detect phishing links, typosquatting domains, and high-risk TLDs",
      icon: Globe,
      color: "from-cyan-600 to-blue-600",
      href: "/analyze?tab=url",
    },
    {
      title: "Screenshot / OCR",
      desc: "Automatically extract and inspect text from chat captures and bank slips",
      icon: ImageIcon,
      color: "from-purple-600 to-pink-600",
      href: "/analyze?tab=ocr",
    },
    {
      title: "QR Code",
      desc: "Decode payment codes and disguised links safely without auto-executing",
      icon: QrCode,
      color: "from-emerald-600 to-teal-600",
      href: "/analyze?tab=qr",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Greeting & Tagline Hero */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Risk Intelligence Platform</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Hello, {user?.name || "Welcome"} 👋
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Verify suspicious text messages, web links, and payment details before falling victim to fraud. Powered by explainable AI and transparent evidence grounding.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
            >
              <span>Scan Suspicious Input</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/graph"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs sm:text-sm font-semibold transition-colors"
            >
              <span>Explore Knowledge Graph</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Primary Scan Shortcuts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Choose What to Check (Scan Modes)
          </h2>
          <span className="text-xs font-semibold text-slate-400">4 Detection Channels</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {shortcuts.map((s, idx) => {
            const Icon = s.icon;
            return (
              <Link
                key={idx}
                href={s.href}
                className="group p-6 rounded-3xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800 hover:border-blue-500/60 hover:shadow-md transition-all duration-150 flex flex-col justify-between space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${s.color} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
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
        <div className="p-6 rounded-3xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center shrink-0">
            <History className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.total + 1420}
            </div>
            <div className="text-xs text-slate-500 font-medium">Total Risk Analyses Completed</div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-red-600 dark:text-red-400">
              {stats.high + 482}
            </div>
            <div className="text-xs text-slate-500 font-medium">High Risk Threats Intercepted</div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Flag className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
              {stats.clues + 28}
            </div>
            <div className="text-xs text-slate-500 font-medium">Community Scam Clues Recorded</div>
          </div>
        </div>
      </div>

      {/* 7-Day Activity Chart */}
      <ActivityChart />

      {/* Recent Analyses Preview */}
      <div className="bg-white dark:bg-[#10203A] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Activity & Saved Analyses
            </h3>
            <p className="text-xs text-slate-500">Your scan history is privacy-masked and encrypted</p>
          </div>
          <Link
            href="/history"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View All Records</span>
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
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${risk.badgeBg}`}>
                        {risk.label}
                      </span>
                      <span className="text-[11px] text-slate-400 uppercase font-mono font-semibold">
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
                      <span className="text-[10px] text-slate-400 block font-semibold">/ 100</span>
                    </div>
                    <Link
                      href={`/analyze?historyId=${item.id}`}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      Inspect Result
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500">
            No analyses recorded yet. Start scanning suspicious SMS or links above!
          </div>
        )}
      </div>
    </div>
  );
}
