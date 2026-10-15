"use client";
import React, { useState } from "react";
import {
  MessageSquare,
  Globe,
  Image as ImageIcon,
  QrCode,
  FileSpreadsheet,
  Sparkles,
  ArrowRight,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";
import { OcrUploader } from "./OcrUploader";
import { QrScanner } from "./QrScanner";
import { Analysis } from "@/types/api";
import { api } from "@/lib/api";

interface ScanFormProps {
  onAnalysisComplete: (result: Analysis) => void;
}

export function ScanForm({ onAnalysisComplete }: ScanFormProps) {
  const [activeTab, setActiveTab] = useState<"text" | "url" | "ocr" | "qr" | "csv">("text");
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sample payloads for quick demo testing
  const samples = [
    {
      label: "🚨 Urgent Bank OTP (High Risk)",
      text: "แจ้งเตือนจากธนาคาร กสิกรไทย บัญชีของท่านถูกระงับชั่วคราว กรุณายืนยันรหัส OTP ด่วนที่ http://kbank-verify-otp.xyz ภายใน 10 นาทีเพื่อปลดล็อค",
      kind: "text" as const,
    },
    {
      label: "📦 Fake Parcel Fee (Medium Risk)",
      text: "Flash Express: พัสดุหมายเลข TH09881 ของท่านตกค้าง กรุณายืนยันที่อยู่และชำระค่าธรรมเนียม 35 บาทที่ scb-secure-update.top",
      kind: "text" as const,
    },
    {
      label: "💰 0% Fast Loan Bait (High Risk)",
      text: "อนุมัติเงินกู้ด่วน 50,000 บาท ดอกเบี้ย 0% ไม่ต้องมีคนค้ำ โอนเข้าบัญชีทันที แอดไลน์ @easy_loan99 หรือโทร 0891234567",
      kind: "text" as const,
    },
    {
      label: "✅ Legitimate Message (Safe Low Risk)",
      text: "สวัสดีครับ พรุ่งนี้ทีมงานจะเข้าไปติดตั้งเครื่องปรับอากาศตามที่นัดหมายไว้ช่วง 10:00 น. ครับ ขอบคุณครับ",
      kind: "text" as const,
    },
  ];

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) {
      setErrorMsg("กรุณากรอกข้อความหรืออัปโหลดข้อมูลที่ต้องการตรวจสอบ");
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const kind = activeTab === "url" ? "url" : activeTab === "ocr" ? "image" : activeTab === "qr" ? "qr" : "text";
      const result = await api.analyze(inputText, kind);
      onAnalysisComplete(result);
    } catch (err: any) {
      setErrorMsg(err.message || "เกิดข้อผิดพลาดในการวิเคราะห์");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSample = (sampleText: string, kind: "text" | "url") => {
    setInputText(sampleText);
    setActiveTab(kind);
    setErrorMsg(null);
  };

  return (
    <div className="bg-white dark:bg-[#10203A] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Mode Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab("text")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "text"
              ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>ข้อความ / Text</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("url")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "url"
              ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>ลิงก์ / URL</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ocr")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "ocr"
              ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>รูปภาพ / OCR</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("qr")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "qr"
              ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>คิวอาร์ / QR</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("csv")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "csv"
              ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>ชุดข้อมูล / CSV</span>
        </button>
      </div>

      {/* Quick Test Sample Chips */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>ทดสอบตัวอย่างทันที (Quick Test Samples):</span>
          </span>
          <span className="text-[11px]">คลิกเพื่อกรอกอัตโนมัติ</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {samples.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadSample(s.text, s.kind)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200/80 dark:border-slate-700 hover:border-blue-300 transition-all text-left truncate max-w-full"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {activeTab === "text" && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              วางข้อความ SMS, LINE หรืออีเมลที่ต้องสงสัย (Paste suspicious text)
            </label>
            <textarea
              rows={5}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="ตัวอย่าง: บัญชีของท่านถูกระงับชั่วคราว กรุณายืนยันรหัส OTP ด่วนที่..."
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition-all"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>รองรับภาษาไทยและภาษาอังกฤษ</span>
              <span>{inputText.length} ตัวอักษร</span>
            </div>
          </div>
        )}

        {activeTab === "url" && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              ระบุ URL หรือโดเมนที่ต้องการตรวจโครงสร้าง (Analyze URL features)
            </label>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="https://scb-secure-update.top"
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition-all"
            />
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
              🛡️ Zero-Fetch Policy: ระบบวิเคราะห์ลักษณะตัวอักษรและโครงสร้างโดยไม่คลิกเปิดเว็บไซต์จริง ป้องกันมัลแวร์
            </p>
          </div>
        )}

        {activeTab === "ocr" && (
          <OcrUploader onTextExtracted={(text) => setInputText(text)} />
        )}

        {activeTab === "qr" && (
          <QrScanner onPayloadDecoded={(payload) => setInputText(payload)} />
        )}

        {activeTab === "csv" && (
          <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl text-center space-y-3 bg-slate-50/50 dark:bg-slate-900/40">
            <FileSpreadsheet className="w-10 h-10 text-blue-500 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              วิเคราะห์เป็นชุดไฟล์ CSV (สูงสุด 200 รายการ)
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              อัปโหลดไฟล์ CSV ที่มีคอลัมน์ `text` หรือ `url` เพื่อประมวลผลพร้อมดาวน์โหลดรายงานผลแบบคัดกรองความปลอดภัย
            </p>
            <button
              type="button"
              onClick={() => {
                setInputText("http://kbank-verify-otp.xyz\n0891234567\nflash-parcel-fake.top");
                setActiveTab("text");
              }}
              className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:bg-blue-100 transition-colors"
            >
              ใช้ตัวอย่างข้อมูลหลายรายการ (Load Multi-item Batch)
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Button */}
        <button
          type="submit"
          disabled={isLoading || !inputText.trim()}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>กำลังวิเคราะห์โมเดล AI และหลักฐานความเสี่ยง...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>ตรวจสอบความเสี่ยงทันที (Analyze Risk Now)</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
