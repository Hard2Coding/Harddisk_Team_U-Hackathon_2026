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
  Check,
  Shield,
  Clock,
} from "lucide-react";
import Link from "next/link";

function AnalyzeContent() {
  const searchParams = useSearchParams();
  const historyId = searchParams.get("historyId");

  const [currentAnalysis, setCurrentAnalysis] = useState<Analysis | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [copyNotice, setCopyNotice] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

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
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800 text-xs font-bold">
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          <span>Multi-Modal Scam Detection Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Scan & Verify Suspicious Content (Risk Checker)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Analyze suspicious SMS messages, URLs, screenshot chat captures, or QR codes with Zero-Fetch protection and explainable AI models.
        </p>
      </div>

      {/* Input Scanner Form */}
      <ScanForm onAnalysisComplete={handleAnalysisComplete} />

      {/* Analysis Result View */}
      {currentAnalysis && (
        <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Evaluation Results & Evidence Summary</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800">
                  ID: {currentAnalysis.id.slice(0, 14)}
                </span>
              </h2>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Checked at: {new Date(currentAnalysis.checked_at).toLocaleTimeString("en-US")}</span>
              </p>
            </div>

            {/* Action Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleSave}
                disabled={isSaved}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all ${
                  isSaved
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50"
                }`}
              >
                {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span>{isSaved ? "Saved to History" : "Save Record"}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
              >
                <Share2 className="w-3.5 h-3.5 text-blue-600" />
                <span>{copyNotice ? "Link Copied!" : "Share Masked Report"}</span>
              </button>

              <Link
                href={`/reports?prefill=${encodeURIComponent(currentAnalysis.raw_input || "")}`}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold border border-red-200 bg-red-50 text-red-700 dark:bg-red-950/40 dark:border-red-800 dark:text-red-400 hover:bg-red-100 transition-colors"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Submit as Community Clue</span>
              </Link>
            </div>
          </div>

          {/* 1. Score Radial Gauge */}
          <ScoreGauge score={currentAnalysis.score} level={currentAnalysis.level} />

          {/* 2. Evidence Grounding & Extracted Entities */}
          <EvidenceCard
            reasons={currentAnalysis.reasons}
            missingData={currentAnalysis.missing_data}
            advice={currentAnalysis.advice}
            entities={currentAnalysis.entities}
          />

          {/* 3. Interpretability & SHAP Meters */}
          <ShapMeters
            contributions={currentAnalysis.contributions}
            anomaly={currentAnalysis.anomaly}
            similarExamples={currentAnalysis.similar_examples}
            modelVersion={currentAnalysis.model.version}
          />

          {/* Feedback Bar */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs shadow-xs">
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              Was this risk assessment accurate and helpful to you?
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFeedback("up")}
                className={`p-2 rounded-xl border transition-colors ${
                  feedback === "up"
                    ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                    : "border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600"
                }`}
                title="Helpful and accurate"
              >
                <ThumbsUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => setFeedback("down")}
                className={`p-2 rounded-xl border transition-colors ${
                  feedback === "down"
                    ? "bg-red-50 border-red-300 text-red-700"
                    : "border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600"
                }`}
                title="Needs improvement"
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
