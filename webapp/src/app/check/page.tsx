"use client";

import { useState } from "react";
import { Loader2, ScanSearch, MessageSquareText, Link2 } from "lucide-react";
import { AnalysisResults } from "@/components/AnalysisResults";
import { ErrorMessage } from "@/components/ErrorMessage";
import type { ScamAnalysis } from "@/lib/analysis-schema";
import { addHistory, maskLabel } from "@/lib/history";
import { cn } from "@/lib/utils";

type Kind = "text" | "url";

const EXAMPLES: Record<Kind, string> = {
  text: "Your parcel could not be delivered. Pay the 25 THB customs fee within 24 hours at http://thai-post-fee.top or it will be returned.",
  url: "http://kbank-verify-otp.xyz/login",
};

export default function CheckPage() {
  const [kind, setKind] = useState<Kind>("text");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScamAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, kind }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data) throw new Error((data && data.error) || "Something went wrong. Please try again.");
      const analysis = data as ScamAnalysis;
      setResult(analysis);
      addHistory({ kind, label: maskLabel(text), analysis });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setText("");
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mx-auto max-w-5xl px-5">
      <section className="pt-14 sm:pt-20 pb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Check a message or link</h1>
        <p className="mt-3 text-muted max-w-lg mx-auto leading-relaxed">
          Paste the text of a suspicious SMS, chat, or email — or a link you were sent.
        </p>
      </section>

      <form onSubmit={submit} className="mx-auto max-w-2xl space-y-4">
        <div role="tablist" aria-label="What are you checking?" className="inline-flex p-1 rounded-xl bg-soft border border-line">
          {(
            [
              { k: "text", label: "Message", icon: MessageSquareText },
              { k: "url", label: "Link", icon: Link2 },
            ] as const
          ).map(({ k, label, icon: Icon }) => (
            <button
              key={k}
              type="button"
              role="tab"
              id={`tab-${k}`}
              aria-selected={kind === k}
              onClick={() => {
                setKind(k);
                setResult(null);
              }}
              className={cn(
                "inline-flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium transition-all",
                kind === k ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink",
              )}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-line bg-surface focus-within:border-subtle transition-colors">
          <label htmlFor="check-input" className="sr-only">
            {kind === "url" ? "Link to check" : "Message to check"}
          </label>
          {kind === "url" ? (
            <input
              id="check-input"
              type="text"
              inputMode="url"
              autoComplete="off"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="https://example.com/..."
              className="w-full h-14 px-5 bg-transparent rounded-2xl text-base outline-none placeholder:text-subtle"
            />
          ) : (
            <textarea
              id="check-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              maxLength={5000}
              placeholder="Paste the message here…"
              className="w-full px-5 py-4 bg-transparent rounded-2xl text-base leading-relaxed outline-none resize-y placeholder:text-subtle"
            />
          )}
          <div className="flex items-center justify-between px-4 pb-3 pt-1">
            <button
              type="button"
              id="fill-example"
              onClick={() => setText(EXAMPLES[kind])}
              className="text-sm text-muted hover:text-ink transition-colors"
            >
              Use an example
            </button>
            {kind === "text" && <span className="text-xs text-subtle">{text.length}/5000</span>}
          </div>
        </div>

        {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

        {!result && (
          <button
            type="submit"
            id="check-submit"
            disabled={loading || !text.trim()}
            className="w-full inline-flex items-center justify-center gap-2 h-13 rounded-xl bg-ink text-white text-base font-medium hover:bg-ink/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ScanSearch className="w-5 h-5" />}
            {loading ? "Checking…" : "Check now"}
          </button>
        )}
      </form>

      {result && (
        <div className="mt-10">
          <AnalysisResults analysis={result} onReset={reset} resetLabel="Check another" />
        </div>
      )}
    </div>
  );
}
