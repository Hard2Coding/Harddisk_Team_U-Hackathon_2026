"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { HistoryItem } from "@/types/api";
import { storage } from "@/lib/storage";
import { getRiskColor, formatDate, sanitizeCsvField } from "@/lib/utils";
import {
  History,
  Search,
  Trash2,
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
    if (confirm("Are you sure you want to delete all saved scan records? This action cannot be undone.")) {
      storage.clearHistory();
      setRecords([]);
    }
  };

  const filteredRecords = useMemo(() => {
    return records.filter((item) => {
      const matchesSearch =
        !searchTerm.trim() ||
        item.masked_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.text.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLevel = selectedLevel === "ALL" || item.level === selectedLevel;
      const matchesKind = selectedKind === "ALL" || item.kind === selectedKind;

      return matchesSearch && matchesLevel && matchesKind;
    });
  }, [records, searchTerm, selectedLevel, selectedKind]);

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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title & Export Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800 text-xs font-bold mb-2">
            <History className="w-3.5 h-3.5 text-blue-600" />
            <span>Saved Threat Logs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Analysis History & Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Store up to 300 scans with privacy-preserving masking and secure sanitized file export
          </p>
        </div>

        {/* Export buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportCsv}
            disabled={records.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-2xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={exportJson}
            disabled={records.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-2xs"
          >
            <FileCode className="w-3.5 h-3.5 text-blue-600" />
            <span>Export JSON</span>
          </button>
          {records.length > 0 && (
            <button
              onClick={handleClearAll}
              className="p-2.5 rounded-2xl border border-red-200 dark:border-red-900/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              title="Clear all records"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by text, phone number, or domain..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 mr-1 text-[11px] font-bold uppercase">Risk Level:</span>
            {["ALL", "HIGH", "MEDIUM", "LOW"].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  selectedLevel === level
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {level === "ALL" ? "All Levels" : level}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 mr-1 text-[11px] font-bold uppercase">Channel:</span>
            {["ALL", "text", "url", "image", "qr"].map((kind) => (
              <button
                key={kind}
                onClick={() => setSelectedKind(kind)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                  selectedKind === kind
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {kind === "ALL" ? "All Types" : kind}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History Items List */}
      <div className="bg-white dark:bg-[#10203A] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((item) => {
            const risk = getRiskColor(item.level);
            return (
              <div
                key={item.id}
                className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-850/50 transition-colors"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${risk.badgeBg}`}>
                      {risk.label}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md font-mono uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
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
                      className="px-4 py-2 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-100 transition-colors"
                    >
                      Inspect Result
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2.5 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Delete record"
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
            <p>No historical records matching the filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
