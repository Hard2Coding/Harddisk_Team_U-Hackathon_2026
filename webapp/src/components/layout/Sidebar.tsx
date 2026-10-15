"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  History,
  Network,
  Flag,
  HelpCircle,
  Settings,
  ShieldCheck,
  LogOut,
  BellRing,
} from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";
import { useAuth } from "@/lib/auth";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/analyze", label: "Scan & Check", icon: Search, badge: "New" },
    { href: "/history", label: "History", icon: History },
    { href: "/alerts", label: "Threat Alerts", icon: BellRing, badgeCount: 3 },
    { href: "/graph", label: "Entity Graph", icon: Network },
    { href: "/reports", label: "Report a Scam", icon: Flag },
    { href: "/help", label: "Help Center", icon: HelpCircle },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  if (user?.role === "admin") {
    navItems.push({ href: "/admin", label: "Admin Console", icon: ShieldCheck, badge: "Admin" });
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 bg-white dark:bg-[#10203A] dark:border-slate-800 sticky top-0 h-screen z-30 shrink-0 transition-colors">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <BrandMark size="md" />
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-150 group ${
                isActive
                  ? "bg-blue-600 text-white shadow-xs font-bold"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform duration-150 group-hover:scale-105 ${
                    isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isActive ? "bg-white/20 text-white" : "bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
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
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
              {user ? user.name?.charAt(0) || user.email.charAt(0).toUpperCase() : "G"}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user ? user.name || user.email : "Guest User"}
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
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <Link
              href="/login"
              className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
