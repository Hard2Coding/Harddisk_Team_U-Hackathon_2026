"use client";

import { useState } from "react";
import {
  Check,
  Crown,
  Sparkles,
  Code2,
  Copy,
  Terminal,
  CheckCircle2,
  X,
} from "lucide-react";
import { useUserProfile, setUserTier } from "@/lib/userProfile";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

export default function PricingPage() {
  const profile = useUserProfile();
  const isPremium = profile.tier === "premium";

  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [enterpriseEmail, setEnterpriseEmail] = useState("");
  const [enterpriseCompany, setEnterpriseCompany] = useState("");
  const [apiSubmitted, setApiSubmitted] = useState(false);

  const handleActivatePremium = () => {
    setUserTier("premium");
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.3 },
      });
    } catch {}
  };

  const handleSwitchToGuest = () => {
    setUserTier("guest");
  };

  const sampleCurl = `curl -X POST https://api.scamlens.ai/v1/analyze \\
  -H "Authorization: Bearer scamlens_live_sample_key" \\
  -H "Content-Type: application/json" \\
  -d '{"content": "Urgent notice: You won 50,000 THB lottery prize", "type": "text"}'`;

  const copyCurl = () => {
    navigator.clipboard.writeText(sampleCurl);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="mx-auto max-w-5xl px-5 space-y-16 pb-20">
      {/* Hero Section */}
      <section className="pt-12 sm:pt-16 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-soft border border-line text-xs font-semibold text-muted mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Simple, Transparent Scam Protection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink">
          Predict scams before they cost you.
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
          Start free with daily checks or upgrade to Premium for just $1.99/mo for unlimited screenshot verifications and deep AI threat detection.
        </p>

        {/* Current status pill */}
        <div className="mt-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-line text-xs shadow-2xs">
          <span className="text-muted">Current Active Session:</span>
          <span
            className={cn(
              "font-semibold inline-flex items-center gap-1",
              isPremium ? "text-amber-600 dark:text-amber-400" : "text-ink"
            )}
          >
            {isPremium ? <Crown className="w-3.5 h-3.5" /> : null}
            {isPremium ? "Demo User (Premium Active)" : "Guest User (Free Tier)"}
          </span>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {/* Tier 1: Free / Guest */}
        <div className="rounded-3xl border border-line bg-surface p-7 sm:p-8 flex flex-col justify-between shadow-xs hover:border-subtle transition-all">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted">
                Guest & Basic
              </span>
              <span className="px-2 py-0.5 rounded-full bg-soft text-muted border border-line text-[11px] font-semibold">
                Free Forever
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-ink">$0</span>
              <span className="text-xs text-muted">/ forever</span>
            </div>

            <p className="mt-3 text-xs text-muted leading-relaxed">
              Essential scam detection for quick one-off checks and verifying recipient bank accounts.
            </p>

            <div className="mt-6 pt-6 border-t border-line space-y-3.5 text-xs">
              <div className="font-semibold text-ink text-[11px] uppercase tracking-wider">
                What&apos;s Included:
              </div>

              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                <span>
                  <strong className="text-ink">3 Screenshot checks</strong> per day
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                <span>Standard scam text & link scanner</span>
              </div>

              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                <span>Search 100+ reported bank accounts</span>
              </div>

              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                <span>Community clue report submission</span>
              </div>

              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                <span>Public safety guide & emergency hotline list</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-line">
            {!isPremium ? (
              <button
                type="button"
                disabled
                className="w-full py-2.5 rounded-2xl bg-soft text-muted font-medium text-xs cursor-default text-center"
              >
                Current Active Plan
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSwitchToGuest}
                className="w-full py-2.5 rounded-2xl border border-line hover:border-subtle bg-surface hover:bg-soft text-ink font-medium text-xs transition-colors text-center"
              >
                Switch to Guest Demo
              </button>
            )}
          </div>
        </div>

        {/* Tier 2: Premium ($1.99/mo) - Highlighted */}
        <div className="rounded-3xl border-2 border-amber-500/80 bg-surface p-7 sm:p-8 flex flex-col justify-between shadow-lg relative overflow-hidden">
          {/* Popular Tag */}
          <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-widest flex items-center gap-1 shadow-xs">
            <Sparkles className="w-3 h-3" />
            Most Popular
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Premium Protection
              </span>
              <Crown className="w-4 h-4 text-amber-500" />
            </div>

            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-ink">$1.99</span>
              <span className="text-xs text-muted">/ month</span>
            </div>

            <p className="mt-3 text-xs text-muted leading-relaxed">
              More message checks and increased screenshot limits for active online shoppers, investors, and families.
            </p>

            <div className="mt-6 pt-6 border-t border-line space-y-3.5 text-xs">
              <div className="font-semibold text-ink text-[11px] uppercase tracking-wider flex items-center justify-between">
                <span>Everything in Free, plus:</span>
                <span className="text-amber-600 font-bold text-[10px]">UNLIMITED ACCESS</span>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <span>
                  <strong className="text-ink">Unlimited Screenshot checks</strong> (no daily cap)
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <span>
                  <strong className="text-ink">Unlimited suspicious message</strong> & URL checks
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <span>Deep Multimodal Gemini AI threat breakdown</span>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <span>Real-time mule network & syndicate correlation</span>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <span>Official PDF evidence export for banks & police</span>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <span>Priority clue verification in community database</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-line">
            {isPremium ? (
              <div className="w-full py-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-semibold text-xs flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                Active Subscription (Demo)
              </div>
            ) : (
              <button
                type="button"
                onClick={handleActivatePremium}
                className="w-full py-2.5 rounded-2xl bg-ink text-surface font-semibold text-xs hover:bg-subtle transition-all shadow-sm flex items-center justify-center gap-2 group"
              >
                <span>Upgrade to Premium — $1.99/mo</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
              </button>
            )}
          </div>
        </div>

        {/* Tier 3: Enterprise API */}
        <div className="rounded-3xl border border-line bg-surface p-7 sm:p-8 flex flex-col justify-between shadow-xs hover:border-subtle transition-all">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted">
                Enterprise API
              </span>
              <span className="px-2 py-0.5 rounded-full bg-soft text-muted border border-line text-[11px] font-semibold">
                For Developers & Banks
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-ink">Custom</span>
              <span className="text-xs text-muted">/ starting $99/mo</span>
            </div>

            <p className="mt-3 text-xs text-muted leading-relaxed">
              Embed ScamLens detection directly into your banking app, payment gateway, e-commerce checkout, or CRM.
            </p>

            <div className="mt-6 pt-6 border-t border-line space-y-3.5 text-xs">
              <div className="font-semibold text-ink text-[11px] uppercase tracking-wider">
                Enterprise Capabilities:
              </div>

              <div className="flex items-start gap-2.5">
                <Code2 className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                <span>
                  <strong className="text-ink">REST & Webhook API</strong> with 99.9% uptime SLA
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <Code2 className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                <span>Bulk account verification (10,000+ checks/min)</span>
              </div>

              <div className="flex items-start gap-2.5">
                <Code2 className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                <span>Live webhook sync for new blacklisted mule accounts</span>
              </div>

              <div className="flex items-start gap-2.5">
                <Code2 className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                <span>Custom risk scoring thresholds & compliance rules</span>
              </div>

              <div className="flex items-start gap-2.5">
                <Code2 className="w-4 h-4 text-ink shrink-0 mt-0.5" />
                <span>Dedicated solution engineer & Slack/Teams channel</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-line">
            <button
              type="button"
              onClick={() => setIsApiModalOpen(true)}
              className="w-full py-2.5 rounded-2xl border border-line hover:border-ink bg-surface hover:bg-soft text-ink font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Terminal className="w-3.5 h-3.5 text-muted" />
              <span>Get API Key & Docs</span>
            </button>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
            Compare plans & capabilities
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-muted">
            Detailed breakdown of what comes with Free, Premium ($1.99/mo), and Enterprise API.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-line text-muted">
                <th className="py-3 pr-4 font-semibold">Features</th>
                <th className="py-3 px-4 font-semibold text-center">Guest (Free)</th>
                <th className="py-3 px-4 font-semibold text-center text-amber-700 dark:text-amber-300">
                  Premium ($1.99/mo)
                </th>
                <th className="py-3 pl-4 font-semibold text-center">Enterprise API</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-ink">
              <tr>
                <td className="py-3 pr-4 font-medium">Daily Screenshot Checks</td>
                <td className="py-3 px-4 text-center text-muted">3 / day</td>
                <td className="py-3 px-4 text-center font-bold text-emerald-600">Unlimited</td>
                <td className="py-3 pl-4 text-center font-bold text-emerald-600">Unlimited</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium">Message & Link Scanning</td>
                <td className="py-3 px-4 text-center text-muted">Standard</td>
                <td className="py-3 px-4 text-center font-bold text-emerald-600">Unlimited Deep Scan</td>
                <td className="py-3 pl-4 text-center font-bold text-emerald-600">High-Throughput API</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium">Account Blacklist Database</td>
                <td className="py-3 px-4 text-center text-muted">Web Search</td>
                <td className="py-3 px-4 text-center font-bold text-emerald-600">Priority Search & Clues</td>
                <td className="py-3 pl-4 text-center font-bold text-emerald-600">Automated Webhooks</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium">AI Threat Engine</td>
                <td className="py-3 px-4 text-center text-muted">Heuristic + Gemini</td>
                <td className="py-3 px-4 text-center font-bold text-emerald-600">Gemini 2.5 Flash Vision</td>
                <td className="py-3 pl-4 text-center font-bold text-emerald-600">Custom Fine-Tuned Models</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium">Bank & Police Evidence PDF</td>
                <td className="py-3 px-4 text-center text-muted">—</td>
                <td className="py-3 px-4 text-center font-bold text-emerald-600">1-Click Export</td>
                <td className="py-3 pl-4 text-center font-bold text-emerald-600">JSON/PDF Webhooks</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium">Integration API Keys</td>
                <td className="py-3 px-4 text-center text-muted">—</td>
                <td className="py-3 px-4 text-center text-muted">—</td>
                <td className="py-3 pl-4 text-center font-bold text-emerald-600">Included</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium">Technical Support</td>
                <td className="py-3 px-4 text-center text-muted">Community</td>
                <td className="py-3 px-4 text-center font-semibold">Priority Email</td>
                <td className="py-3 pl-4 text-center font-bold text-emerald-600">24/7 Dedicated SLA</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-3xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-ink">Frequently Asked Questions</h2>
          <p className="mt-1 text-xs text-muted">Got questions about ScamLens plans or enterprise access?</p>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-line bg-surface p-5 text-xs space-y-2">
            <h3 className="font-semibold text-ink text-sm">
              How does the 3 screenshots/day limit work for guest users?
            </h3>
            <p className="text-muted leading-relaxed">
              Guest users receive 3 free image scans every 24 hours. The counter automatically resets at midnight.
              Upgrading to Premium ($1.99/mo) removes all daily limits so you can verify as many suspicious chats and payment slips as you need.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-5 text-xs space-y-2">
            <h3 className="font-semibold text-ink text-sm">
              Can I cancel my $1.99/mo Premium subscription at any time?
            </h3>
            <p className="text-muted leading-relaxed">
              Yes, there are zero lock-in contracts or hidden cancellation fees. You can cancel with a single click at any time from your account settings.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-5 text-xs space-y-2">
            <h3 className="font-semibold text-ink text-sm">
              How do banks and platforms use the Enterprise API?
            </h3>
            <p className="text-muted leading-relaxed">
              Our API allows financial institutions and marketplace applications to check recipient bank accounts and payment request notes in real-time before processing wire transfers, reducing fraud losses by up to 88%.
            </p>
          </div>
        </div>
      </section>

      {/* Enterprise API Request Modal */}
      {isApiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs animate-rise">
          <div className="w-full max-w-lg rounded-3xl border border-line bg-surface p-6 sm:p-7 shadow-2xl relative space-y-5">
            <button
              type="button"
              onClick={() => {
                setIsApiModalOpen(false);
                setApiSubmitted(false);
              }}
              className="absolute top-5 right-5 p-1 rounded-full text-muted hover:text-ink hover:bg-soft transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-soft border border-line flex items-center justify-center text-ink">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-ink">ScamLens Enterprise API</h3>
                <p className="text-xs text-muted">Test the REST endpoint or request high-throughput access</p>
              </div>
            </div>

            {/* Sample cURL snippet */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-muted text-[11px] uppercase tracking-wider">
                  Sample REST API Request
                </span>
                <button
                  type="button"
                  onClick={copyCurl}
                  className="inline-flex items-center gap-1 text-[11px] text-ink font-medium hover:underline"
                >
                  {copiedCurl ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy curl</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-3.5 rounded-2xl bg-canvas border border-line text-[11px] font-mono text-ink/90 overflow-x-auto leading-relaxed">
                {sampleCurl}
              </pre>
            </div>

            {/* Quick Request Form */}
            {!apiSubmitted ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setApiSubmitted(true);
                }}
                className="space-y-3 pt-2 border-t border-line"
              >
                <div className="text-xs font-semibold text-ink">
                  Request Developer Sandbox & Custom Pricing
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-muted mb-1">
                      Work Email
                    </label>
                    <input
                      type="email"
                      required
                      value={enterpriseEmail}
                      onChange={(e) => setEnterpriseEmail(e.target.value)}
                      placeholder="alex@fintech-bank.com"
                      className="w-full px-3 py-2 rounded-xl border border-line text-xs bg-canvas focus:outline-hidden focus:border-subtle"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-muted mb-1">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      required
                      value={enterpriseCompany}
                      onChange={(e) => setEnterpriseCompany(e.target.value)}
                      placeholder="Acme Pay Ltd."
                      className="w-full px-3 py-2 rounded-xl border border-line text-xs bg-canvas focus:outline-hidden focus:border-subtle"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-2.5 rounded-xl bg-ink text-surface font-semibold text-xs hover:bg-subtle transition-colors"
                >
                  Request Production API Access
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-semibold">Inquiry submitted successfully!</p>
                  <p className="text-[11px] mt-0.5 opacity-90">
                    We sent sandbox credentials and documentation to {enterpriseEmail}.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
