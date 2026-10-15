"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  History,
  BellRing,
  Menu,
  X,
  Network,
  Flag,
  HelpCircle,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [showMore, setShowMore] = useState(false);

  const mainTabs = [
    { href: "/", label: "Home", icon: Home },
    { href: "/analyze", label: "Scan", icon: Search, primary: true },
    { href: "/history", label: "History", icon: History },
    { href: "/alerts", label: "Alerts", icon: BellRing },
  ];

  const moreLinks = [
    { href: "/graph", label: "Entity Graph", icon: Network },
    { href: "/reports", label: "Report a Scam", icon: Flag },
    { href: "/help", label: "Help Center", icon: HelpCircle },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  if (user?.role === "admin") {
    moreLinks.push({ href: "/admin", label: "Admin Console", icon: ShieldCheck });
  }

  return (
    <>
      {/* Mobile Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-white/95 dark:bg-[#10203A]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-around px-2 pb-safe shadow-lg">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          if (tab.primary) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="relative -top-3 flex flex-col items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white shadow-md shadow-blue-500/30 transform active:scale-95 transition-transform"
              >
                <Icon className="w-5 h-5" />
              </Link>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-semibold transition-colors ${
                isActive
                  ? "text-blue-600 dark:text-blue-400 font-bold"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{tab.label}</span>
            </Link>
          );
        })}

        {/* More Drawer Button */}
        <button
          onClick={() => setShowMore(true)}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-semibold transition-colors ${
            showMore ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"
          }`}
        >
          <Menu className="w-4 h-4 mb-0.5" />
          <span>More</span>
        </button>
      </nav>

      {/* Slide-Up Drawer */}
      {showMore && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-white dark:bg-[#10203A] rounded-t-3xl p-6 border-t border-slate-200 dark:border-slate-800 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-200 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Additional Tools</h3>
              <button
                onClick={() => setShowMore(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 py-4">
              {moreLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setShowMore(false)}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
                      isActive
                        ? "bg-blue-50 border-blue-200 text-blue-600 font-bold dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300"
                        : "border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-semibold">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
