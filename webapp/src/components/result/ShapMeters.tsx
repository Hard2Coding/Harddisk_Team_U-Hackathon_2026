"use client";
import React, { useState } from "react";
import { Contribution, SimilarExample } from "@/types/api";
import { ChevronDown, ChevronUp, Cpu, Activity, Sparkles } from "lucide-react";

interface ShapMetersProps {
  contributions: Contribution[];
  anomaly?: {
    score: number;
    is_anomaly: boolean;
    baseline: string;
  };
  similarExamples: SimilarExample[];
  modelVersion?: string;
}

export function ShapMeters({
  contributions,
  anomaly,
  similarExamples,
  modelVersion = "scamgraph-v2-production",
}: ShapMetersProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#10203A] overflow-hidden shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 sm:p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              ข้อมูลเทคนิค & ค่าคุณลักษณะ (Model Interpretability & SHAP)
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ค่า SHAP log-odds, Anomaly Isolation Forest และการเปรียบเทียบเชิงความหมาย
            </p>
          </div>
        </div>
        <div className="text-slate-400">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-6 pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-6">
          {/* Model info banner */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Model Artifact:</span>
              <span className="font-mono text-purple-600 dark:text-purple-400">{modelVersion}</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
              ZERO-FETCH COMPLIANT
            </span>
          </div>

          {/* Tree SHAP Contributions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-500" />
                <span>Tree SHAP Feature Contributions (Log-Odds Impact)</span>
              </span>
              <span className="text-[11px] text-slate-400">Higher = Greater Scam Contribution</span>
            </div>

            {contributions.length > 0 ? (
              <div className="space-y-2.5">
                {contributions.map((c, idx) => {
                  const widthPercent = Math.min(100, (c.value / 2.5) * 100);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {c.feature}
                        </span>
                        <span className="font-mono text-xs font-bold text-red-500">
                          +{c.value.toFixed(2)} {c.unit}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full transition-all duration-700"
                          style={{ width: `${widthPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                ไม่มีคุณลักษณะของ URL ที่ส่งผลต่อคะแนน (ตรวจเฉพาะโมเดลข้อความ)
              </p>
            )}
          </div>

          {/* Anomaly Detection Isolation Forest */}
          {anomaly && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  URL Anomaly Score (Isolation Forest)
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  ความผิดปกติทางโครงสร้างเทียบกับเว็บไซต์มาตรฐาน: {anomaly.baseline}
                </div>
              </div>
              <div className="text-right">
                <span className={`text-base font-black font-mono ${anomaly.is_anomaly ? "text-amber-500" : "text-emerald-500"}`}>
                  {anomaly.score.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 block">/ 1.00</span>
              </div>
            </div>
          )}

          {/* Semantic Similarity Template Matching */}
          {similarExamples.length > 0 && (
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>ตัวอย่างแคมเปญในอดีตที่มีความใกล้เคียง (Semantic Match)</span>
              </span>
              <div className="space-y-2">
                {similarExamples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1"
                  >
                    <div className="flex justify-between items-center text-slate-500 text-[11px]">
                      <span>แหล่งที่มา: {ex.source}</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">
                        {(ex.similarity * 100).toFixed(1)}% match
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 italic">
                      "{ex.text}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
