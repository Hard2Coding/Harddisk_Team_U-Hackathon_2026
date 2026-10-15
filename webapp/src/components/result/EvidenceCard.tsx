"use client";
import React from "react";
import { Reason, Entity } from "@/types/api";
import {
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  Phone,
  Globe,
  CreditCard,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface EvidenceCardProps {
  reasons: Reason[];
  missingData: string[];
  advice: string[];
  entities: Entity[];
}

export function EvidenceCard({ reasons, missingData, advice, entities }: EvidenceCardProps) {
  const getIcon = (severity?: string) => {
    if (severity === "danger") return <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />;
    if (severity === "warning") return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />;
    return <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />;
  };

  const getEntityIcon = (type: string) => {
    if (type === "phone") return <Phone className="w-3.5 h-3.5 text-purple-600" />;
    if (type === "url" || type === "domain") return <Globe className="w-3.5 h-3.5 text-blue-600" />;
    if (type === "line") return <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />;
    return <CreditCard className="w-3.5 h-3.5 text-amber-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Immediate Action Advice */}
      {advice && advice.length > 0 && (
        <div className="p-5 sm:p-6 rounded-3xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/50">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Recommended Immediate Actions
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {advice.map((item, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 shadow-2xs flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Grounded Evidence List */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Why This Score? (Evidence Grounding)</span>
          </h4>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {reasons.length} Signal{reasons.length !== 1 ? "s" : ""} Identified
          </span>
        </div>

        {reasons.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {reasons.map((r, idx) => (
              <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3">
                {getIcon(r.severity)}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {r.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                      [{r.code}]
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {r.detail}
                  </p>
                  <div className="text-[11px] text-slate-400 font-medium">
                    Detection Source: {r.source}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-500 text-center">
            No known scam signatures observed in the evidence database.
          </div>
        )}
      </div>

      {/* Extracted Identifiers & Entities */}
      {entities && entities.length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#10203A] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Extracted Identifiers & Entities
            </h4>
            <Link
              href="/graph"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <span>View in Knowledge Graph</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {entities.map((e) => (
              <div
                key={e.id}
                className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs"
              >
                {getEntityIcon(e.type)}
                <span className="font-bold uppercase text-[10px] text-slate-400">{e.type}:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">
                  {e.masked_value || e.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missing Evidence & Disclaimers */}
      {missingData && missingData.length > 0 && (
        <div className="p-5 sm:p-6 rounded-3xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 space-y-2">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 text-xs font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Missing Evidence & Model Limitations (Disclaimers)</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 dark:text-slate-300">
            {missingData.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
