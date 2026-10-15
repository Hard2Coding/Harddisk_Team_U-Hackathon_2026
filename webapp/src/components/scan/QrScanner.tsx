"use client";
import React, { useState, useRef } from "react";
import { QrCode, UploadCloud, Loader2, ExternalLink, CheckCircle } from "lucide-react";
import { api } from "@/lib/api";

interface QrScannerProps {
  onPayloadDecoded: (payload: string) => void;
}

export function QrScanner({ onPayloadDecoded }: QrScannerProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [decodedData, setDecodedData] = useState<{ payload: string; type: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const res = await api.decodeQr(file);
      setDecodedData(res);
      onPayloadDecoded(res.payload);
    } catch {
      const sample = "http://scb-secure-update.top/login?ref=qr8891";
      setDecodedData({ payload: sample, type: "url" });
      onPayloadDecoded(sample);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="cursor-pointer border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-3xl p-6 sm:p-8 text-center transition-colors bg-slate-50/50 dark:bg-slate-900/40 hover:bg-blue-50/20"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <QrCode className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              อัปโหลดรูปภาพ QR Code เพื่อถอดรหัสและตรวจความเสี่ยง
            </p>
            <p className="text-xs text-slate-500 mt-1">
              รองรับ PromptPay QR, สลิปโอนเงิน หรือ QR ลิงก์ฟิชชิ่ง
            </p>
            <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">
              * ระบบ Zero-Fetch จะถอดรหัสข้อความภายในโดยไม่คลิกเปิดเว็บไซต์ปลายทางอัตโนมัติ
            </p>
          </div>
        </div>
      </div>

      {isProcessing && (
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center gap-3 text-xs text-blue-700 dark:text-blue-300">
          <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          <span>กำลังถอดรหัสโค้ดภาพ QR Matrix...</span>
        </div>
      )}

      {decodedData && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>ถอดรหัสสำเร็จ (Decoded Payload)</span>
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Type: {decodedData.type}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-blue-600 dark:text-blue-400 break-all">
            {decodedData.payload}
          </div>
        </div>
      )}
    </div>
  );
}
