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
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#10203A] overflow-hidden shadow-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 sm:p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors text-left cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Model Interpretability & SHAP Feature Importance
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Inspect Tree SHAP log-odds contributions, URL structural anomaly score, and semantic template embeddings
            </p>
          </div>
        </div>
        <div className="text-slate-400">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-6 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-6">
          {/* Model Info Banner */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600 dark:text-slate-300">Model Artifact:</span>
              <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">{modelVersion}</span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-400 text-[10px] font-bold">
              ZERO-FETCH COMPLIANT
            </span>
          </div>

          {/* Tree SHAP Contributions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-600" />
                <span>Tree SHAP Feature Contributions (Log-Odds Impact)</span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Higher = Greater Risk Weight</span>
            </div>

            {contributions.length > 0 ? (
              <div className="space-y-3">
                {contributions.map((c, idx) => {
                  const widthPercent = Math.min(100, (c.value / 2.5) * 100);
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {c.feature}
                        </span>
                        <span className="font-mono text-xs font-bold text-red-600">
                          +{c.value.toFixed(2)} {c.unit}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-amber-500 to-red-500 rounded-full transition-all duration-700"
                          style={{ width: `${widthPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                No lexical URL features influenced this score (Text-only model evaluation).
              </p>
            )}
          </div>

          {/* Anomaly Detection Isolation Forest */}
          {anomaly && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  URL Anomaly Score (Isolation Forest)
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Structural deviation compared to standard legitimate web baselines: {anomaly.baseline}
                </div>
              </div>
              <div className="text-right">
                <span className={`text-base font-black font-mono ${anomaly.is_anomaly ? "text-amber-600" : "text-emerald-600"}`}>
                  {anomaly.score.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 block font-bold">/ 1.00</span>
              </div>
            </div>
          )}

          {/* Semantic Similarity Template Matching */}
          {similarExamples.length > 0 && (
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Historical Campaign Template Matches (Dense Vector Cosine Similarity)</span>
              </span>
              <div className="space-y-2">
                {similarExamples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1"
                  >
                    <div className="flex justify-between items-center text-slate-500 text-[11px]">
                      <span>Source: {ex.source}</span>
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
