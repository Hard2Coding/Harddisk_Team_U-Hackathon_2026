import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { RiskLevel } from "@/types/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Privacy Preserving Masking
export function maskIdentifier(value: string, type: string): string {
  if (!value) return "";
  
  if (type === "phone") {
    // 0812345678 -> 081-xxx-5678
    const clean = value.replace(/[\s-]/g, "");
    if (clean.length >= 9) {
      return `${clean.slice(0, 3)}-xxx-${clean.slice(-4)}`;
    }
    return `${clean.slice(0, 2)}***${clean.slice(-2)}`;
  }

  if (type === "account" || type === "wallet") {
    // 1234567890 -> 123-xxx-x890
    const clean = value.replace(/[\s-]/g, "");
    if (clean.length >= 8) {
      return `${clean.slice(0, 3)}-xxx-${clean.slice(-4)}`;
    }
    return `${clean.slice(0, 2)}***${clean.slice(-2)}`;
  }

  if (type === "domain" || type === "url") {
    // secure-kbank-update.xyz -> sec***update.xyz
    try {
      const parsed = value.includes("://") ? new URL(value) : new URL(`http://${value}`);
      const host = parsed.hostname;
      const parts = host.split(".");
      if (parts.length >= 2) {
        const domainName = parts[parts.length - 2];
        const tld = parts[parts.length - 1];
        if (domainName.length > 5) {
          parts[parts.length - 2] = `${domainName.slice(0, 3)}***${domainName.slice(-2)}`;
        }
        return parts.join(".");
      }
      return host;
    } catch {
      return value.length > 8 ? `${value.slice(0, 4)}***${value.slice(-4)}` : value;
    }
  }

  if (type === "line") {
    // @scamaccount -> @scam***
    return value.length > 4 ? `${value.slice(0, 4)}***` : `${value}***`;
  }

  return value.length > 6 ? `${value.slice(0, 3)}***${value.slice(-3)}` : value;
}

export function maskSnippet(text: string, maxLength: number = 80): string {
  if (!text) return "";
  let clean = text.replace(/[\r\n]+/g, " ").trim();
  
  // Mask phone numbers: 08x-xxx-xxxx
  clean = clean.replace(/(\b0[689]\d{1})[-]?(\d{3})[-]?(\d{4}\b)/g, "$1-xxx-$3");
  // Mask bank accounts (10-12 digits)
  clean = clean.replace(/(\b\d{3})[-]?(\d{3})[-]?(\d{4}\b)/g, "$1-xxx-$3");

  if (clean.length > maxLength) {
    return `${clean.slice(0, maxLength)}...`;
  }
  return clean;
}

export function getRiskColor(level: RiskLevel): {
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  accent: string;
  labelEn: string;
  labelTh: string;
  bgLight: string;
} {
  switch (level) {
    case "HIGH":
      return {
        badgeBg: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30",
        badgeText: "text-red-600 dark:text-red-400",
        badgeBorder: "border-red-500/30",
        accent: "#EF4444",
        labelEn: "HIGH RISK",
        labelTh: "ความเสี่ยงสูง",
        bgLight: "bg-red-50 dark:bg-red-950/30",
      };
    case "MEDIUM":
      return {
        badgeBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
        badgeText: "text-amber-600 dark:text-amber-400",
        badgeBorder: "border-amber-500/30",
        accent: "#F59E0B",
        labelEn: "CAUTION / MEDIUM",
        labelTh: "ควรระวัง",
        bgLight: "bg-amber-50 dark:bg-amber-950/30",
      };
    case "LOW":
      return {
        badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
        badgeText: "text-emerald-600 dark:text-emerald-400",
        badgeBorder: "border-emerald-500/30",
        accent: "#10B981",
        labelEn: "LOW RISK OBSERVED",
        labelTh: "ความเสี่ยงต่ำ",
        bgLight: "bg-emerald-50 dark:bg-emerald-950/30",
      };
    case "INSUFFICIENT DATA":
    default:
      return {
        badgeBg: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30",
        badgeText: "text-slate-600 dark:text-slate-400",
        badgeBorder: "border-slate-500/30",
        accent: "#64748B",
        labelEn: "INSUFFICIENT DATA",
        labelTh: "ข้อมูลไม่เพียงพอ",
        bgLight: "bg-slate-50 dark:bg-slate-900/40",
      };
  }
}

export function formatDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoDate;
  }
}

// Sanitize CSV strings against formula injection (=, +, -, @)
export function sanitizeCsvField(field: string): string {
  if (!field) return "";
  const str = String(field);
  if (/^[=+\-@\t\r]/.test(str)) {
    return `'${str.replace(/"/g, '""')}`;
  }
  return `"${str.replace(/"/g, '""')}"`;
}
