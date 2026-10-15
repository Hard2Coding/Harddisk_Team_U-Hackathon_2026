import type { Metadata } from "next";
import Link from "next/link";
import {
  KeyRound,
  Timer,
  Link2,
  Gift,
  BadgeAlert,
  Banknote,
  PhoneOff,
  Ban,
  Flag,
  Building2,
  Upload,
  ScanSearch,
  ListChecks,
  Lock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Safety guide — ScamLens",
  description: "Common scam warning signs, what to do if you were targeted, and how ScamLens works.",
};

const SIGNS = [
  { icon: KeyRound, title: "Asks for codes or passwords", text: "No real bank or company will ask for your OTP, PIN, or password by message." },
  { icon: Timer, title: "Rushes you", text: "“Today only”, “account suspended”, “final notice” — pressure is a classic trick." },
  { icon: Link2, title: "Strange links", text: "Misspelled names, odd endings like .xyz or .top, or shortened links you can’t read." },
  { icon: Gift, title: "Too good to be true", text: "Prizes you never entered, easy loans, or guaranteed profits." },
  { icon: BadgeAlert, title: "Pretends to be official", text: "Police, customs, tax office, couriers, or your bank — contacting you first." },
  { icon: Banknote, title: "Unusual payment", text: "Asks you to transfer to a personal account, buy gift cards, or pay in crypto." },
];

const STEPS = [
  { icon: Ban, title: "Stop", text: "Don’t reply, click, or send money. Hang up if it’s a call." },
  { icon: PhoneOff, title: "Secure your accounts", text: "If you shared a code or password, change it now and call your bank using the number on your card." },
  { icon: Building2, title: "Verify independently", text: "Contact the organization through its official app or website — not the details in the message." },
  { icon: Flag, title: "Report it", text: "Report the sender in the app and to your local anti-scam hotline (Thailand: 1441)." },
];

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-4xl px-5">
      <section className="pt-14 sm:pt-20 pb-10">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Safety guide</h1>
        <p className="mt-3 text-muted max-w-xl leading-relaxed">
          Simple ways to spot a scam, and what to do if something feels wrong.
        </p>
      </section>

      <section aria-labelledby="signs-heading">
        <h2 id="signs-heading" className="text-lg font-semibold">Common warning signs</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {SIGNS.map((s) => (
            <li key={s.title} className="flex gap-4 rounded-2xl border border-line bg-surface p-5">
              <span className="grid place-items-center w-10 h-10 rounded-lg bg-soft shrink-0">
                <s.icon className="w-4.5 h-4.5" strokeWidth={1.8} />
              </span>
              <div>
                <p className="font-medium">{s.title}</p>
                <p className="mt-1 text-sm text-muted leading-relaxed">{s.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="todo-heading" className="mt-14">
        <h2 id="todo-heading" className="text-lg font-semibold">If you think you’ve been targeted</h2>
        <ol className="mt-4 rounded-2xl border border-line bg-surface divide-y divide-line">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-4 p-5">
              <span className="grid place-items-center w-8 h-8 rounded-full bg-ink text-white text-sm font-medium shrink-0">
                {i + 1}
              </span>
              <div>
                <p className="font-medium flex items-center gap-2">
                  <s.icon className="w-4 h-4 text-muted" /> {s.title}
                </p>
                <p className="mt-1 text-sm text-muted leading-relaxed">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="how-it-works" aria-labelledby="how-heading" className="mt-14 scroll-mt-24">
        <h2 id="how-heading" className="text-lg font-semibold">How ScamLens works</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { icon: Upload, title: "You upload", text: "A screenshot, message, or link you’re unsure about." },
            { icon: ScanSearch, title: "We look for signs", text: "AI reads the content and points out common scam patterns with evidence." },
            { icon: ListChecks, title: "You decide", text: "You get clear next steps. You stay in control." },
          ].map((s) => (
            <div key={s.title} className="rounded-2xl border border-line bg-surface p-5">
              <s.icon className="w-5 h-5" strokeWidth={1.8} />
              <p className="mt-3 font-medium">{s.title}</p>
              <p className="mt-1 text-sm text-muted leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted leading-relaxed">
          ScamLens can’t confirm who sent a message and can make mistakes. A “Low risk” result never means a message is
          guaranteed safe.
        </p>
      </section>

      <section id="privacy" aria-labelledby="privacy-heading" className="mt-14 scroll-mt-24">
        <div className="flex gap-4 rounded-2xl border border-line bg-soft p-5 sm:p-6">
          <Lock className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h2 id="privacy-heading" className="font-semibold">Your privacy</h2>
            <ul className="mt-2 space-y-1 text-sm text-muted leading-relaxed list-disc pl-5">
              <li>Screenshots are analyzed and then discarded — we don’t store them.</li>
              <li>History is saved only in your browser, and you can clear it any time.</li>
              <li>Please hide names, account numbers, and codes before uploading.</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="mt-14 text-center">
        <Link href="/" className="inline-flex items-center h-12 px-6 rounded-xl bg-ink text-white font-medium hover:bg-ink/90">
          Check a screenshot
        </Link>
      </div>
    </div>
  );
}
