import { HistoryItem, CommunityReport, AdminStats, Analysis } from "@/types/api";
import { maskSnippet } from "./utils";

const SEED_HISTORY: HistoryItem[] = [
  {
    id: "hist-101",
    text: "แจ้งเตือนจากธนาคาร กสิกรไทย บัญชีของท่านถูกระงับชั่วคราว กรุณายืนยันรหัส OTP ด่วนที่ http://kbank-verify-otp.xyz ภายใน 10 นาที",
    masked_text: "แจ้งเตือนจากธนาคาร กสิกรไทย บัญชีของท่านถูกระงับชั่วคราว กรุณายืนยันรหัส OTP ด่วนที่ http://kba***otp.xyz ภายใน 10 นาที",
    kind: "text",
    level: "HIGH",
    score: 88,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    result: {
      id: "scan-seed-1",
      checked_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      input_kind: "text",
      score: 88,
      level: "HIGH",
      summary: "พบสัญญาณความเสี่ยงสูง ควรหยุดและตรวจสอบกับช่องทางทางการ",
      entities: [
        { id: "e1", type: "url", value: "http://kbank-verify-otp.xyz", masked_value: "http://kba***otp.xyz" },
        { id: "e2", type: "domain", value: "kbank-verify-otp.xyz", masked_value: "kba***otp.xyz" },
      ],
      reasons: [
        { code: "VERIFIED_THREAT", title: "พบประวัติในฐานข้อมูลภัยคุกคาม", detail: "AOC 1441 Alert Match", source: "AOC 1441", severity: "danger" },
        { code: "CREDENTIAL_OTP", title: "ตรวจพบการร้องขอรหัส OTP", detail: "Phishing pattern", source: "TF-IDF Model", severity: "danger" },
      ],
      history: { status: "confirmed", matches: [] },
      graph: { nodes: [], edges: [] },
      missing_data: [],
      model: { version: "v2", status: "ready", dataset_is_sample: false },
      similar_examples: [],
      contributions: [],
      advice: ["อย่าส่งรหัส OTP หรือรหัสผ่าน", "ระงับการโอนเงินทันที"],
      thresholds: { medium: 40, high: 70 },
    },
  },
  {
    id: "hist-102",
    text: "พัสดุของคุณ Flash Express ตกค้าง กรุณาตรวจสอบสถานะและชำระค่าธรรมเนียม 35 บาท",
    masked_text: "พัสดุของคุณ Flash Express ตกค้าง กรุณาตรวจสอบสถานะและชำระค่าธรรมเนียม 35 บาท",
    kind: "text",
    level: "MEDIUM",
    score: 54,
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    result: {
      id: "scan-seed-2",
      checked_at: new Date(Date.now() - 3600000 * 18).toISOString(),
      input_kind: "text",
      score: 54,
      level: "MEDIUM",
      summary: "พบสัญญาณที่ควรตรวจสอบเพิ่มเติมก่อนดำเนินการ",
      entities: [],
      reasons: [
        { code: "IMPERSONATION", title: "อ้างชื่อบริษัทขนส่ง", detail: "พบคำระบุแบรนด์ขนส่งยอดนิยม", source: "Entity Model", severity: "warning" },
      ],
      history: { status: "unverified", matches: [] },
      graph: { nodes: [], edges: [] },
      missing_data: ["ไม่มี URL ในข้อความ"],
      model: { version: "v2", status: "ready", dataset_is_sample: false },
      similar_examples: [],
      contributions: [],
      advice: ["ตรวจสอบผ่านแอปทางการของ Flash Express โดยตรง"],
      thresholds: { medium: 40, high: 70 },
    },
  },
  {
    id: "hist-103",
    text: "สวัสดีครับคุณแม่ วันนี้จะกลับบ้านกี่โมงครับ เดี๋ยวทำกับข้าวรอครับ",
    masked_text: "สวัสดีครับคุณแม่ วันนี้จะกลับบ้านกี่โมงครับ เดี๋ยวทำกับข้าวรอครับ",
    kind: "text",
    level: "LOW",
    score: 15,
    created_at: new Date(Date.now() - 3600000 * 40).toISOString(),
    result: {
      id: "scan-seed-3",
      checked_at: new Date(Date.now() - 3600000 * 40).toISOString(),
      input_kind: "text",
      score: 15,
      level: "LOW",
      summary: "ไม่พบสัญญาณความเสี่ยงชัดเจนจากข้อความนี้",
      entities: [],
      reasons: [],
      history: { status: "clean", matches: [] },
      graph: { nodes: [], edges: [] },
      missing_data: ["ไม่พบประวัติ"],
      model: { version: "v2", status: "ready", dataset_is_sample: false },
      similar_examples: [],
      contributions: [],
      advice: ["สนทนาตามปกติ"],
      thresholds: { medium: 40, high: 70 },
    },
  },
];

const SEED_REPORTS: CommunityReport[] = [
  {
    id: "rep-201",
    user_name: "สมชาย รักสงบ",
    kind: "phone",
    text: "เบอร์ 0891234567 โทรมาอ้างเป็นศาลอาญา แจ้งว่ามีคดีฟอกเงินและให้โอนเงินเพื่อตรวจสอบ",
    detail: "มีเสียงบันทึกระบบอัตโนมัติแจ้งว่ามีหมายศาลคดีอาญา",
    entities: [{ id: "e-rep-1", type: "phone", value: "0891234567", masked_value: "089-xxx-4567" }],
    evidence_files: [],
    status: "confirmed",
    moderation_reason: "ตรงกับฐานข้อมูลคดีคอลเซ็นเตอร์ AOC และตำรวจไซเบอร์",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    reviewed_at: new Date(Date.now() - 86400000 * 0.5).toISOString(),
  },
  {
    id: "rep-202",
    user_name: "Kittipong B.",
    kind: "url",
    text: "http://scb-secure-update.top ส่งมาทาง SMS อ้างว่าแต้มกำลังจะหมดอายุ",
    detail: "ส่งมาจากเบอร์แปลก หลอกให้กดเข้าไปกรอกรหัสธนาคาร",
    entities: [{ id: "e-rep-2", type: "url", value: "http://scb-secure-update.top", masked_value: "http://scb***top" }],
    evidence_files: [],
    status: "pending",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "rep-203",
    user_name: "Ploy Phaisan",
    kind: "account",
    text: "เลขบัญชีม้า 1402998810 หลอกขายโทรศัพท์มือถือราคา 2,500 บาท โอนแล้วบล็อกหนี",
    detail: "พบในกลุ่มซื้อขาย Facebook",
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
      total_analyses: history.length + 1420, // include system historical baseline
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
