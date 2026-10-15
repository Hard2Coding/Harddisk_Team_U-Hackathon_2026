"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CommunityReport, Entity } from "@/types/api";
import { api } from "@/lib/api";
import { extractEntities } from "@/lib/scamEngine";
import { formatDate } from "@/lib/utils";
import {
  Flag,
  Send,
  UploadCloud,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
} from "lucide-react";

function ReportsContent() {
  const searchParams = useSearchParams();
  const prefill = searchParams.get("prefill") || "";

  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [kind, setKind] = useState("text");
  const [suspectContent, setSuspectContent] = useState(prefill);
  const [detailContext, setDetailContext] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  const liveEntities: Entity[] = extractEntities(suspectContent);

  const loadReports = async () => {
    try {
      const data = await api.listReports();
      setReports(data);
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suspectContent.trim()) return;

    setIsSubmitting(true);
    try {
      await api.submitReport({
        kind,
        text: suspectContent,
        detail: detailContext,
        entities: liveEntities,
      });

      setSuccessNotice(true);
      setSuspectContent("");
      setDetailContext("");
      loadReports();
      setTimeout(() => setSuccessNotice(false), 4000);
    } catch {
      // Ignore
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800 text-xs font-bold mb-2">
          <Flag className="w-3.5 h-3.5 text-purple-600" />
          <span>Crowdsourced Scam Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Report a Scam Clue (Community Intelligence)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Submit suspicious phone numbers, phishing URLs, or mule accounts to help security moderators update the threat registry and protect others.
        </p>
      </div>

      {successNotice && (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2.5 animate-in fade-in font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Report submitted successfully! It has been routed to the administrative review queue.</span>
        </div>
      )}

      {/* Submission Form */}
      <div className="bg-white dark:bg-[#10203A] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Submit Suspicious Lead Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Identifier Type
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "text", label: "Message / SMS" },
                { id: "url", label: "Phishing Website URL" },
                { id: "phone", label: "Imposter Phone Number" },
                { id: "account", label: "Mule Bank Account" },
                { id: "wallet", label: "Digital Wallet / PromptPay" },
                { id: "line", label: "Fraudulent Chat Handle" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setKind(t.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    kind === t.id
                      ? "bg-purple-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Suspect Content */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Suspicious Content or Identifier *
            </label>
            <textarea
              rows={3}
              required
              value={suspectContent}
              onChange={(e) => setSuspectContent(e.target.value)}
              placeholder="e.g. Received an SMS from +66891234567 claiming my bank account is frozen with a link to http://kbank-verify-otp.xyz"
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
            />
          </div>

          {/* Live Entity Preview */}
          {liveEntities.length > 0 && (
            <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-800 space-y-1.5">
              <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Automatically Extracted Entities:</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {liveEntities.map((e, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-white dark:bg-slate-800 text-[11px] font-mono border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-2xs"
                  >
                    <strong className="text-purple-600 uppercase">{e.type}:</strong> {e.masked_value}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Context Details */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Context & Incident Details (Where did you encounter this?)
            </label>
            <textarea
              rows={2}
              value={detailContext}
              onChange={(e) => setDetailContext(e.target.value)}
              placeholder="Encountered in a social marketplace group pretending to sell discounted goods..."
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
            />
          </div>

          {/* Screenshot notice */}
          <div className="p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-500 bg-slate-50/50 dark:bg-slate-900/40">
            <UploadCloud className="w-6 h-6 mx-auto text-slate-400 mb-1" />
            <span>Optional screenshot evidence (GPS metadata & personal device tags automatically stripped)</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !suspectContent.trim()}
            className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? "Submitting clue..." : "Submit Clue for Review"}</span>
          </button>
        </form>
      </div>

      {/* User's Submitted Clues Tracking List */}
      <div className="bg-white dark:bg-[#10203A] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            My Submitted Clues & Review Status
          </h3>
          <span className="text-xs font-bold text-slate-400">{reports.length} Reports</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {reports.map((r) => {
            return (
              <div key={r.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {r.status === "confirmed" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirmed Threat Record</span>
                      </span>
                    )}
                    {r.status === "pending" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Pending Review</span>
                      </span>
                    )}
                    {r.status === "rejected" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:border-red-800 dark:text-red-400">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Rejected</span>
                      </span>
                    )}
                    <span className="text-xs text-slate-400">• {formatDate(r.created_at)}</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-400 font-bold">
                    {r.kind}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-mono">
                  {r.text}
                </p>

                {r.detail && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                    Context: {r.detail}
                  </p>
                )}

                {r.moderation_reason && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                    <strong className="text-blue-600 dark:text-blue-400">Moderator Note:</strong>{" "}
                    {r.moderation_reason}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading reports...</div>}>
      <ReportsContent />
    </Suspense>
  );
}
