"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Image as ImageIcon, MessageSquareText, History, BookOpen } from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Screenshot", icon: ImageIcon },
  { href: "/check", label: "Text & link", icon: MessageSquareText },
  { href: "/history", label: "History", icon: History },
  { href: "/guide", label: "Safety guide", icon: BookOpen },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 bg-canvas/85 backdrop-blur-md border-b border-line">
      <div className="mx-auto max-w-5xl px-5 h-16 flex items-center justify-between gap-4">
        <Logo />
        <nav aria-label="Main" className="hidden sm:flex items-center gap-1">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "px-3.5 py-2 rounded-lg text-sm font-medium transition-colors",
                  active ? "bg-soft text-ink" : "text-muted hover:text-ink hover:bg-soft",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile: always-visible tab row (no hidden menus — easier for all ages) */}
      <nav aria-label="Main mobile" className="sm:hidden border-t border-line">
        <div className="grid grid-cols-4">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                  active ? "text-ink" : "text-muted",
                )}
              >
                <Icon className="w-4.5 h-4.5" strokeWidth={active ? 2.2 : 1.8} />
                {l.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
