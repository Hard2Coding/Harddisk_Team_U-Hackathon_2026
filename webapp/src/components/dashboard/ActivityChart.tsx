"use client";
import React, { useState } from "react";
import { BarChart3, TrendingUp, AlertTriangle } from "lucide-react";

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

  // Generate last 7 days mockup data
  const days: ActivityDay[] = [
    { dayName: "จันทร์", dateStr: "10 ต.ค.", high: 4, medium: 6, low: 12, total: 22 },
    { dayName: "อังคาร", dateStr: "11 ต.ค.", high: 8, medium: 9, low: 15, total: 32 },
    { dayName: "พุธ", dateStr: "12 ต.ค.", high: 3, medium: 7, low: 18, total: 28 },
    { dayName: "พฤหัส", dateStr: "13 ต.ค.", high: 11, medium: 12, low: 14, total: 37 },
    { dayName: "ศุกร์", dateStr: "14 ต.ค.", high: 14, medium: 8, low: 20, total: 42 },
    { dayName: "เสาร์", dateStr: "15 ต.ค.", high: 9, medium: 15, low: 22, total: 46 },
    { dayName: "วันนี้", dateStr: "16 ต.ค.", high: 7, medium: 11, low: 25, total: 43 },
  ];

  const maxTotal = Math.max(...days.map((d) => d.total));
  const activeDay = selectedDay || days[days.length - 1];

  return (
    <div className="bg-white dark:bg-[#10203A] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-500" />
            <span>สถิติการตรวจวิเคราะห์ความเสี่ยง 7 วันล่าสุด</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            คลิกที่แท่งกราฟของแต่ละวันเพื่อดูสัดส่วนความเสี่ยง (Interactive Day Breakdown)
          </p>
        </div>

        {/* Selected Day Stats Badge */}
        <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {activeDay.dayName} ({activeDay.dateStr}):
          </span>
          <span className="flex items-center gap-1 font-bold text-red-500">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            {activeDay.high} สูง
          </span>
          <span className="flex items-center gap-1 font-bold text-amber-500">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            {activeDay.medium} กลาง
          </span>
          <span className="flex items-center gap-1 font-bold text-emerald-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {activeDay.low} ต่ำ
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
              <div className="w-full max-w-[42px] flex flex-col justify-end h-32 sm:h-40 rounded-t-xl overflow-hidden bg-slate-100 dark:bg-slate-900 transition-all duration-200 group-hover:scale-105">
                <div
                  className={`w-full rounded-t-xl flex flex-col justify-end transition-all duration-300 ${
                    isSelected ? "ring-2 ring-blue-500" : ""
                  }`}
                  style={{ height: `${heightPercent}%` }}
                >
                  {/* High risk portion */}
                  <div
                    style={{ height: `${highRatio}%` }}
                    className="bg-red-500 transition-all"
                    title={`High Risk: ${d.high}`}
                  />
                  {/* Medium risk portion */}
                  <div
                    style={{ height: `${medRatio}%` }}
                    className="bg-amber-500 transition-all"
                    title={`Medium Risk: ${d.medium}`}
                  />
                  {/* Low risk portion */}
                  <div
                    style={{ height: `${lowRatio}%` }}
                    className="bg-emerald-500 transition-all"
                    title={`Low Risk: ${d.low}`}
                  />
                </div>
              </div>
              <span
                className={`text-[11px] font-medium transition-colors ${
                  isSelected ? "font-bold text-blue-600 dark:text-blue-400" : "text-slate-500"
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
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-red-500" /> เสี่ยงสูง (High)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> ควรระวัง (Medium)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> ความเสี่ยงต่ำ (Low)
          </span>
        </div>
        <span className="text-[11px] text-slate-400">รวม 250 ครั้งในรอบสัปดาห์</span>
      </div>
    </div>
  );
}
