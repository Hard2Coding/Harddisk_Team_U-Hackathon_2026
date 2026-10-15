"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";
type Language = "en";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  t: (key: string) => string;
}

const translations: Record<string, string> = {
  appName: "ScamGraph AI",
  tagline: "Predict Before It Gets Reported",
  home: "Dashboard",
  check: "Scan & Analyze",
  history: "History",
  alerts: "Alerts",
  graph: "Entity Graph",
  reports: "Report a Scam",
  help: "Help Center",
  settings: "Settings",
  admin: "Admin Center",
  login: "Sign In",
  logout: "Sign Out",
  guestMode: "Guest Mode",
  scanTitle: "Check Suspicious Messages, URLs & QR Codes",
  scanSubtitle: "Detect scams, phishing links, and fraudulent accounts with explainable AI and relationship graphs.",
  textScan: "Message / SMS",
  urlScan: "Link / URL",
  ocrScan: "Screenshot / OCR",
  qrScan: "QR Code",
  batchScan: "Batch CSV",
  analyzeBtn: "Analyze Risk Now",
  analyzing: "Analyzing with AI models...",
  recentScans: "Recent Analyses",
  viewAll: "View All",
  highRisk: "HIGH RISK",
  mediumRisk: "CAUTION",
  lowRisk: "LOW RISK",
  insufficientData: "INSUFFICIENT DATA",
  sampleBadge: "SAMPLE",
  saveHistory: "Save to History",
  saved: "Saved",
  shareReport: "Share Report",
  copied: "Link Copied",
  whyScore: "Why This Score? (Evidence Grounding)",
  missingEvidence: "Missing Evidence & Disclaimers",
  immediateAdvice: "Immediate Action Advice",
  extractedEntities: "Extracted Identifiers & Entities",
  viewInGraph: "View in Relationship Graph",
  modelDetails: "Technical Details & Model Interpretability",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("scamgraph_theme") as Theme | null;
      if (savedTheme) {
        setTheme(savedTheme);
        if (savedTheme === "dark") {
          document.documentElement.classList.add("dark");
          document.documentElement.classList.remove("light");
        } else {
          document.documentElement.classList.add("light");
          document.documentElement.classList.remove("dark");
        }
      } else {
        // Default to clean minimalist white theme
        setTheme("light");
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
      }
    } catch {
      // Ignore
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("scamgraph_theme", next);
  };

  const t = (key: string): string => {
    return translations[key] || key;
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, language: "en", t }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
