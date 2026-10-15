import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5 rounded-lg" aria-label="ScamLens home">
      <span className="grid place-items-center w-8 h-8 rounded-lg bg-ink text-white">
        <ShieldCheck className="w-4.5 h-4.5" strokeWidth={2.2} />
      </span>
      <span className="text-[17px] font-semibold tracking-tight">ScamLens</span>
    </Link>
  );
}
