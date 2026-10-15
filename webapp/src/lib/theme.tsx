"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "dark" | "light";
type Language = "th" | "en";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  th: {
    appName: "ScamGraph AI",
    tagline: "ประเมินความเสี่ยงก่อนตกเป็นเหยื่อ (Predict Before It Gets Reported)",
    home: "หน้าแรก",
    check: "ตรวจวิเคราะห์",
    history: "ประวัติการตรวจ",
    alerts: "การแจ้งเตือน",
    graph: "กราฟความสัมพันธ์",
    reports: "แจ้งเบาะแส",
    help: "ศูนย์ช่วยเหลือ",
    settings: "ตั้งค่า",
    admin: "ผู้ดูแลระบบ",
    login: "เข้าสู่ระบบ",
    logout: "ออกจากระบบ",
    guestMode: "โหมดผู้เยี่ยมชม",
    scanTitle: "ตรวจสอบข้อความ ลิงก์ และสลิปโอนเงินต้องสงสัย",
    scanSubtitle: "วิเคราะห์ความเสี่ยงฟิชชิ่ง แก๊งคอลเซ็นเตอร์ และบัญชีม้าด้วยโมเดล AI และเครือข่ายความสัมพันธ์",
    textScan: "ข้อความ / SMS",
    urlScan: "ลิงก์ / เว็บไซต์",
    ocrScan: "รูปภาพ / OCR",
    qrScan: "คิวอาร์โค้ด / QR",
    batchScan: "ไฟล์รวม / Batch CSV",
    analyzeBtn: "เริ่มตรวจสอบความเสี่ยง",
    analyzing: "กำลังประมวลผลโมเดล AI...",
    recentScans: "การตรวจล่าสุด",
    viewAll: "ดูทั้งหมด",
    highRisk: "ความเสี่ยงสูง",
    mediumRisk: "ควรระวัง",
    lowRisk: "ความเสี่ยงต่ำ",
    insufficientData: "ข้อมูลไม่เพียงพอ",
    sampleBadge: "ตัวอย่าง",
    saveHistory: "บันทึกในประวัติ",
    saved: "บันทึกแล้ว",
    shareReport: "แชร์รายงาน",
    copied: "คัดลอกลิงก์แล้ว",
    whyScore: "ทำไมถึงได้คะแนนนี้? (Evidence Grounding)",
    missingEvidence: "ข้อจำกัดของข้อมูล & คำเตือน",
    immediateAdvice: "คำแนะนำเร่งด่วนสำหรับคุณ",
    extractedEntities: "เอนทิตีที่ตรวจพบในข้อมูล",
    viewInGraph: "ดูความสัมพันธ์ในกราฟ",
    modelDetails: "รายละเอียดโมเดล & SHAP Feature Contribution",
  },
  en: {
    appName: "ScamGraph AI",
    tagline: "Predict Before It Gets Reported",
    home: "Dashboard",
    check: "Scan & Analyze",
    history: "History",
    alerts: "Alerts",
    graph: "Entity Graph",
    reports: "Report Clue",
    help: "Help Center",
    settings: "Settings",
    admin: "Admin Center",
    login: "Sign In",
    logout: "Sign Out",
    guestMode: "Guest Mode",
    scanTitle: "Check Suspicious Messages, URLs & Transfer Slips",
    scanSubtitle: "Analyze fraud, phishing, call center scams & mule accounts using AI models and knowledge graphs",
    textScan: "Text / SMS",
    urlScan: "Link / URL",
    ocrScan: "Screenshot / OCR",
    qrScan: "QR Code",
    batchScan: "Batch CSV",
    analyzeBtn: "Analyze Risk Now",
    analyzing: "Analyzing AI Models...",
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
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [language, setLanguageState] = useState<Language>("th");

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("scamgraph_theme") as Theme | null;
      const savedLang = localStorage.getItem("scamgraph_lang") as Language | null;
      if (savedTheme) {
        setTheme(savedTheme);
        if (savedTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } else {
        // Default to dark mode for rich aesthetic
        document.documentElement.classList.add("dark");
      }
      if (savedLang) {
        setLanguageState(savedLang);
      }
    } catch {
      // Ignore
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("scamgraph_theme", next);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("scamgraph_lang", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, language, setLanguage, t }}>
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
