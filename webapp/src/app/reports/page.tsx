"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CommunityReport, Entity } from "@/types/api";
import { api } from "@/lib/api";
import { extractEntities } from "@/lib/scamEngine";
import { formatDate } from "@/lib/utils";
import {
  Flag,
  Send,
  UploadCloud,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

function ReportsContent() {
  const searchParams = useSearchParams();
  const prefill = searchParams.get("prefill") || "";

  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [kind, setKind] = useState("text");
  const [suspectContent, setSuspectContent] = useState(prefill);
  const [detailContext, setDetailContext] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  // Live entity preview as user types
  const liveEntities: Entity[] = extractEntities(suspectContent);

  const loadReports = async () => {
    try {
      const data = await api.listReports();
      setReports(data);
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suspectContent.trim()) return;

    setIsSubmitting(true);
    try {
      await api.submitReport({
        kind,
        text: suspectContent,
        detail: detailContext,
        entities: liveEntities,
      });

      setSuccessNotice(true);
      setSuspectContent("");
      setDetailContext("");
      loadReports();
      setTimeout(() => setSuccessNotice(false), 4000);
    } catch {
      // Ignore
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold mb-2">
          <Flag className="w-3.5 h-3.5" />
          <span>Crowdsourced Cyber Threat Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          แจ้งเบาะแสสู่ชุมชน (Report a Scam Clue)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          ร่วมส่งเบาะแส SMS หลอกลวง ลิงก์ฟิชชิ่ง หรือบัญชีม้า เพื่อให้ทีมผู้ดูแลตรวจสอบและอัปเดตเป็นฐานข้อมูลเตือนภัย
        </p>
      </div>

      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>ส่งเบาะแสสำเร็จ! ข้อมูลของคุณถูกส่งต่อไปยังคิวตรวจสอบของผู้ดูแลระบบเรียบร้อยแล้ว</span>
        </div>
      )}

      {/* Submission Form */}
      <div className="bg-white dark:bg-[#10203A] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          แบบฟอร์มส่งเบาะแสมิจฉาชีพ
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              ประเภทเบาะแส (Identifier Kind)
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "text", label: "ข้อความ SMS / แชท" },
                { id: "url", label: "ลิงก์เว็บไซต์ปลอม" },
                { id: "phone", label: "เบอร์แก๊งคอลเซ็นเตอร์" },
                { id: "account", label: "เลขบัญชีธนาคาร (ม้า)" },
                { id: "wallet", label: "PromptPay / วอลเล็ต" },
                { id: "line", label: "LINE ID ปลอม" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setKind(t.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    kind === t.id
                      ? "bg-purple-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Suspect Content */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              ข้อมูลที่ต้องสงสัย (Suspect Content / Number / Link) *
            </label>
            <textarea
              rows={3}
              required
              value={suspectContent}
              onChange={(e) => setSuspectContent(e.target.value)}
              placeholder="ตัวอย่าง: ได้รับ SMS จากเบอร์ 0891234567 แนบลิงก์ http://kbank-verify-otp.xyz บอกว่าบัญชีถูกระงับ"
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
            />
          </div>

          {/* Live Entity Preview */}
          {liveEntities.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-purple-500/5 border border-purple-500/20 space-y-1.5">
              <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ตรวจพบเอนทิตีในเบาะแสอัตโนมัติ (Live Entities Preview):</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {liveEntities.map((e, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-[11px] font-mono border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  >
                    <strong className="text-purple-600 uppercase">{e.type}:</strong> {e.masked_value}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Context Details */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              รายละเอียดพฤติการณ์ (Incident Context / Where was it encountered?)
            </label>
            <textarea
              rows={2}
              value={detailContext}
              onChange={(e) => setDetailContext(e.target.value)}
              placeholder="พบจากกลุ่ม Facebook หลอกขายของ หรือโทรมาอ้างเป็นพนักงานไปรษณีย์..."
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
            />
          </div>

          {/* Image evidence upload preview note */}
          <div className="p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-500 bg-slate-50/50 dark:bg-slate-900/40">
            <UploadCloud className="w-6 h-6 mx-auto text-slate-400 mb-1" />
            <span>หลักฐานภาพถ่ายหน้าจอ (จำกัด 30 ไฟล์ต่อบัญชี • ลบข้อมูลพิกัด GPS อัตโนมัติ)</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !suspectContent.trim()}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? "กำลังส่งเบาะแส..." : "ส่งเบาะแสเข้าสู่ระบบ (Submit Clue)"}</span>
          </button>
        </form>
      </div>

      {/* User's Submitted Clues Tracking List */}
      <div className="bg-white dark:bg-[#10203A] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            สถานะเบาะแสที่เคยส่ง (My Clue Submissions)
          </h3>
          <span className="text-xs text-slate-400">{reports.length} รายการ</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {reports.map((r) => {
            return (
              <div key={r.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {r.status === "confirmed" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>ยืนยันเป็นภัยคุกคามแล้ว</span>
                      </span>
                    )}
                    {r.status === "pending" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/30">
                        <Clock className="w-3 h-3" />
                        <span>รอผู้ดูแลตรวจสอบ</span>
                      </span>
                    )}
                    {r.status === "rejected" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-600 border border-red-500/30">
                        <XCircle className="w-3 h-3" />
                        <span>ปฏิเสธ</span>
                      </span>
                    )}
                    <span className="text-xs text-slate-400">• {formatDate(r.created_at)}</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">
                    {r.kind}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-mono">
                  {r.text}
                </p>

                {r.detail && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                    รายละเอียด: {r.detail}
                  </p>
                )}

                {r.moderation_reason && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                    <strong className="text-blue-600 dark:text-blue-400">บันทึกจากผู้ดูแล:</strong>{" "}
                    {r.moderation_reason}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading reports...</div>}>
      <ReportsContent />
    </Suspense>
  );
}
