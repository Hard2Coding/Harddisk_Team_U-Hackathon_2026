"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { HistoryItem, RiskLevel } from "@/types/api";
import { storage } from "@/lib/storage";
import { getRiskColor, formatDate, sanitizeCsvField } from "@/lib/utils";
import {
  History,
  Search,
  Filter,
  Download,
  Trash2,
  ExternalLink,
  FileSpreadsheet,
  FileCode,
  AlertCircle,
} from "lucide-react";

export default function HistoryPage() {
  const [records, setRecords] = useState<HistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [selectedKind, setSelectedKind] = useState<string>("ALL");

  useEffect(() => {
    setRecords(storage.getHistory());
  }, []);

  const handleDelete = (id: string) => {
    storage.deleteHistory(id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const handleClearAll = () => {
    if (confirm("ต้องการลบประวัติการตรวจทั้งหมดของคุณหรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้")) {
      storage.clearHistory();
      setRecords([]);
    }
  };

  const filteredRecords = useMemo(() => {
    return records.filter((item) => {
      // Search
      const matchesSearch =
        !searchTerm.trim() ||
        item.masked_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.text.toLowerCase().includes(searchTerm.toLowerCase());

      // Risk level filter
      const matchesLevel = selectedLevel === "ALL" || item.level === selectedLevel;

      // Input kind filter
      const matchesKind = selectedKind === "ALL" || item.kind === selectedKind;

      return matchesSearch && matchesLevel && matchesKind;
    });
  }, [records, searchTerm, selectedLevel, selectedKind]);

  // Export as CSV with formula injection defense
  const exportCsv = () => {
    if (records.length === 0) return;
    const headers = ["ID", "CheckedAt", "Kind", "RiskLevel", "Score", "MaskedText"];
    const rows = records.map((r) => [
      sanitizeCsvField(r.id),
      sanitizeCsvField(r.created_at),
      sanitizeCsvField(r.kind),
      sanitizeCsvField(r.level),
      r.score !== null ? r.score : "",
      sanitizeCsvField(r.masked_text),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `scamgraph_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export as JSON
  const exportJson = () => {
    if (records.length === 0) return;
    const dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `scamgraph_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title & Export Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Saved Threat Logs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            ประวัติการตรวจสอบความเสี่ยง (Saved History)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            บันทึกการสแกนสูงสุด 300 รายการ พร้อมระบบป้องกันข้อมูลรั่วไหลและการส่งออกไฟล์
          </p>
        </div>

        {/* Export buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportCsv}
            disabled={records.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-2xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            <span>ส่งออก CSV</span>
          </button>
          <button
            onClick={exportJson}
            disabled={records.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-2xs"
          >
            <FileCode className="w-3.5 h-3.5 text-blue-500" />
            <span>ส่งออก JSON</span>
          </button>
          {records.length > 0 && (
            <button
              onClick={handleClearAll}
              className="p-2 rounded-xl border border-red-200 dark:border-red-900/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              title="ลบประวัติทั้งหมด"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาตามข้อความ, เบอร์โทรศัพท์ หรือ URL..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 mr-1 text-[11px] font-bold uppercase">ระดับความเสี่ยง:</span>
            {["ALL", "HIGH", "MEDIUM", "LOW"].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
                  selectedLevel === level
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {level === "ALL" ? "ทั้งหมด" : level}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 mr-1 text-[11px] font-bold uppercase">ประเภท:</span>
            {["ALL", "text", "url", "image", "qr"].map((kind) => (
              <button
                key={kind}
                onClick={() => setSelectedKind(kind)}
                className={`px-2.5 py-1 rounded-xl text-xs font-medium capitalize transition-colors ${
                  selectedKind === kind
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {kind === "ALL" ? "ทั้งหมด" : kind}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History Items List */}
      <div className="bg-white dark:bg-[#10203A] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((item) => {
            const risk = getRiskColor(item.level);
            return (
              <div
                key={item.id}
                className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${risk.badgeBg}`}>
                      {risk.labelEn}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md font-mono uppercase bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {item.kind}
                    </span>
                    <span className="text-xs text-slate-400">
                      • {formatDate(item.created_at)}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-mono truncate max-w-2xl">
                    {item.masked_text}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="text-xl font-black text-slate-900 dark:text-white">
                      {item.score !== null ? Math.round(item.score) : "—"}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-bold">/ 100</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/analyze?historyId=${item.id}`}
                      className="px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-100 transition-colors"
                    >
                      ดูผลวิเคราะห์
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="ลบรายการนี้"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center text-xs text-slate-500 space-y-2">
            <AlertCircle className="w-8 h-8 mx-auto text-slate-400" />
            <p>ไม่พบบันทึกประวัติการตรวจสอบที่ตรงกับเงื่อนไข</p>
          </div>
        )}
      </div>
    </div>
  );
}
