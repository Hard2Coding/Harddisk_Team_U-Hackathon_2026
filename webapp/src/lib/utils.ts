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
    const clean = value.replace(/[\s-]/g, "");
    if (clean.length >= 9) {
      return `${clean.slice(0, 3)}-xxx-${clean.slice(-4)}`;
    }
    return `${clean.slice(0, 2)}***${clean.slice(-2)}`;
  }

  if (type === "account" || type === "wallet") {
    const clean = value.replace(/[\s-]/g, "");
    if (clean.length >= 8) {
      return `${clean.slice(0, 3)}-xxx-${clean.slice(-4)}`;
    }
    return `${clean.slice(0, 2)}***${clean.slice(-2)}`;
  }

  if (type === "domain" || type === "url") {
    try {
      const parsed = value.includes("://") ? new URL(value) : new URL(`http://${value}`);
      const host = parsed.hostname;
      const parts = host.split(".");
      if (parts.length >= 2) {
        const domainName = parts[parts.length - 2];
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
    return value.length > 4 ? `${value.slice(0, 4)}***` : `${value}***`;
  }

  return value.length > 6 ? `${value.slice(0, 3)}***${value.slice(-3)}` : value;
}

export function maskSnippet(text: string, maxLength: number = 85): string {
  if (!text) return "";
  let clean = text.replace(/[\r\n]+/g, " ").trim();
  
  // Mask phone numbers (e.g. 08x-xxx-xxxx)
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
  label: string;
  bgLight: string;
  subtitle: string;
} {
  switch (level) {
    case "HIGH":
      return {
        badgeBg: "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800",
        badgeText: "text-red-600 dark:text-red-400",
        badgeBorder: "border-red-200 dark:border-red-800",
        accent: "#EF4444",
        label: "HIGH RISK",
        subtitle: "Strong scam indicators detected. Stop all actions immediately.",
        bgLight: "bg-red-50/70 dark:bg-red-950/20",
      };
    case "MEDIUM":
      return {
        badgeBg: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
        badgeText: "text-amber-700 dark:text-amber-400",
        badgeBorder: "border-amber-200 dark:border-amber-800",
        accent: "#F59E0B",
        label: "CAUTION / REVIEW",
        subtitle: "Suspicious characteristics found. Verify through independent channels.",
        bgLight: "bg-amber-50/70 dark:bg-amber-950/20",
      };
    case "LOW":
      return {
        badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800",
        badgeText: "text-emerald-700 dark:text-emerald-400",
        badgeBorder: "border-emerald-200 dark:border-emerald-800",
        accent: "#10B981",
        label: "LOW RISK OBSERVED",
        subtitle: "No known scam signatures detected on current input.",
        bgLight: "bg-emerald-50/70 dark:bg-emerald-950/20",
      };
    case "INSUFFICIENT DATA":
    default:
      return {
        badgeBg: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
        badgeText: "text-slate-700 dark:text-slate-300",
        badgeBorder: "border-slate-200 dark:border-slate-700",
        accent: "#64748B",
        label: "INSUFFICIENT DATA",
        subtitle: "Input data is insufficient to compute a reliable risk score.",
        bgLight: "bg-slate-50 dark:bg-slate-900/40",
      };
  }
}

export function formatDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString("en-US", {
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
