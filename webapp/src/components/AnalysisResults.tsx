"use client";

import { useState } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  ShieldCheck,
  HelpCircle,
  Quote,
  CheckCircle2,
  Circle,
  Info,
  Copy,
  Check,
  RotateCcw,
  FlaskConical,
  Sparkles,
  Landmark,
  Cpu,
} from "lucide-react";
import { RISK_COPY, formatReport, type RiskLevel, type ScamAnalysis, type Severity } from "@/lib/analysis-schema";
import { cn } from "@/lib/utils";

const RISK_STYLE: Record<RiskLevel, { icon: typeof ShieldAlert; badge: string; iconWrap: string; bar: string; text: string }> = {
  high: { icon: ShieldAlert, badge: "bg-red-50 text-red-700 ring-red-200", iconWrap: "bg-red-50 text-red-600", bar: "bg-red-600", text: "text-red-700" },
  medium: { icon: AlertTriangle, badge: "bg-amber-50 text-amber-800 ring-amber-200", iconWrap: "bg-amber-50 text-amber-600", bar: "bg-amber-500", text: "text-amber-800" },
  low: { icon: ShieldCheck, badge: "bg-stone-100 text-stone-700 ring-stone-200", iconWrap: "bg-stone-100 text-stone-600", bar: "bg-emerald-600", text: "text-stone-700" },
  uncertain: { icon: HelpCircle, badge: "bg-stone-100 text-stone-700 ring-stone-200", iconWrap: "bg-stone-100 text-stone-500", bar: "bg-stone-400", text: "text-stone-700" },
};

const SEVERITY_STYLE: Record<Severity, { dot: string; label: string }> = {
  high: { dot: "bg-red-500", label: "High" },
  medium: { dot: "bg-amber-500", label: "Medium" },
  low: { dot: "bg-stone-400", label: "Low" },
};

export function RiskBadge({
  level,
  score,
  size = "md",
}: {
  level: RiskLevel;
  score?: number;
  size?: "sm" | "md";
}) {
  const s = RISK_STYLE[level];
  const Icon = s.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full ring-1 ring-inset font-medium",
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
        s.badge,
      )}
    >
      <Icon className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
      {typeof score === "number" && `${score}% `}
      {RISK_COPY[level].label}
    </span>
  );
}

interface Props {
  analysis: ScamAnalysis;
  onReset: () => void;
  resetLabel: string;
}

export function AnalysisResults({ analysis, onReset, resetLabel }: Props) {
  const [done, setDone] = useState<Set<number>>(() => new Set());
  const [copied, setCopied] = useState(false);
  const style = RISK_STYLE[analysis.riskLevel];
  const Icon = style.icon;

  const toggle = (i: number) =>
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(formatReport(analysis));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  const percentage = Math.min(100, Math.max(0, analysis.riskScore ?? 50));

  return (
    <section aria-labelledby="result-heading" className="animate-rise space-y-5">
      {analysis.source === "demo" && (
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-sm text-amber-900">
          <FlaskConical className="w-4 h-4 mt-0.5 shrink-0 text-amber-700" />
          <p>
            <span className="font-semibold text-amber-950">Demo Preview Mode.</span> You haven&apos;t added your Gemini API key yet, so this sample is returned for testing. Add your key in{" "}
            <code className="px-1.5 py-0.5 rounded bg-amber-100 text-xs font-mono font-bold">.env.local</code> as{" "}
            <code className="px-1.5 py-0.5 rounded bg-amber-100 text-xs font-mono font-bold">GEMINI_API_KEY</code> to enable live Gemini predictions!
          </p>
        </div>
      )}

      {analysis.source === "gemini" && (
        <div className="flex items-center justify-between gap-2 px-1">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Powered by Gemini Vision AI
          </span>
          <span className="text-xs text-muted">Confidence evaluated</span>
        </div>
      )}

      {/* Summary card with Risk Percentage Meter */}
      <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={cn("grid place-items-center w-12 h-12 rounded-xl shrink-0", style.iconWrap)}>
              <Icon className="w-6 h-6" strokeWidth={1.9} />
            </div>
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 id="result-heading" className="text-xl font-semibold tracking-tight">
                  {RISK_COPY[analysis.riskLevel].label}
                </h2>
                <span className="text-sm text-muted">· {RISK_COPY[analysis.riskLevel].hint}</span>
              </div>
              <p className="text-[15px] leading-relaxed text-ink/85">{analysis.summary}</p>
            </div>
          </div>

          {/* Prominent Percentage Badge */}
          <div className="sm:self-center shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-3 sm:p-0 rounded-xl bg-soft sm:bg-transparent">
            <div className="flex items-baseline gap-1">
              <span className={cn("text-3xl sm:text-4xl font-bold tracking-tight font-mono", style.text)}>
                {percentage}%
              </span>
            </div>
            <span className="text-xs font-medium text-muted tracking-tight">Scam Risk Chance</span>
          </div>
        </div>

        {/* Minimal Score Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="w-full h-2.5 rounded-full bg-soft border border-line/60 overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-700", style.bar)}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-subtle font-mono">
            <span>0% (Safe)</span>
            <span>50%</span>
            <span>100% (High Danger)</span>
          </div>
        </div>
      </div>

      {/* Matched Fraudulent / Mule Bank Account Alert Card */}
      {analysis.matchedBankAccounts && analysis.matchedBankAccounts.length > 0 && (
        <div className="rounded-2xl border border-red-200 bg-red-50/40 p-5 sm:p-6 space-y-4 animate-rise">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid place-items-center w-10 h-10 rounded-xl bg-red-100 text-red-700 shrink-0">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base text-red-950">
                  🚨 Flagged Bank Account Found in Scam Database
                </h3>
                <p className="text-xs sm:text-sm text-red-900/80">
                  Cross-referenced with police and community threat records. Do not transfer money!
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 ring-1 ring-inset ring-red-200 shrink-0">
              Database Match
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 pt-1">
            {analysis.matchedBankAccounts.map((acc, i) => (
              <div
                key={i}
                className="rounded-xl border border-line bg-surface p-4 space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-bold text-base text-ink tracking-tight">
                    {acc.accountNumber}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-red-50 text-red-700 ring-1 ring-inset ring-red-200">
                    {acc.status}
                  </span>
                </div>
                <div className="text-xs text-muted flex items-center justify-between">
                  <span>Name: <strong className="text-ink font-medium">{acc.name}</strong></span>
                  <span className="font-medium text-ink bg-soft px-2 py-0.5 rounded">{acc.bankCompany}</span>
                </div>
                <div className="text-xs text-ink/80 font-medium flex items-center justify-between pt-2 border-t border-line">
                  <span className="truncate max-w-44 text-muted">{acc.scamType}</span>
                  <span className="font-semibold text-red-700 shrink-0">
                    {acc.reportsCount} victim reports
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Machine Learning Model Prediction Card */}
      {analysis.mlPrediction && (
        <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6 space-y-3.5 shadow-xs animate-rise">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="grid place-items-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700">
                <Cpu className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-ink">
                  In-App ML Model Prediction
                </h3>
                <p className="text-xs text-muted">
                  Model: <span className="font-medium text-ink">{analysis.mlPrediction.algorithm}</span>
                </p>
              </div>
            </div>
            <span
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset",
                analysis.mlPrediction.isScam
                  ? "bg-red-50 text-red-700 ring-red-200"
                  : "bg-emerald-50 text-emerald-800 ring-emerald-200"
              )}
            >
              {analysis.mlPrediction.isScam ? "Flagged by ML" : "Clean Text"} · {(analysis.mlPrediction.confidence * 100).toFixed(0)}% confidence
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 pt-1 text-xs">
            <div className="p-3 rounded-xl bg-soft border border-line/60 space-y-1">
              <span className="text-muted block text-[11px] font-medium uppercase tracking-wider">
                Predicted Scam Category
              </span>
              <span className="font-semibold text-ink text-sm block">
                {analysis.mlPrediction.categoryLabel}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-soft border border-line/60 space-y-1">
              <span className="text-muted block text-[11px] font-medium uppercase tracking-wider">
                Top Indicative Feature Tokens
              </span>
              <div className="flex flex-wrap gap-1 pt-0.5">
                {analysis.mlPrediction.matchedKeywords.length > 0 ? (
                  analysis.mlPrediction.matchedKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded bg-surface border border-line text-[11px] font-mono text-ink"
                    >
                      {kw}
                    </span>
                  ))
                ) : (
                  <span className="text-muted italic">No high-risk keywords detected</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-5">
        {/* Indicators */}
        <div className="lg:col-span-3 rounded-2xl border border-line bg-surface">
          <div className="px-5 sm:px-6 pt-5 pb-3 flex items-center justify-between">
            <h3 className="font-semibold">Warning signs</h3>
            <span className="text-xs text-muted">{analysis.indicators.length} found</span>
          </div>
          {analysis.indicators.length === 0 ? (
            <p className="px-5 sm:px-6 pb-6 text-sm text-muted">
              No specific warning signs were found. Stay careful with unexpected messages.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {analysis.indicators.map((ind, i) => {
                const sev = SEVERITY_STYLE[ind.severity];
                return (
                  <li key={i} className="px-5 sm:px-6 py-4 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-[15px]">{ind.label}</p>
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted shrink-0">
                        <span className={cn("w-1.5 h-1.5 rounded-full", sev.dot)} />
                        {sev.label}
                      </span>
                    </div>
                    {ind.evidence && (
                      <blockquote className="flex gap-2 rounded-lg bg-soft px-3 py-2 text-sm text-ink/80">
                        <Quote className="w-3.5 h-3.5 mt-0.5 shrink-0 text-subtle" />
                        <span className="wrap-break-word">{ind.evidence}</span>
                      </blockquote>
                    )}
                    <p className="text-sm leading-relaxed text-muted">{ind.explanation}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Actions */}
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
            <h3 className="font-semibold">What you should do</h3>
            <ul className="mt-3 space-y-1">
              {analysis.recommendedActions.map((a, i) => {
                const checked = done.has(i);
                return (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => toggle(i)}
                      aria-pressed={checked}
                      className="w-full flex items-start gap-3 rounded-lg px-2 py-2 -mx-2 text-left text-sm hover:bg-soft transition-colors"
                    >
                      {checked ? (
                        <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5 shrink-0 text-subtle" />
                      )}
                      <span className={cn("leading-relaxed", checked && "text-muted line-through")}>{a}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {analysis.uncertainties.length > 0 && (
            <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
              <h3 className="font-semibold flex items-center gap-2">
                <Info className="w-4 h-4 text-muted" /> Limitations
              </h3>
              <ul className="mt-2 space-y-1.5 text-sm text-muted leading-relaxed list-disc pl-5">
                {analysis.uncertainties.map((u, i) => (
                  <li key={i}>{u}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
        <p className="text-xs text-subtle">AI can make mistakes. A low result does not mean a message is safe.</p>
        <div className="flex gap-2">
          <button
            type="button"
            id="copy-report"
            onClick={copy}
            className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 h-11 px-4 rounded-xl border border-line bg-surface text-sm font-medium hover:bg-soft transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied" : "Copy report"}
          </button>
          <button
            type="button"
            id="analyze-another"
            onClick={onReset}
            className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 h-11 px-4 rounded-xl bg-ink text-white text-sm font-medium hover:bg-ink/90 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            {resetLabel}
          </button>
        </div>
      </div>
    </section>
  );
}
