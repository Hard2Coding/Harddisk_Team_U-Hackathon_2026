"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShieldAlert,
  Search,
  History,
  Network,
  Flag,
  HelpCircle,
  Settings,
  ShieldCheck,
  User,
  LogOut,
  BellRing,
} from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";

export function Sidebar() {
  const pathname = usePathname();
  const { user, isGuest, logout } = useAuth();
  const { t } = useTheme();

  const navItems = [
    { href: "/", label: t("home"), icon: Home },
    { href: "/analyze", label: t("check"), icon: Search, badge: "New" },
    { href: "/history", label: t("history"), icon: History },
    { href: "/alerts", label: t("alerts"), icon: BellRing, badgeCount: 3 },
    { href: "/graph", label: t("graph"), icon: Network },
    { href: "/reports", label: t("reports"), icon: Flag },
    { href: "/help", label: t("help"), icon: HelpCircle },
    { href: "/settings", label: t("settings"), icon: Settings },
  ];

  if (user?.role === "admin") {
    navItems.push({ href: "/admin", label: t("admin"), icon: ShieldCheck, badge: "Admin" });
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#10203A]/70 backdrop-blur-md sticky top-0 h-screen z-30 shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-200/80 dark:border-slate-800/80">
        <BrandMark size="md" />
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/20 font-semibold"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? "text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-blue-500"
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isActive ? "bg-white/20 text-white" : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                }`}>
                  {item.badge}
                </span>
              )}
              {item.badgeCount && !isActive && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
                  {item.badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Status / Profile Footer */}
      <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user ? user.name?.charAt(0) || user.email.charAt(0).toUpperCase() : "G"}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {user ? user.name || user.email : t("guestMode")}
              </div>
              <div className="text-[10px] text-slate-500 capitalize flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${user ? "bg-emerald-500" : "bg-amber-500"}`} />
                {user?.role || "Guest"}
              </div>
            </div>
          </div>
          {user ? (
            <button
              onClick={logout}
              title={t("logout")}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <Link
              href="/login"
              className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              {t("login")}
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
