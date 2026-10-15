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
    // Filter HIGH and MEDIUM risk items
    const danger = history.filter((h) => h.level === "HIGH" || h.level === "MEDIUM");
    setAlerts(danger);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold mb-2">
          <BellRing className="w-3.5 h-3.5" />
          <span>Priority Threat Feed</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          การแจ้งเตือนภัยคุกคามเร่งด่วน (Risk Alerts)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          ฟีดรายการความเสี่ยงสูง (HIGH) และปานกลาง (MEDIUM) ที่ตรวจพบจากระบบของคุณ พร้อมแนวทางป้องกัน
        </p>
      </div>

      {/* Emergency Alert Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-base flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-yellow-300" />
            <span>หากคุณเผลอโอนเงินหรือให้รหัสผ่าน OTP ไปแล้ว:</span>
          </h3>
          <p className="text-xs text-red-100 max-w-xl">
            ติดต่อศูนย์ AOC 1441 ทันที เพื่อประสานระงับบัญชีม้าปลายทาง และแจ้งอายัดบัญชีธนาคารภายใน 72 ชั่วโมง
          </p>
        </div>
        <a
          href="tel:1441"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white text-red-600 font-bold text-xs hover:bg-red-50 transition-colors shrink-0 shadow-sm"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>โทร AOC 1441</span>
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
                className="p-6 rounded-3xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${risk.badgeBg}`}>
                      {risk.labelEn} ({item.score !== null ? Math.round(item.score) : "—"}/100)
                    </span>
                    <span className="text-xs text-slate-400">
                      ตรวจจับเมื่อ: {formatDate(item.created_at)}
                    </span>
                  </div>

                  <Link
                    href={`/analyze?historyId=${item.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <span>ดูรายละเอียดและเหตุผล</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 break-words">
                  {item.masked_text}
                </div>

                {item.result.advice && item.result.advice.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      สิ่งที่ควรปฏิบัติทันที:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                      {item.result.advice.map((adv, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
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
            ยังไม่มีการแจ้งเตือนความเสี่ยงสูง บัญชีของคุณอยู่ในสถานะปลอดภัย
          </div>
        )}
      </div>
    </div>
  );
}
