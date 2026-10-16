"use client";

import { useState } from "react";
import {
  Upload,
  Cpu,
  Database,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  ArrowDown,
  GitBranch,
  Layers,
  Search,
  CheckCircle2,
  FileCheck2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StepNode {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  icon: typeof Upload;
  color: string;
  details: string[];
}

const FLOW_STEPS: StepNode[] = [
  {
    id: "step-1",
    badge: "Stage 01",
    title: "Multimodal Ingestion",
    subtitle: "Sanitizes and prepares evidence",
    icon: Upload,
    color: "bg-blue-50 text-blue-700 border-blue-200",
    details: [
      "Image format & EXIF stripping",
      "Text length normalization (<5,000 chars)",
      "Zero server-side image retention",
    ],
  },
  {
    id: "step-2",
    badge: "Stage 02",
    title: "Ultra-Fast Entity Scan",
    subtitle: "Low-token lightweight inspection",
    icon: Search,
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    details: [
      "Extracts bank accounts & PromptPay IDs",
      "Isolates suspicious URLs & TLD patterns",
      "Saves API tokens by pre-filtering",
    ],
  },
  {
    id: "step-3",
    badge: "Stage 03",
    title: "Database Threat Lookup",
    subtitle: "Cross-checks known scam registries",
    icon: Database,
    color: "bg-amber-50 text-amber-800 border-amber-200",
    details: [
      "Mule account blacklist & AOC 1441 data",
      "Aggregated victim report counters",
      "Instant ground-truth classification",
    ],
  },
  {
    id: "step-4",
    badge: "Stage 04",
    title: "Gemini Vision & Reasoning",
    subtitle: "Contextual AI evidence grounding",
    icon: Sparkles,
    color: "bg-purple-50 text-purple-700 border-purple-200",
    details: [
      "System prompt with anti-jailbreak sandbox",
      "Grounds evaluation with database intel",
      "Extracts exact visible evidence quotes",
    ],
  },
  {
    id: "step-5",
    badge: "Stage 05",
    title: "Risk Synthesis & Next Steps",
    subtitle: "Explainable 0–100% risk report",
    icon: ShieldCheck,
    color: "bg-emerald-50 text-emerald-800 border-emerald-200",
    details: [
      "Deterministic score floors for threats",
      "Action checklist & emergency hotlines",
      "Encrypted local client-side audit history",
    ],
  },
];

export function AlgorithmFlowchart() {
  const [activeStep, setActiveStep] = useState<string>("step-3");

  return (
    <section aria-labelledby="algorithm-heading" className="mt-20 scroll-mt-24">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-soft text-ink border border-line">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>System Pipeline</span>
        </div>
        <h2 id="algorithm-heading" className="text-2xl sm:text-3xl font-semibold tracking-tight">
          How the Detection Algorithm Works
        </h2>
        <p className="text-sm text-muted leading-relaxed">
          A hybrid intelligence engine that pairs lightweight pre-screening with verified scam registries and Gemini Vision AI for zero-hallucination analysis.
        </p>
      </div>

      {/* Main Flowchart Canvas */}
      <div className="mt-10 rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-xs">
        {/* Step Indicator Header (Desktop) */}
        <div className="hidden lg:grid grid-cols-5 gap-3 relative pb-6 border-b border-line">
          {FLOW_STEPS.map((s, idx) => {
            const isSelected = activeStep === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveStep(s.id)}
                className={cn(
                  "p-3.5 rounded-2xl text-left border transition-all relative flex flex-col justify-between gap-3",
                  isSelected
                    ? "border-ink bg-soft/70 shadow-xs"
                    : "border-line/70 hover:border-line hover:bg-soft/30"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted">
                    {s.badge}
                  </span>
                  <s.icon className={cn("w-4 h-4", isSelected ? "text-ink" : "text-subtle")} />
                </div>
                <div>
                  <h4 className="font-semibold text-xs leading-snug">{s.title}</h4>
                  <p className="text-[11px] text-muted truncate mt-0.5">{s.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Visual Pipeline Diagram */}
        <div className="mt-8 space-y-8">
          {/* Top Ingestion & Decision Flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Box 1: Input */}
            <div className="rounded-2xl border border-line bg-canvas p-5 space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800">
                  Input Stream
                </span>
                <Upload className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="font-semibold text-sm">User Submissions</h3>
              <ul className="text-xs text-muted space-y-1.5 leading-relaxed">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Screenshot (SMS, LINE, Banking)
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Raw text & URL links
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> PromptPay & Bank IDs
                </li>
              </ul>
            </div>

            {/* Box 2: Pre-Check & Database Loop (The Token-Saving Core!) */}
            <div className="rounded-2xl border-2 border-amber-300/80 bg-amber-50/30 p-5 space-y-3 relative shadow-xs">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 flex items-center gap-1">
                  <GitBranch className="w-3 h-3 text-amber-700" /> Grounding Branch
                </span>
                <Database className="w-4 h-4 text-amber-700" />
              </div>
              <h3 className="font-semibold text-sm text-amber-950">Scam Registry Lookup</h3>
              <p className="text-xs text-amber-900/80 leading-relaxed">
                Extracted payment accounts & URLs are queried against the local threat database with <strong>0 token cost</strong> before deep LLM deliberation.
              </p>
              <div className="pt-1 flex flex-col gap-1.5 text-[11px]">
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-surface border border-amber-200">
                  <span className="font-medium text-red-700 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" /> Confirmed Mule
                  </span>
                  <span className="font-mono text-ink">Score Floor &ge; 95%</span>
                </div>
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-surface border border-line">
                  <span className="font-medium text-muted flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> No Record
                  </span>
                  <span className="text-muted">Uncertainty Flag</span>
                </div>
              </div>
            </div>

            {/* Box 3: LLM Multimodal Synthesis */}
            <div className="rounded-2xl border border-line bg-canvas p-5 space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-100 text-purple-800">
                  Multimodal AI
                </span>
                <Sparkles className="w-4 h-4 text-purple-600" />
              </div>
              <h3 className="font-semibold text-sm">Gemini Vision Reasoning</h3>
              <p className="text-xs text-muted leading-relaxed">
                Evaluates social engineering, urgency manipulation, and credential theft while injected with verified database facts.
              </p>
              <ul className="text-xs text-muted space-y-1.5 leading-relaxed pt-1">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Exact quote extraction
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Strict structured JSON
                </li>
              </ul>
            </div>
          </div>

          {/* Interactive Step Details Card */}
          <div className="rounded-2xl border border-line bg-soft/50 p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-muted uppercase">
                  {FLOW_STEPS.find((s) => s.id === activeStep)?.badge}
                </span>
                <span className="text-xs text-subtle">·</span>
                <h4 className="font-semibold text-sm">
                  {FLOW_STEPS.find((s) => s.id === activeStep)?.title}
                </h4>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                {FLOW_STEPS.find((s) => s.id === activeStep)?.subtitle}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {FLOW_STEPS.find((s) => s.id === activeStep)?.details.map((d, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-surface border border-line text-ink"
                  >
                    <FileCheck2 className="w-3 h-3 text-blue-600" />
                    {d}
                  </span>
                ))}
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2 self-end md:self-center">
              <span className="text-xs text-muted font-medium">Explore steps:</span>
              <div className="flex items-center gap-1">
                {FLOW_STEPS.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActiveStep(s.id)}
                    className={cn(
                      "w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all",
                      activeStep === s.id
                        ? "bg-ink text-white"
                        : "bg-surface border border-line text-muted hover:text-ink"
                    )}
                  >
                    0{i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
