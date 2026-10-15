"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Crown,
  Sparkles,
  ChevronDown,
  Check,
  ArrowRight,
} from "lucide-react";
import { useUserProfile, setUserTier } from "@/lib/userProfile";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

export function UserProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const profile = useUserProfile();

  const isPremium = profile.tier === "premium";

  // Close dropdown on outside click or Esc
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="User account menu"
        className={cn(
          "flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-full border text-xs font-medium transition-all shadow-2xs select-none",
          isPremium
            ? "bg-amber-500/10 border-amber-500/30 text-amber-700 hover:bg-amber-500/15 dark:text-amber-300 dark:border-amber-400/30"
            : "bg-surface border-line text-ink hover:bg-soft hover:border-subtle"
        )}
      >
        <div
          className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white font-semibold text-[11px]",
            isPremium
              ? "bg-gradient-to-tr from-amber-500 to-orange-400 shadow-xs"
              : "bg-subtle/80 text-surface"
          )}
        >
          {isPremium ? <Crown className="w-3.5 h-3.5 text-white" /> : <User className="w-3.5 h-3.5 text-white" />}
        </div>
        <span className="font-semibold hidden sm:inline-block max-w-[90px] truncate">
          {isPremium ? "Premium" : "Guest"}
        </span>
        <span
          className={cn(
            "px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider hidden md:inline-block",
            isPremium
              ? "bg-amber-500/20 text-amber-800 dark:text-amber-200"
              : "bg-soft text-muted border border-line"
          )}
        >
          {isPremium ? "Demo PRO" : "Free"}
        </span>
        <ChevronDown className={cn("w-3.5 h-3.5 text-muted transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {/* Floating Menu Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl border border-line bg-surface p-4 shadow-xl z-50 animate-rise">
          {/* User Header */}
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-line">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs",
                  isPremium
                    ? "bg-gradient-to-tr from-amber-500 to-orange-400"
                    : "bg-subtle/80"
                )}
              >
                {isPremium ? <Crown className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold truncate text-ink">{profile.name}</p>
                </div>
                <p className="text-xs text-muted truncate">{profile.email}</p>
              </div>
            </div>

            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide shrink-0",
                isPremium
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/40"
                  : "bg-soft text-muted border border-line"
              )}
            >
              {isPremium ? "$1.99/mo" : "Free"}
            </span>
          </div>

          {/* Usage Status */}
          <div className="py-3 border-b border-line space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted font-medium">Daily Screenshot Checks</span>
              <span className="font-semibold text-ink">
                {isPremium ? (
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <Sparkles className="w-3.5 h-3.5" /> Unlimited
                  </span>
                ) : (
                  `${profile.checksUsedToday} / ${profile.dailyScreenshotLimit} used`
                )}
              </span>
            </div>

            {!isPremium ? (
              <div className="space-y-1.5">
                <div className="h-1.5 w-full bg-soft rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-300",
                      profile.checksUsedToday >= profile.dailyScreenshotLimit
                        ? "bg-rose-500"
                        : "bg-ink"
                    )}
                    style={{
                      width: `${Math.min(100, (profile.checksUsedToday / profile.dailyScreenshotLimit) * 100)}%`,
                    }}
                  />
                </div>
                <p className="text-[11px] text-muted">
                  Guests get 3 checks per day. Resets at midnight.
                </p>
              </div>
            ) : (
              <p className="text-[11px] text-muted flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Gemini Vision scanning & deep text analysis unlocked
              </p>
            )}
          </div>

          {/* Interactive Tier Swap */}
          <div className="pt-3 pb-1 space-y-2">
            <div className="text-[11px] font-semibold text-subtle uppercase tracking-wider px-1">
              Account Mode Switcher
            </div>

            <div className="grid grid-cols-2 gap-1.5 p-1 bg-soft rounded-xl border border-line">
              <button
                type="button"
                onClick={() => {
                  if (isPremium) setUserTier("guest");
                }}
                className={cn(
                  "py-1.5 px-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5",
                  !isPremium
                    ? "bg-surface shadow-xs font-semibold text-ink"
                    : "text-muted hover:text-ink"
                )}
              >
                {!isPremium && <Check className="w-3 h-3 text-ink" />}
                Guest (Free)
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!isPremium) {
                    setUserTier("premium");
                    try {
                      confetti({
                        particleCount: 60,
                        spread: 50,
                        origin: { y: 0.2, x: 0.8 },
                      });
                    } catch {}
                  }
                }}
                className={cn(
                  "py-1.5 px-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5",
                  isPremium
                    ? "bg-surface shadow-xs font-semibold text-amber-700 dark:text-amber-300"
                    : "text-muted hover:text-ink"
                )}
              >
                {isPremium && <Crown className="w-3 h-3 text-amber-600" />}
                Demo (Premium)
              </button>
            </div>

            {/* Quick Action Link to Pricing */}
            <Link
              href="/pricing"
              onClick={() => setIsOpen(false)}
              className="mt-2 flex items-center justify-between px-3 py-2.5 rounded-xl border border-line hover:border-subtle bg-soft/60 hover:bg-soft transition-colors text-xs font-medium text-ink group"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>View All Pricing Plans</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
