"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Image as ImageIcon,
  MessageSquareText,
  History,
  BookOpen,
  Landmark,
  Sparkles,
} from "lucide-react";
import { Logo } from "./Logo";
import { UserProfileMenu } from "./UserProfileMenu";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Screenshot", icon: ImageIcon },
  { href: "/check", label: "Text & link", icon: MessageSquareText },
  { href: "/bank-check", label: "Account Checker", icon: Landmark },
  { href: "/history", label: "History", icon: History },
  { href: "/pricing", label: "Pricing", icon: Sparkles },
  { href: "/guide", label: "Safety guide", icon: BookOpen },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 bg-canvas/85 backdrop-blur-md border-b border-line">
      <div className="mx-auto max-w-5xl px-3 sm:px-5 h-16 flex items-center justify-between gap-2 sm:gap-4">
        <Logo />

        {/* Center / Desktop Links (visible on md screens and up) */}
        <nav aria-label="Main" className="hidden md:flex items-center gap-0.5 lg:gap-1">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            const isPricing = l.href === "/pricing";
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "px-2.5 py-1.5 lg:px-3 lg:py-2 rounded-lg text-xs lg:text-sm font-medium transition-colors whitespace-nowrap",
                  active
                    ? "bg-soft text-ink font-semibold"
                    : isPricing
                    ? "text-amber-700 hover:text-amber-800 dark:text-amber-300 hover:bg-amber-500/10 font-semibold"
                    : "text-muted hover:text-ink hover:bg-soft",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Header Pricing Button on smaller screens (< md) */}
          <Link
            href="/pricing"
            className={cn(
              "flex md:hidden items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold border transition-all",
              pathname === "/pricing"
                ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                : "bg-amber-500/10 text-amber-700 border-amber-500/30 hover:bg-amber-500/15 dark:text-amber-300"
            )}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Pricing</span>
          </Link>

          <UserProfileMenu />
        </div>
      </div>

      {/* Mobile: always-visible tab row (visible below md) */}
      <nav aria-label="Main mobile" className="md:hidden border-t border-line bg-canvas">
        <div className="grid grid-cols-6">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 text-[10px] font-medium transition-colors text-center px-0.5",
                  active ? "text-ink font-bold" : "text-muted",
                )}
              >
                <Icon className="w-4 h-4" strokeWidth={active ? 2.3 : 1.8} />
                <span className="truncate max-w-full">
                  {l.label === "Account Checker" ? "Accounts" : l.label === "Safety guide" ? "Guide" : l.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
