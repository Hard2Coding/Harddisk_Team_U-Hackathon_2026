import type { ScamAnalysis } from "./analysis-schema";

/**
 * Returned by /api/analyze while GEMINI_API_KEY is not configured,
 * so the full frontend flow can be designed and demoed.
 * Matches the bundled fictional example screenshot.
 */
export const DEMO_ANALYSIS: ScamAnalysis = {
  riskLevel: "high",
  riskScore: 92,
  summary:
    "The message pressures you to act today and asks for a one-time password through an unfamiliar link.",
  indicators: [
    {
      type: "credential_request",
      label: "Asks for a one-time password",
      evidence: "reply with the 6-digit OTP we sent you",
      explanation: "Real banks never ask you to share an OTP. Anyone with this code can access your account.",
      severity: "high",
    },
    {
      type: "urgency",
      label: "Urgency and pressure",
      evidence: "Your account will be suspended today",
      explanation: "Scammers create a deadline so you act before thinking it through.",
      severity: "medium",
    },
    {
      type: "suspicious_link",
      label: "Unfamiliar link",
      evidence: "http://secure-bank-verify.xyz",
      explanation: "The address is not an official bank domain and uses an unusual “.xyz” ending.",
      severity: "high",
    },
  ],
  recommendedActions: [
    "Do not share an OTP, PIN, or password.",
    "Do not open the link in this message.",
    "Check your account using the bank's official app or phone number.",
    "Block the sender and report the message.",
  ],
  uncertainties: ["The screenshot alone cannot verify who sent the message."],
  source: "demo",
  matchedBankAccounts: [
    {
      accountNumber: "140-2-99881-0",
      name: "Somchai Rattanakorn",
      bankCompany: "Bank A",
      scamType: "Fake Investment / Crypto",
      reportsCount: 24,
      status: "Blacklisted",
      reportedDate: "2026-03-14",
    },
  ],
  mlPrediction: {
    isScam: true,
    mlRiskScore: 92,
    predictedCategory: "otp_theft",
    categoryLabel: "Banking OTP & Credential Harvesting",
    confidence: 0.965,
    matchedKeywords: ["otp", "suspended", "verify", "unfamiliar link"],
    algorithm: "TF-IDF + Multinomial Naive Bayes (MNB)",
  },
};
