"use client";
import React from "react";
import Link from "next/link";
import { Sun, Moon, Sparkles } from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, loginAsDemoUser, loginAsDemoAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-20 w-full border-b border-slate-200 bg-white/90 dark:bg-[#071326]/90 dark:border-slate-800 backdrop-blur-md transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Brand Mark / Status */}
        <div className="flex items-center gap-3">
          <div className="lg:hidden">
            <BrandMark size="sm" showText={true} />
          </div>
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-semibold border border-emerald-200/80 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              AI Inference Ready
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="font-medium text-slate-500">Zero-Trust Input Engine</span>
          </div>
        </div>

        {/* Right: Demo Quick Toggles & Theme Switch */}
        <div className="flex items-center gap-2.5">
          {/* Quick Demo Switcher */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl text-xs">
            <button
              onClick={loginAsDemoUser}
              className={`px-3 py-1.5 rounded-xl text-xs transition-all ${
                user?.role === "user"
                  ? "bg-white dark:bg-slate-700 shadow-2xs font-bold text-blue-600 dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
              }`}
            >
              Demo User
            </button>
            <button
              onClick={loginAsDemoAdmin}
              className={`px-3 py-1.5 rounded-xl text-xs transition-all ${
                user?.role === "admin"
                  ? "bg-white dark:bg-slate-700 shadow-2xs font-bold text-purple-600 dark:text-purple-400"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
              }`}
            >
              Demo Admin
            </button>
          </div>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200 shadow-2xs"
            title="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* New Scan Button */}
          <Link
            href="/analyze"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Scan Now</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
