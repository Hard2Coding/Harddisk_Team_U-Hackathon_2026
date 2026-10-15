"use client";
import React, { useState } from "react";
import { BarChart3 } from "lucide-react";

interface ActivityDay {
  dayName: string;
  dateStr: string;
  high: number;
  medium: number;
  low: number;
  total: number;
}

export function ActivityChart() {
  const [selectedDay, setSelectedDay] = useState<ActivityDay | null>(null);

  const days: ActivityDay[] = [
    { dayName: "Mon", dateStr: "Oct 10", high: 4, medium: 6, low: 12, total: 22 },
    { dayName: "Tue", dateStr: "Oct 11", high: 8, medium: 9, low: 15, total: 32 },
    { dayName: "Wed", dateStr: "Oct 12", high: 3, medium: 7, low: 18, total: 28 },
    { dayName: "Thu", dateStr: "Oct 13", high: 11, medium: 12, low: 14, total: 37 },
    { dayName: "Fri", dateStr: "Oct 14", high: 14, medium: 8, low: 20, total: 42 },
    { dayName: "Sat", dateStr: "Oct 15", high: 9, medium: 15, low: 22, total: 46 },
    { dayName: "Today", dateStr: "Oct 16", high: 7, medium: 11, low: 25, total: 43 },
  ];

  const maxTotal = Math.max(...days.map((d) => d.total));
  const activeDay = selectedDay || days[days.length - 1];

  return (
    <div className="bg-white dark:bg-[#10203A] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span>Recent 7-Day Risk Activity Analytics</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Click on any day bar to view risk level distributions
          </p>
        </div>

        {/* Selected Day Stats Badge */}
        <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs">
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {activeDay.dayName} ({activeDay.dateStr}):
          </span>
          <span className="flex items-center gap-1 font-bold text-red-600">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            {activeDay.high} High
          </span>
          <span className="flex items-center gap-1 font-bold text-amber-600">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            {activeDay.medium} Medium
          </span>
          <span className="flex items-center gap-1 font-bold text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {activeDay.low} Low
          </span>
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div className="h-44 sm:h-52 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-2 border-b border-slate-100 dark:border-slate-800">
        {days.map((d, idx) => {
          const isSelected = activeDay.dateStr === d.dateStr;
          const heightPercent = (d.total / maxTotal) * 100;
          const highRatio = (d.high / d.total) * 100;
          const medRatio = (d.medium / d.total) * 100;
          const lowRatio = (d.low / d.total) * 100;

          return (
            <div
              key={idx}
              onClick={() => setSelectedDay(d)}
              className="flex-1 flex flex-col items-center gap-2 cursor-pointer group"
            >
              <div className="w-full max-w-[42px] flex flex-col justify-end h-32 sm:h-40 rounded-t-xl overflow-hidden bg-slate-100 dark:bg-slate-900 transition-all duration-150 group-hover:scale-105">
                <div
                  className={`w-full rounded-t-xl flex flex-col justify-end transition-all duration-300 ${
                    isSelected ? "ring-2 ring-blue-500" : ""
                  }`}
                  style={{ height: `${heightPercent}%` }}
                >
                  <div
                    style={{ height: `${highRatio}%` }}
                    className="bg-red-500 transition-all"
                    title={`High Risk: ${d.high}`}
                  />
                  <div
                    style={{ height: `${medRatio}%` }}
                    className="bg-amber-500 transition-all"
                    title={`Medium Risk: ${d.medium}`}
                  />
                  <div
                    style={{ height: `${lowRatio}%` }}
                    className="bg-emerald-500 transition-all"
                    title={`Low Risk: ${d.low}`}
                  />
                </div>
              </div>
              <span
                className={`text-[11px] font-semibold transition-colors ${
                  isSelected ? "text-blue-600 dark:text-blue-400 font-bold" : "text-slate-500"
                }`}
              >
                {d.dayName}
              </span>
            </div>
          );
        })}
      </div>

      {/* Chart Footer Indicator */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-sm bg-red-500" /> High Risk
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> Caution / Medium
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Low Risk
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">250 Total Scans Logged This Week</span>
      </div>
    </div>
  );
}
