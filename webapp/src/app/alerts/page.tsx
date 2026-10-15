"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HistoryItem } from "@/types/api";
import { storage } from "@/lib/storage";
import { getRiskColor, formatDate } from "@/lib/utils";
import { BellRing, ShieldAlert, ArrowRight, CheckCircle2, PhoneCall } from "lucide-react";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const history = storage.getHistory();
    const danger = history.filter((h) => h.level === "HIGH" || h.level === "MEDIUM");
    setAlerts(danger);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200/80 dark:border-red-800 text-xs font-bold mb-2">
          <BellRing className="w-3.5 h-3.5 text-red-600" />
          <span>Priority Threat Feed</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Priority Threat Alerts
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Real-time feed of HIGH and MEDIUM risk threats detected in your network, along with immediate countermeasures
        </p>
      </div>

      {/* Emergency Alert Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-red-600 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-base flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-yellow-300" />
            <span>If you accidentally transferred money or entered an OTP code:</span>
          </h3>
          <p className="text-xs text-red-100 max-w-xl leading-relaxed">
            Immediately call the 24/7 Anti-Online Scam Center (AOC 1441) to initiate an emergency freeze on destination mule accounts and protect your banking session.
          </p>
        </div>
        <a
          href="tel:1441"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-red-700 font-bold text-xs hover:bg-red-50 transition-colors shrink-0 shadow-sm"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Call Hotline 1441</span>
        </a>
      </div>

      {/* Threat Feed List */}
      <div className="space-y-4">
        {alerts.length > 0 ? (
          alerts.map((item) => {
            const risk = getRiskColor(item.level);
            return (
              <div
                key={item.id}
                className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${risk.badgeBg}`}>
                      {risk.label} ({item.score !== null ? Math.round(item.score) : "—"}/100)
                    </span>
                    <span className="text-xs text-slate-400">
                      Logged on: {formatDate(item.created_at)}
                    </span>
                  </div>

                  <Link
                    href={`/analyze?historyId=${item.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <span>View Grounded Evidence</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 break-words">
                  {item.masked_text}
                </div>

                {item.result.advice && item.result.advice.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Immediate Protective Steps:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                      {item.result.advice.map((adv, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>{adv}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center text-xs text-slate-500 bg-white dark:bg-[#10203A] rounded-3xl border border-slate-200 dark:border-slate-800">
            No active high-risk alerts logged. Your monitored channels are currently clean.
          </div>
        )}
      </div>
    </div>
  );
}
