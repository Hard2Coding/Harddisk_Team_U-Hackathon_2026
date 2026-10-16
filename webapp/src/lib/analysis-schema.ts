/**
 * Shared ScamLens analysis contract (see ScamLens_Implementation_Plan.md §7).
 * Both the screenshot flow and the text/link flow render this shape.
 */

export type RiskLevel = "low" | "medium" | "high" | "uncertain";
export type Severity = "low" | "medium" | "high";

export interface RiskIndicatorItem {
  type: string;
  label: string;
  /** Exact quote from the input when readable, otherwise empty. */
  evidence: string;
  explanation: string;
  severity: Severity;
}

export interface MatchedBankAccount {
  accountNumber: string;
  name: string;
  bankCompany: string;
  scamType: string;
  reportsCount: number;
  status: string;
  reportedDate?: string;
}

/** Where the assessment came from. */
export type AnalysisSource = "gemini" | "rules" | "demo";

export interface ScamAnalysis {
  riskLevel: RiskLevel;
  riskScore: number; // Estimated scam likelihood percentage (0-100)
  summary: string;
  indicators: RiskIndicatorItem[];
  recommendedActions: string[];
  uncertainties: string[];
  source: AnalysisSource;
  matchedBankAccounts?: MatchedBankAccount[];
}

export const MAX_INDICATORS = 5;
export const MAX_ACTIONS = 5;

export const RISK_COPY: Record<RiskLevel, { label: string; hint: string }> = {
  high: {
    label: "High risk",
    hint: "Strong warning signs. Do not act on this message.",
  },
  medium: {
    label: "Caution",
    hint: "Some warning signs. Verify before you do anything.",
  },
  low: {
    label: "Low risk",
    hint: "Few warning signs found. This does not mean it is safe.",
  },
  uncertain: {
    label: "Not sure",
    hint: "There was not enough readable information to assess.",
  },
};

/** Plain-text report for the "Copy report" action. */
export function formatReport(a: ScamAnalysis): string {
  const lines = [
    `ScamLens report — ${RISK_COPY[a.riskLevel].label} (${a.riskScore}% risk score)`,
    "",
    a.summary,
  ];
  if (a.indicators.length) {
    lines.push("", "Warning signs:");
    a.indicators.forEach((i) => {
      lines.push(`- ${i.label}${i.evidence ? ` ("${i.evidence}")` : ""}: ${i.explanation}`);
    });
  }
  if (a.recommendedActions.length) {
    lines.push("", "What to do:");
    a.recommendedActions.forEach((r) => lines.push(`- ${r}`));
  }
  if (a.uncertainties.length) {
    lines.push("", "Limitations:");
    a.uncertainties.forEach((u) => lines.push(`- ${u}`));
  }
  lines.push("", "AI can make mistakes. Always verify through official channels.");
  return lines.join("\n");
}
