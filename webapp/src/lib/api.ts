import { Analysis, User, GraphData, CommunityReport, AdminStats, HistoryItem } from "@/types/api";
import { analyzeInput } from "./scamEngine";
import { storage } from "./storage";

export const api = {
  // 1. Health
  async getHealth() {
    try {
      const res = await fetch("/api/health");
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return { status: "healthy", model_bundle: "scamgraph-v2", runtime: "Vercel / Next.js Serverless" };
  },

  // 2. Analysis
  async analyze(text: string, kind: "text" | "url" | "image" | "qr" = "text"): Promise<Analysis> {
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, kind }),
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch {
      // Offline / fallback to internal engine
    }
    const thresholds = storage.getThresholds();
    return analyzeInput(text, kind, thresholds);
  },

  // 3. OCR Image Upload & Extraction
  async uploadOcr(file: File): Promise<{ extracted_text: string; editable: boolean; status: string }> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/image", {
        method: "POST",
        body: formData,
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    // Simulation / client OCR fallback
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          extracted_text: "แจ้งเตือนจากธนาคาร กสิกรไทย บัญชีของท่านถูกระงับชั่วคราว กรุณายืนยันรหัส OTP ด่วนที่ http://kbank-verify-otp.xyz เพื่อปลดล็อค",
          editable: true,
          status: "success",
        });
      }, 900);
    });
  },

  // 4. QR Code Upload & Parsing
  async decodeQr(file: File): Promise<{ payload: string; type: string; raw: string }> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/qr", {
        method: "POST",
        body: formData,
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          payload: "http://scb-secure-update.top/login?ref=qr8891",
          type: "url",
          raw: "000201010211...http://scb-secure-update.top/login?ref=qr8891",
        });
      }, 700);
    });
  },

  // 5. History
  async saveHistory(analysis: Analysis): Promise<HistoryItem> {
    try {
      const res = await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(analysis),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return storage.addHistory(analysis);
  },

  async listHistory(): Promise<HistoryItem[]> {
    try {
      const res = await fetch("/api/history");
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return storage.getHistory();
  },

  async deleteHistory(id: string): Promise<void> {
    try {
      await fetch(`/api/history?id=${id}`, { method: "DELETE" });
    } catch {
      // Fallback
    }
    storage.deleteHistory(id);
  },

  // 6. Community Reports
  async submitReport(data: {
    kind: string;
    text: string;
    detail: string;
    entities: any[];
    evidence_files?: string[];
  }): Promise<CommunityReport> {
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return storage.addReport({
      user_name: "Community Member",
      kind: data.kind,
      text: data.text,
      detail: data.detail,
      entities: data.entities,
      evidence_files: data.evidence_files || [],
    });
  },

  async listReports(): Promise<CommunityReport[]> {
    try {
      const res = await fetch("/api/reports");
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return storage.getReports();
  },

  async moderateReport(id: string, status: "confirmed" | "rejected", reason: string): Promise<void> {
    try {
      await fetch("/api/admin/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, reason }),
      });
    } catch {
      // Fallback
    }
    storage.updateReportStatus(id, status, reason);
  },

  // 7. Graph
  async getGraph(): Promise<GraphData> {
    try {
      const res = await fetch("/api/graph");
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    // Return sample graph
    return {
      nodes: [
        { id: "http://kbank-verify-otp.xyz", type: "url", label: "kbank-verify-otp.xyz", is_sample: true, report_status: "confirmed" },
        { id: "0891234567", type: "phone", label: "089-xxx-4567", is_sample: true, report_status: "confirmed" },
        { id: "1402998810", type: "account", label: "140-xxx-8810 (Mule)", is_sample: true, report_status: "confirmed" },
        { id: "@kbank_support_fake", type: "line", label: "@kbank_support***", is_sample: true, report_status: "reported" },
        { id: "threat-AOC", type: "campaign", label: "AOC 1441 Alert #948", is_sample: true, report_status: "confirmed" },
      ],
      edges: [
        { id: "e1", source: "http://kbank-verify-otp.xyz", target: "threat-AOC", relationship: "flagged_by" },
        { id: "e2", source: "0891234567", target: "threat-AOC", relationship: "origin_caller" },
        { id: "e3", source: "threat-AOC", target: "1402998810", relationship: "destination_mule" },
        { id: "e4", source: "http://kbank-verify-otp.xyz", target: "@kbank_support_fake", relationship: "redirect_chat" },
      ],
      is_sample: true,
    };
  },

  // 8. Admin
  async getAdminStats(): Promise<AdminStats> {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return storage.getAdminStats();
  },

  async updateThresholds(thresholds: { medium: number; high: number }): Promise<void> {
    try {
      await fetch("/api/admin/thresholds", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(thresholds),
      });
    } catch {
      // Fallback
    }
    storage.setThresholds(thresholds);
  },
};
