"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  ScanSearch,
  Upload,
  ListChecks,
  ShieldQuestion,
  Crown,
  ArrowRight,
} from "lucide-react";
import { ScreenshotUploader } from "@/components/ScreenshotUploader";
import { AnalysisResults } from "@/components/AnalysisResults";
import { ErrorMessage } from "@/components/ErrorMessage";
import type { ScamAnalysis } from "@/lib/analysis-schema";
import { addHistory } from "@/lib/history";
import { useUserProfile, incrementChecksUsed } from "@/lib/userProfile";

const EXAMPLE_PATH = "/examples/sample-suspicious-message.png";
const TIMEOUT_MS = 45_000;

export default function HomePage() {
  const profile = useUserProfile();
  const isPremium = profile.tier === "premium";
  const checksLeft = isPremium
    ? Infinity
    : Math.max(0, profile.dailyScreenshotLimit - profile.checksUsedToday);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScamAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const selectFile = (f: File) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setResult(null);
    setError(null);
  };

  const reset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const tryExample = async () => {
    try {
      const res = await fetch(EXAMPLE_PATH);
      const blob = await res.blob();
      selectFile(new File([blob], "example-suspicious-message.png", { type: "image/png" }));
    } catch {
      setError("Couldn't load the example. Please try again.");
    }
  };

  const analyze = async () => {
    if (!file || loading) return;

    if (!isPremium && checksLeft <= 0) {
      setError(
        "You have reached your 3 free screenshot checks for today! Upgrade to Premium ($1.99/mo) or switch to Demo User in your profile menu for unlimited checks.",
      );
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/analyze", { method: "POST", body, signal: controller.signal });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data) {
        throw new Error((data && data.error) || "We couldn't analyze this screenshot. Please try again.");
      }
      const analysis = data as ScamAnalysis;
      setResult(analysis);
      addHistory({ kind: "screenshot", label: file.name, analysis });
      incrementChecksUsed();
      requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch (e) {
      setError(
        e instanceof DOMException && e.name === "AbortError"
          ? "This is taking too long. Check your connection and try again."
          : e instanceof Error
            ? e.message
            : "Something went wrong. Please try again.",
      );
    } finally {
      clearTimeout(timer);
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-5">
      {/* Hero */}
      <section className="pt-14 sm:pt-20 pb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">Check before you trust.</h1>
        <p className="mt-4 text-lg text-muted max-w-xl mx-auto leading-relaxed">
          Upload a screenshot. Understand the warning signs. Know what to do next.
        </p>
      </section>

      {/* Upload + analyze */}
      <section aria-label="Upload screenshot" className="mx-auto max-w-2xl space-y-4">
        {/* Tier Quota Status */}
        {!isPremium ? (
          <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-surface border border-line text-xs shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-muted">
                <strong className="text-ink font-semibold">Free Tier:</strong>{" "}
                {checksLeft} of {profile.dailyScreenshotLimit} checks left today
              </span>
            </div>
            <Link
              href="/pricing"
              className="text-xs font-semibold text-ink hover:underline inline-flex items-center gap-1 group"
            >
              <span>Unlimited for $1.99/mo</span>
              <ArrowRight className="w-3.5 h-3.5 text-muted group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        ) : (
          <div className="flex items-center justify-between px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 shadow-2xs">
            <span className="flex items-center gap-1.5 font-medium">
              <Crown className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Demo User (Premium Active) — Unlimited screenshot checks enabled</span>
            </span>
            <Link href="/pricing" className="font-semibold underline text-[11px] shrink-0">
              Plan info
            </Link>
          </div>
        )}

        <ScreenshotUploader
          file={file}
          previewUrl={previewUrl}
          disabled={loading}
          onSelect={selectFile}
          onClear={reset}
          onError={setError}
          onTryExample={tryExample}
        />

        {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

        {file && !result && (
          <button
            type="button"
            id="analyze-screenshot"
            onClick={analyze}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 h-13 rounded-xl bg-ink text-white text-base font-medium hover:bg-ink/90 disabled:opacity-70 disabled:cursor-wait transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Analyzing screenshot…
              </>
            ) : (
              <>
                <ScanSearch className="w-5 h-5" /> Analyze screenshot
              </>
            )}
          </button>
        )}
      </section>

      {/* Results */}
      <div ref={resultRef} className="scroll-mt-24">
        {result && (
          <div className="mt-10">
            <AnalysisResults analysis={result} onReset={reset} resetLabel="Analyze another" />
          </div>
        )}
      </div>

      {/* How it works */}
      {!result && (
        <section id="how-it-works" aria-labelledby="how-heading" className="mt-20 scroll-mt-24">
          <h2 id="how-heading" className="text-center text-sm font-medium text-muted uppercase tracking-wider">
            How it works
          </h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Upload, title: "Upload", text: "Add a screenshot of a message, chat, or email you’re unsure about." },
              { icon: ShieldQuestion, title: "Review", text: "See the warning signs, with the exact words that raised concern." },
              { icon: ListChecks, title: "Act safely", text: "Follow clear next steps to protect your money and accounts." },
            ].map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-line bg-surface p-5">
                <div className="flex items-center gap-3">
                  <span className="grid place-items-center w-9 h-9 rounded-lg bg-soft">
                    <s.icon className="w-4.5 h-4.5" strokeWidth={1.8} />
                  </span>
                  <span className="text-xs text-subtle font-medium">Step {i + 1}</span>
                </div>
                <p className="mt-4 font-medium">{s.title}</p>
                <p className="mt-1 text-sm text-muted leading-relaxed">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
