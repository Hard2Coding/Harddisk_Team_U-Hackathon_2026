"use client";
import React from "react";
import Link from "next/link";
import { Sun, Moon, Globe, Shield, Wifi, WifiOff, Sparkles, UserCircle } from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth";

export function Header() {
  const { theme, toggleTheme, language, setLanguage, t } = useTheme();
  const { user, loginAsDemoUser, loginAsDemoAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-20 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-[#071326]/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Brand Mark / Breadcrumb */}
        <div className="flex items-center gap-3">
          <div className="lg:hidden">
            <BrandMark size="sm" showText={true} />
          </div>
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              API Ready (v2)
            </span>
            <span>•</span>
            <span className="hidden sm:inline">Zero-Trust Input Engine</span>
          </div>
        </div>

        {/* Right: Actions, Language, Theme, Demo Shortcuts */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Demo Switcher (Helpful for Hackathon testing!) */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs">
            <button
              onClick={loginAsDemoUser}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                user?.role === "user"
                  ? "bg-white dark:bg-slate-700 shadow-xs font-bold text-blue-600 dark:text-blue-400"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Demo User
            </button>
            <button
              onClick={loginAsDemoAdmin}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                user?.role === "admin"
                  ? "bg-white dark:bg-slate-700 shadow-xs font-bold text-purple-600 dark:text-purple-400"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Demo Admin
            </button>
          </div>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === "th" ? "en" : "th")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-xs font-medium transition-colors text-slate-700 dark:text-slate-200"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-blue-500" />
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-slate-700 dark:text-slate-200"
            title="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* Scan Shortcut Button */}
          <Link
            href="/analyze"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-sm shadow-blue-500/25 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t("check")}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
