"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ScanForm } from "@/components/scan/ScanForm";
import { ScoreGauge } from "@/components/result/ScoreGauge";
import { EvidenceCard } from "@/components/result/EvidenceCard";
import { ShapMeters } from "@/components/result/ShapMeters";
import { Analysis } from "@/types/api";
import { api } from "@/lib/api";
import { storage } from "@/lib/storage";
import confetti from "canvas-confetti";
import {
  Bookmark,
  Share2,
  Flag,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Check,
  Shield,
  Clock,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

function AnalyzeContent() {
  const searchParams = useSearchParams();
  const historyId = searchParams.get("historyId");

  const [currentAnalysis, setCurrentAnalysis] = useState<Analysis | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [copyNotice, setCopyNotice] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  // Check if viewing from history
  useEffect(() => {
    if (historyId) {
      const history = storage.getHistory();
      const match = history.find((h) => h.id === historyId);
      if (match) {
        setCurrentAnalysis(match.result);
        setIsSaved(true);
      }
    }
  }, [historyId]);

  const handleAnalysisComplete = (result: Analysis) => {
    setCurrentAnalysis(result);
    setIsSaved(false);
    setFeedback(null);

    // If safe low risk, shoot gentle celebratory confetti
    if (result.level === "LOW") {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // Ignore
      }
    }

    // Scroll to results
    window.scrollTo({ top: 320, behavior: "smooth" });
  };

  const handleSave = async () => {
    if (!currentAnalysis) return;
    await api.saveHistory(currentAnalysis);
    setIsSaved(true);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopyNotice(true);
      setTimeout(() => setCopyNotice(false), 2000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold">
          <Shield className="w-3.5 h-3.5" />
          <span>Multi-Modal Scam Detection Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          ตรวจสอบความเสี่ยงฟิชชิ่งและมิจฉาชีพ (Risk Scanner)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          วิเคราะห์ข้อความ, ลิงก์, สกรีนช็อตแชท หรือ QR Code ด้วยระบบ Zero-Fetch และการถ่วงน้ำหนักตามหลักฐานจริง
        </p>
      </div>

      {/* Unified Input Scanner Form */}
      <ScanForm onAnalysisComplete={handleAnalysisComplete} />

      {/* Analysis Result View */}
      {currentAnalysis && (
        <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom duration-300">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>ผลการตรวจวิเคราะห์ความเสี่ยง</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  ID: {currentAnalysis.id.slice(0, 14)}
                </span>
              </h2>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span>ตรวจสอบเมื่อ: {new Date(currentAnalysis.checked_at).toLocaleTimeString("th-TH")}</span>
              </p>
            </div>

            {/* Action Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleSave}
                disabled={isSaved}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                  isSaved
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                }`}
              >
                {isSaved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span>{isSaved ? "บันทึกในประวัติแล้ว" : "บันทึกในประวัติ"}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-blue-500" />
                <span>{copyNotice ? "คัดลอกลิงก์แล้ว!" : "แชร์รายงาน"}</span>
              </button>

              <Link
                href={`/reports?prefill=${encodeURIComponent(currentAnalysis.raw_input || "")}`}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>แจ้งเบาะแสสู่ชุมชน</span>
              </Link>
            </div>
          </div>

          {/* 1. Score Radial Gauge */}
          <ScoreGauge score={currentAnalysis.score} level={currentAnalysis.level} />

          {/* 2. Evidence Grounding & Entities */}
          <EvidenceCard
            reasons={currentAnalysis.reasons}
            missingData={currentAnalysis.missing_data}
            advice={currentAnalysis.advice}
            entities={currentAnalysis.entities}
          />

          {/* 3. Technical Interpretability & SHAP Meters */}
          <ShapMeters
            contributions={currentAnalysis.contributions}
            anomaly={currentAnalysis.anomaly}
            similarExamples={currentAnalysis.similar_examples}
            modelVersion={currentAnalysis.model.version}
          />

          {/* Feedback Section */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-300">
              ผลการประเมินนี้ถูกต้องและเป็นประโยชน์สำหรับคุณหรือไม่?
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFeedback("up")}
                className={`p-2 rounded-xl border transition-colors ${
                  feedback === "up"
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-600"
                    : "border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600"
                }`}
                title="เป็นประโยชน์"
              >
                <ThumbsUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => setFeedback("down")}
                className={`p-2 rounded-xl border transition-colors ${
                  feedback === "down"
                    ? "bg-red-500/20 border-red-500 text-red-600"
                    : "border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600"
                }`}
                title="ยังไม่ตรงกับความเป็นจริง"
              >
                <ThumbsDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading scanner...</div>}>
      <AnalyzeContent />
    </Suspense>
  );
}
