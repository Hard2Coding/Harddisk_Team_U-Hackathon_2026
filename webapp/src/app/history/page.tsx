"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Image as ImageIcon,
  MessageSquareText,
  Link2,
  Trash2,
  ChevronRight,
  History as HistoryIcon,
  Landmark,
  Globe,
  Flag,
} from "lucide-react";
import { AnalysisResults, RiskBadge } from "@/components/AnalysisResults";
import { clearHistory, removeHistory, useHistory, type HistoryEntry } from "@/lib/history";

const KIND_ICON: Record<HistoryEntry["kind"], typeof ImageIcon> = {
  screenshot: ImageIcon,
  text: MessageSquareText,
  url: Link2,
  bank_report: Landmark,
};

const dateFmt = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" });

export default function HistoryPage() {
  const items = useHistory();
  const [openId, setOpenId] = useState<string | null>(null);
  const open = items.find((i) => i.id === openId) ?? null;

  if (open) {
    return (
      <div className="mx-auto max-w-5xl px-5 pt-10 space-y-4">
        <button
          type="button"
          onClick={() => setOpenId(null)}
          className="text-sm text-muted hover:text-ink transition-colors"
        >
          ← Back to history
        </button>
        <p className="text-sm text-muted truncate">
          {open.label} · {dateFmt.format(new Date(open.createdAt))}
        </p>

        {open.reportDetails && (
          <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-5 space-y-2">
            <div className="flex items-center gap-2 text-purple-900 font-semibold text-sm">
              <Flag className="w-4 h-4 text-purple-700" />
              <span>User Reported Clue Details</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
              <div>
                <span className="text-muted">Account Number: </span>
                <strong className="font-mono text-purple-950 text-sm">{open.reportDetails.accountNumber}</strong>
              </div>
              <div>
                <span className="text-muted">Bank Company: </span>
                <strong className="text-slate-900">{open.reportDetails.bankCompany}</strong>
              </div>
              <div>
                <span className="text-muted">Account Holder: </span>
                <strong className="text-slate-900">{open.reportDetails.accountName}</strong>
              </div>
              <div>
                <span className="text-muted">Scam Category: </span>
                <strong className="text-red-700">{open.reportDetails.scamType}</strong>
              </div>
              {open.reportDetails.platform && (
                <div className="sm:col-span-2 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-muted" />
                  <span className="text-muted">Reported Platform: </span>
                  <span className="px-2 py-0.5 rounded bg-white font-semibold text-purple-900 border border-purple-200">
                    {open.reportDetails.platform}
                  </span>
                </div>
              )}
              {open.reportDetails.notes && (
                <div className="sm:col-span-2 bg-white/80 p-2.5 rounded-lg border border-purple-100 italic text-slate-600">
                  &ldquo;{open.reportDetails.notes}&rdquo;
                </div>
              )}
            </div>
          </div>
        )}

        <AnalysisResults analysis={open.analysis} onReset={() => setOpenId(null)} resetLabel="Done" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5">
      <section className="pt-14 sm:pt-20 pb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">History</h1>
          <p className="mt-2 text-muted">Saved only on this device. Screenshots are never stored.</p>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            id="clear-history"
            onClick={() => {
              if (window.confirm("Clear all saved checks on this device?")) clearHistory();
            }}
            className="shrink-0 text-sm text-muted hover:text-red-700 transition-colors"
          >
            Clear all
          </button>
        )}
      </section>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface px-6 py-14 text-center">
          <div className="mx-auto grid place-items-center w-12 h-12 rounded-xl bg-soft">
            <HistoryIcon className="w-5 h-5 text-muted" />
          </div>
          <p className="mt-4 font-medium">No checks yet</p>
          <p className="mt-1 text-sm text-muted">Your results will appear here after you check something.</p>
          <div className="mt-6 flex justify-center gap-2">
            <Link href="/" className="inline-flex items-center h-10 px-4 rounded-xl bg-ink text-white text-sm font-medium">
              Check a screenshot
            </Link>
            <Link
              href="/check"
              className="inline-flex items-center h-10 px-4 rounded-xl border border-line text-sm font-medium hover:bg-soft"
            >
              Check text
            </Link>
          </div>
        </div>
      ) : (
        <ul className="rounded-2xl border border-line bg-surface divide-y divide-line overflow-hidden">
          {items.map((item) => {
            const Icon = KIND_ICON[item.kind];
            return (
              <li key={item.id} className="group flex items-center">
                <button
                  type="button"
                  onClick={() => setOpenId(item.id)}
                  className="flex-1 min-w-0 flex items-center gap-4 px-4 sm:px-5 py-4 text-left hover:bg-soft/60 transition-colors"
                >
                  <span className="grid place-items-center w-10 h-10 rounded-lg bg-soft shrink-0">
                    <Icon className="w-4.5 h-4.5 text-muted" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">{item.label}</span>
                      {item.kind === "bank_report" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-800 shrink-0">
                          Reported Clue
                        </span>
                      )}
                    </span>
                    <span className="block text-xs text-muted mt-0.5">{dateFmt.format(new Date(item.createdAt))}</span>
                  </span>
                  <RiskBadge level={item.analysis.riskLevel} score={item.analysis.riskScore} size="sm" />
                  <ChevronRight className="w-4 h-4 text-subtle shrink-0" />
                </button>
                <button
                  type="button"
                  onClick={() => removeHistory(item.id)}
                  aria-label={`Delete ${item.label}`}
                  className="p-3 mr-1 rounded-lg text-subtle hover:text-red-700 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
