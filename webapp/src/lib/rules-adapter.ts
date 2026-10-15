import type { Analysis, Reason } from "@/types/api";
import { analyzeInput } from "./scamEngine";
import {
  MAX_ACTIONS,
  MAX_INDICATORS,
  type RiskLevel,
  type ScamAnalysis,
  type Severity,
} from "./analysis-schema";

const LEVEL_MAP: Record<Analysis["level"], RiskLevel> = {
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
  "INSUFFICIENT DATA": "uncertain",
};

const SEVERITY_MAP: Record<NonNullable<Reason["severity"]>, Severity> = {
  danger: "high",
  warning: "medium",
  info: "low",
};

/** Find a short exact quote in the input that supports the reason, if any. */
function findEvidence(text: string, reason: Reason): { evidence: string; explanation: string } {
  const group = reason.detail.match(/\(([^)]+)\)/)?.[1];
  const candidates = (group ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const lower = text.toLowerCase();
  for (const c of candidates) {
    const idx = lower.indexOf(c.toLowerCase());
    if (idx >= 0) {
      return {
        evidence: text.slice(idx, idx + c.length),
        explanation: reason.detail.replace(` (${group})`, "").replace(`(${group})`, ""),
      };
    }
  }
  return { evidence: "", explanation: reason.detail };
}

/** Runs the built-in rules engine and maps it to the ScamLens result shape. */
export function analyzeTextWithRules(input: string, kind: "text" | "url"): ScamAnalysis {
  const text = input.trim();
  if (text.length < 6) {
    return {
      riskLevel: "uncertain",
      summary: "There is not enough text to assess. Paste the full message or link.",
      indicators: [],
      recommendedActions: ["Paste the complete message, including any links or phone numbers."],
      uncertainties: ["Very short input cannot be assessed reliably."],
      source: "rules",
    };
  }

  const a = analyzeInput(text, kind);
  const riskLevel = LEVEL_MAP[a.level];

  const summary =
    riskLevel === "high"
      ? "This message shows strong warning signs commonly used in scams."
      : riskLevel === "medium"
        ? "This message shows some warning signs. Verify before acting."
        : "We found few warning signs, but that does not prove it is safe.";

  return {
    riskLevel,
    summary,
    indicators: a.reasons.slice(0, MAX_INDICATORS).map((r) => ({
      type: r.code.toLowerCase(),
      label: r.title,
      ...findEvidence(text, r),
      severity: SEVERITY_MAP[r.severity ?? "info"],
    })),
    recommendedActions: [
      ...a.advice.filter((x) => !x.toLowerCase().startsWith("low risk")),
      "Contact the organization using its official app, website, or the number on your card.",
    ].slice(0, MAX_ACTIONS),
    uncertainties: [
      "This check uses pattern rules, not a full AI review.",
      "The sender's identity cannot be verified from text alone.",
    ],
    source: "rules",
  };
}
