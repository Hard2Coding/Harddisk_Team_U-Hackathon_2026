import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line mt-20">
      <div className="mx-auto max-w-5xl px-5 py-8 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-sm text-muted">
        <p>ScamLens helps you spot warning signs. AI can make mistakes — always verify through official channels.</p>
        <div className="flex gap-5 shrink-0">
          <Link href="/guide#how-it-works" className="hover:text-ink transition-colors">How it works</Link>
          <Link href="/guide#privacy" className="hover:text-ink transition-colors">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
