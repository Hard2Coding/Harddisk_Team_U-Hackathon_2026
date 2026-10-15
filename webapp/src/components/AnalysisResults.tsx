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
} from "lucide-react";
import { RISK_COPY, formatReport, type RiskLevel, type ScamAnalysis, type Severity } from "@/lib/analysis-schema";
import { cn } from "@/lib/utils";

const RISK_STYLE: Record<RiskLevel, { icon: typeof ShieldAlert; badge: string; iconWrap: string }> = {
  high: { icon: ShieldAlert, badge: "bg-red-50 text-red-700 ring-red-200", iconWrap: "bg-red-50 text-red-600" },
  medium: { icon: AlertTriangle, badge: "bg-amber-50 text-amber-800 ring-amber-200", iconWrap: "bg-amber-50 text-amber-600" },
  low: { icon: ShieldCheck, badge: "bg-stone-100 text-stone-700 ring-stone-200", iconWrap: "bg-stone-100 text-stone-600" },
  uncertain: { icon: HelpCircle, badge: "bg-stone-100 text-stone-700 ring-stone-200", iconWrap: "bg-stone-100 text-stone-500" },
};

const SEVERITY_STYLE: Record<Severity, { dot: string; label: string }> = {
  high: { dot: "bg-red-500", label: "High" },
  medium: { dot: "bg-amber-500", label: "Medium" },
  low: { dot: "bg-stone-400", label: "Low" },
};

export function RiskBadge({ level, size = "md" }: { level: RiskLevel; size?: "sm" | "md" }) {
  const s = RISK_STYLE[level];
  const Icon = s.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full ring-1 ring-inset font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        s.badge,
      )}
    >
      <Icon className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
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

  return (
    <section aria-labelledby="result-heading" className="animate-rise space-y-5">
      {analysis.source === "demo" && (
        <div className="flex items-start gap-2.5 rounded-xl border border-line bg-soft px-4 py-3 text-sm text-muted">
          <FlaskConical className="w-4 h-4 mt-0.5 shrink-0 text-ink" />
          <p>
            <span className="font-medium text-ink">Demo mode.</span> AI analysis isn&apos;t connected yet, so this is a
            sample result based on the example screenshot.
          </p>
        </div>
      )}

      {/* Summary */}
      <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className={cn("grid place-items-center w-12 h-12 rounded-xl shrink-0", style.iconWrap)}>
            <Icon className="w-6 h-6" strokeWidth={1.9} />
          </div>
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="result-heading" className="text-xl font-semibold tracking-tight">
                {RISK_COPY[analysis.riskLevel].label}
              </h2>
              <span className="text-sm text-muted">· {RISK_COPY[analysis.riskLevel].hint}</span>
            </div>
            <p className="text-[15px] leading-relaxed text-ink/85">{analysis.summary}</p>
          </div>
        </div>
      </div>

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
