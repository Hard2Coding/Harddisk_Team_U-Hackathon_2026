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

  // English sample presets for testing
  const samples = [
    {
      label: "🚨 Urgent Bank Phishing (High Risk)",
      text: "Security Alert: Your bank account access has been suspended. Confirm your 6-digit OTP code immediately at http://kbank-verify-otp.xyz within 10 minutes to unblock.",
      kind: "text" as const,
    },
    {
      label: "📦 Fake Courier Fee (Medium Risk)",
      text: "Express Parcel Service: Package delivery #US8819 is on hold at local depot. Update delivery address and confirm $1.50 customs fee at scb-secure-update.top",
      kind: "text" as const,
    },
    {
      label: "💰 0% Instant Loan Trap (High Risk)",
      text: "Pre-approved loan up to $15,000 with 0% interest for 12 months. No collateral needed. Instant funds transfer. Add WhatsApp @easy_loan99 or call 0891234567.",
      kind: "text" as const,
    },
    {
      label: "✅ Normal Message (Safe / Low Risk)",
      text: "Hi mom, our team finished the project early today. I will be heading home around 6:00 PM for dinner. See you soon!",
      kind: "text" as const,
    },
  ];

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) {
      setErrorMsg("Please enter text or upload content to scan.");
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const kind = activeTab === "url" ? "url" : activeTab === "ocr" ? "image" : activeTab === "qr" ? "qr" : "text";
      const result = await api.analyze(inputText, kind);
      onAnalysisComplete(result);
    } catch (err: any) {
      setErrorMsg(err.message || "Analysis failed. Please try again.");
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
    <div className="bg-white dark:bg-[#10203A] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
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
          <span>Message / SMS</span>
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
          <span>Link / URL</span>
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
          <span>Screenshot / OCR</span>
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
          <span>QR Code</span>
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
          <span>Batch CSV</span>
        </button>
      </div>

      {/* Quick Test Sample Presets */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Try Quick Test Samples:</span>
          </span>
          <span className="text-[11px] text-slate-400">Click any preset to autofill</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {samples.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadSample(s.text, s.kind)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:border-blue-400 transition-all text-left truncate max-w-full"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {activeTab === "text" && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Paste suspicious message, SMS text, or email body
            </label>
            <textarea
              rows={5}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g., Security Alert: Your bank account access is suspended. Verify your OTP code immediately at..."
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition-all"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>Supports plain text in English and multilingual messages</span>
              <span>{inputText.length} characters</span>
            </div>
          </div>
        )}

        {activeTab === "url" && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Enter suspicious URL or domain name to inspect
            </label>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="https://scb-secure-update.top"
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition-all"
            />
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
              🛡️ Zero-Fetch Policy: The engine computes lexical risk features without fetching or resolving the target server, keeping you safe from malware.
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
            <FileSpreadsheet className="w-10 h-10 text-blue-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Batch CSV Analysis (Up to 200 items)
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Upload a CSV file containing `text` or `url` columns for asynchronous queue processing and downloadable masked reports.
            </p>
            <button
              type="button"
              onClick={() => {
                setInputText("http://kbank-verify-otp.xyz\n+66891234567\nscb-secure-update.top");
                setActiveTab("text");
              }}
              className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-100 transition-colors"
            >
              Load Sample Batch List
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
          className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing risk signals and intelligence models...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Analyze Risk Now</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
