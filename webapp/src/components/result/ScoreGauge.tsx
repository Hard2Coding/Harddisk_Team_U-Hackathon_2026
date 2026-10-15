"use client";
import React, { useEffect, useState } from "react";
import { RiskLevel } from "@/types/api";
import { AlertTriangle, CheckCircle, ShieldAlert, HelpCircle } from "lucide-react";

interface ScoreGaugeProps {
  score: number | null;
  level: RiskLevel;
}

export function ScoreGauge({ score, level }: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (score !== null) {
      const target = Math.min(Math.max(score, 0), 100);
      const timer = setTimeout(() => setAnimatedScore(target), 100);
      return () => clearTimeout(timer);
    }
  }, [score]);

  const radius = 45;
  const circumference = 2 * Math.PI * radius; // ~282.74
  const strokeDashoffset =
    score !== null ? circumference - (circumference * animatedScore) / 100 : circumference;

  const levelStyles: Record<
    RiskLevel,
    {
      text: string;
      bg: string;
      border: string;
      label: string;
      icon: any;
      colorHex: string;
      title: string;
    }
  > = {
    HIGH: {
      text: "text-red-600 dark:text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      label: "เสี่ยงสูง / HIGH RISK",
      icon: ShieldAlert,
      colorHex: "#EF4444",
      title: "พบสัญญาณความเสี่ยงสูง ควรหยุดและตรวจสอบกับช่องทางทางการทันที",
    },
    MEDIUM: {
      text: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      label: "ควรระวัง / CAUTION",
      icon: AlertTriangle,
      colorHex: "#F59E0B",
      title: "พบสัญญาณที่ควรตรวจสอบเพิ่มเติมก่อนดำเนินการ",
    },
    LOW: {
      text: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      label: "ความเสี่ยงต่ำ / LOW RISK",
      icon: CheckCircle,
      colorHex: "#10B981",
      title: "พบสัญญาณความเสี่ยงจากข้อมูลนี้น้อย แต่ไม่ได้ยืนยันว่าปลอดภัย 100%",
    },
    "INSUFFICIENT DATA": {
      text: "text-slate-500",
      bg: "bg-slate-500/10",
      border: "border-slate-500/30",
      label: "ข้อมูลไม่เพียงพอ / INSUFFICIENT DATA",
      icon: HelpCircle,
      colorHex: "#64748B",
      title: "ข้อมูลที่ระบุไม่เพียงพอสำหรับการประเมินระดับความเสี่ยง",
    },
  };

  const style = levelStyles[level] || levelStyles["INSUFFICIENT DATA"];
  const LevelIcon = style.icon;

  return (
    <div
      className={`p-6 sm:p-8 rounded-3xl border ${style.border} ${style.bg} relative overflow-hidden transition-all duration-300 shadow-sm`}
    >
      <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
        {/* Radial SVG Gauge */}
        <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="stroke-slate-200/80 dark:stroke-slate-800 fill-none"
              strokeWidth="9"
            />
            {/* Animated Risk Arc */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke={style.colorHex}
              className="fill-none transition-all duration-1000 ease-out"
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className={`text-4xl sm:text-5xl font-black tracking-tight ${style.text}`}>
              {score !== null ? Math.round(animatedScore) : "—"}
            </span>
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mt-0.5">
              Risk Score / 100
            </span>
          </div>
        </div>

        {/* Level Details */}
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold rounded-full border ${style.bg} ${style.border} ${style.text}`}
            >
              <LevelIcon className="w-3.5 h-3.5" />
              <span>{style.label}</span>
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Deterministic Fusion Policy v2
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
            {style.title}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
            * คะแนนความเสี่ยงเป็นดัชนีชี้วัดตามหลักฐานที่ตรวจพบ (Evidence-grounded Risk Indicator) ไม่ใช่คำตัดสินทางกฎหมาย และการไม่มีประวัติไม่ได้แปลว่าปลอดภัยเสมอไป
          </p>
        </div>
      </div>
    </div>
  );
}
