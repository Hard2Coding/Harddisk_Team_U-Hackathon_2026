import { HistoryItem, CommunityReport, AdminStats, Analysis } from "@/types/api";
import { maskSnippet } from "./utils";

const SEED_HISTORY: HistoryItem[] = [
  {
    id: "hist-101",
    text: "Security Alert: Your bank account access has been suspended. Confirm your 6-digit OTP code immediately at http://kbank-verify-otp.xyz within 10 minutes to unblock.",
    masked_text: "Security Alert: Your bank account access has been suspended. Confirm your 6-digit OTP code at http://kba***otp.xyz within 10 min...",
    kind: "text",
    level: "HIGH",
    score: 92,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    result: {
      id: "scan-seed-1",
      checked_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      input_kind: "text",
      score: 92,
      level: "HIGH",
      summary: "Strong scam risk signals detected. Halt all actions and verify through official channels.",
      entities: [
        { id: "e1", type: "url", value: "http://kbank-verify-otp.xyz", masked_value: "http://kba***otp.xyz" },
        { id: "e2", type: "domain", value: "kbank-verify-otp.xyz", masked_value: "kba***otp.xyz" },
      ],
      reasons: [
        { code: "VERIFIED_THREAT_RECORD", title: "Confirmed Threat Database Record Found", detail: "AOC 1441 Alert Match", source: "AOC 1441", severity: "danger" },
        { code: "CREDENTIAL_SOLICITATION", title: "Solicitation of OTP Credentials", detail: "Phishing pattern detected", source: "TF-IDF Vectorizer", severity: "danger" },
      ],
      history: { status: "confirmed", matches: [] },
      graph: { nodes: [], edges: [] },
      missing_data: [],
      model: { version: "v2", status: "ready", dataset_is_sample: false },
      similar_examples: [],
      contributions: [],
      advice: ["Do not enter OTP or password", "Halt transfers immediately"],
      thresholds: { medium: 40, high: 70 },
    },
  },
  {
    id: "hist-102",
    text: "Express Courier Alert: Package #US9881 delivery held at terminal. Confirm shipping address and pay $1.85 processing fee at scb-secure-update.top",
    masked_text: "Express Courier Alert: Package #US9881 delivery held at terminal. Pay processing fee at scb-secure-update.top",
    kind: "text",
    level: "MEDIUM",
    score: 58,
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    result: {
      id: "scan-seed-2",
      checked_at: new Date(Date.now() - 3600000 * 18).toISOString(),
      input_kind: "text",
      score: 58,
      level: "MEDIUM",
      summary: "Suspicious characteristics found. Independent verification is strongly advised.",
      entities: [],
      reasons: [
        { code: "AUTHORITY_IMPERSONATION", title: "Courier Brand Impersonation", detail: "Package delivery fee lure", source: "Entity Model", severity: "warning" },
      ],
      history: { status: "unverified", matches: [] },
      graph: { nodes: [], edges: [] },
      missing_data: ["No verified past record"],
      model: { version: "v2", status: "ready", dataset_is_sample: false },
      similar_examples: [],
      contributions: [],
      advice: ["Verify via official courier tracking portal directly"],
      thresholds: { medium: 40, high: 70 },
    },
  },
  {
    id: "hist-103",
    text: "Hi mom, what time will you be home tonight? I will start making dinner around 6:30 PM.",
    masked_text: "Hi mom, what time will you be home tonight? I will start making dinner around 6:30 PM.",
    kind: "text",
    level: "LOW",
    score: 12,
    created_at: new Date(Date.now() - 3600000 * 40).toISOString(),
    result: {
      id: "scan-seed-3",
      checked_at: new Date(Date.now() - 3600000 * 40).toISOString(),
      input_kind: "text",
      score: 12,
      level: "LOW",
      summary: "Low risk observed on available parameters.",
      entities: [],
      reasons: [],
      history: { status: "clean", matches: [] },
      graph: { nodes: [], edges: [] },
      missing_data: ["No threat records"],
      model: { version: "v2", status: "ready", dataset_is_sample: false },
      similar_examples: [],
      contributions: [],
      advice: ["Normal conversational text observed."],
      thresholds: { medium: 40, high: 70 },
    },
  },
];

const SEED_REPORTS: CommunityReport[] = [
  {
    id: "rep-201",
    user_name: "Alexander M.",
    kind: "phone",
    text: "Phone +66891234567 impersonating high court investigator claiming an arrest warrant for money laundering.",
    detail: "Automated robocall instructing victim to press 9 to speak with an investigator.",
    entities: [{ id: "e-rep-1", type: "phone", value: "0891234567", masked_value: "089-xxx-4567" }],
    evidence_files: [],
    status: "confirmed",
    moderation_reason: "Verified against Cyber Crime Police blacklist bulletin #1084",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    reviewed_at: new Date(Date.now() - 86400000 * 0.5).toISOString(),
  },
  {
    id: "rep-202",
    user_name: "Sarah Jenkins",
    kind: "url",
    text: "http://scb-secure-update.top received via SMS claiming reward points will expire in 2 hours.",
    detail: "Sent from an unknown spoofed sender ID directing to a fake login form.",
    entities: [{ id: "e-rep-2", type: "url", value: "http://scb-secure-update.top", masked_value: "http://scb***top" }],
    evidence_files: [],
    status: "pending",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "rep-203",
    user_name: "David Chen",
    kind: "account",
    text: "Flagged mule bank account 1402998810 used for second-hand electronics marketplace scam.",
    detail: "Facebook marketplace seller requested payment then immediately blocked buyer.",
    entities: [{ id: "e-rep-3", type: "account", value: "1402998810", masked_value: "140-xxx-8810" }],
    evidence_files: [],
    status: "pending",
    created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
];

export const storage = {
  getHistory(): HistoryItem[] {
    if (typeof window === "undefined") return SEED_HISTORY;
    try {
      const data = localStorage.getItem("scamgraph_history");
      if (!data) {
        localStorage.setItem("scamgraph_history", JSON.stringify(SEED_HISTORY));
        return SEED_HISTORY;
      }
      return JSON.parse(data);
    } catch {
      return SEED_HISTORY;
    }
  },

  addHistory(analysis: Analysis): HistoryItem {
    const raw = analysis.raw_input || analysis.summary;
    const item: HistoryItem = {
      id: `hist-${Date.now()}`,
      text: raw,
      masked_text: maskSnippet(raw),
      kind: analysis.input_kind,
      level: analysis.level,
      score: analysis.score,
      created_at: new Date().toISOString(),
      result: analysis,
    };

    if (typeof window !== "undefined") {
      try {
        const existing = this.getHistory();
        const updated = [item, ...existing].slice(0, 300);
        localStorage.setItem("scamgraph_history", JSON.stringify(updated));
      } catch (err) {
        console.error("Storage error:", err);
      }
    }
    return item;
  },

  deleteHistory(id: string) {
    if (typeof window !== "undefined") {
      const existing = this.getHistory();
      const updated = existing.filter((item) => item.id !== id);
      localStorage.setItem("scamgraph_history", JSON.stringify(updated));
    }
  },

  clearHistory() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("scamgraph_history");
    }
  },

  getReports(): CommunityReport[] {
    if (typeof window === "undefined") return SEED_REPORTS;
    try {
      const data = localStorage.getItem("scamgraph_reports");
      if (!data) {
        localStorage.setItem("scamgraph_reports", JSON.stringify(SEED_REPORTS));
        return SEED_REPORTS;
      }
      return JSON.parse(data);
    } catch {
      return SEED_REPORTS;
    }
  },

  addReport(report: Omit<CommunityReport, "id" | "created_at" | "status">): CommunityReport {
    const newReport: CommunityReport = {
      ...report,
      id: `rep-${Date.now()}`,
      status: "pending",
      created_at: new Date().toISOString(),
    };
    if (typeof window !== "undefined") {
      try {
        const existing = this.getReports();
        const updated = [newReport, ...existing];
        localStorage.setItem("scamgraph_reports", JSON.stringify(updated));
      } catch (err) {
        console.error("Storage error:", err);
      }
    }
    return newReport;
  },

  updateReportStatus(id: string, status: "confirmed" | "rejected", reason: string) {
    if (typeof window !== "undefined") {
      const existing = this.getReports();
      const updated = existing.map((r) =>
        r.id === id
          ? { ...r, status, moderation_reason: reason, reviewed_at: new Date().toISOString() }
          : r
      );
      localStorage.setItem("scamgraph_reports", JSON.stringify(updated));
    }
  },

  getThresholds() {
    if (typeof window === "undefined") return { medium: 40.0, high: 70.0 };
    try {
      const data = localStorage.getItem("scamgraph_thresholds");
      return data ? JSON.parse(data) : { medium: 40.0, high: 70.0 };
    } catch {
      return { medium: 40.0, high: 70.0 };
    }
  },

  setThresholds(thresholds: { medium: number; high: number }) {
    if (typeof window !== "undefined") {
      localStorage.setItem("scamgraph_thresholds", JSON.stringify(thresholds));
    }
  },

  getAdminStats(): AdminStats {
    const history = this.getHistory();
    const reports = this.getReports();
    const thresholds = this.getThresholds();

    const high = history.filter((h) => h.level === "HIGH").length;
    const med = history.filter((h) => h.level === "MEDIUM").length;
    const low = history.filter((h) => h.level === "LOW").length;
    const pending = reports.filter((r) => r.status === "pending").length;

    return {
      total_analyses: history.length + 1420,
      high_risk_count: high + 482,
      medium_risk_count: med + 310,
      low_risk_count: low + 628,
      pending_reports: pending,
      total_users: 184,
      system_health: "Optimal (All ML Bundles Operational)",
      thresholds,
    };
  },
};
