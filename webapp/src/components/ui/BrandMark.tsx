"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

interface BrandMarkProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function BrandMark({ size = "md", showText = true, className = "" }: BrandMarkProps) {
  const sizeMap = {
    sm: { img: 32, text: "text-base", sub: "text-[9px]" },
    md: { img: 40, text: "text-lg", sub: "text-[10px]" },
    lg: { img: 56, text: "text-2xl", sub: "text-xs" },
  };

  const dim = sizeMap[size];

  return (
    <Link href="/" className={`inline-flex items-center gap-3 group ${className}`}>
      <div className="relative shrink-0 rounded-xl overflow-hidden p-0.5 bg-linear-to-tr from-blue-600 via-purple-600 to-cyan-400 shadow-md group-hover:shadow-blue-500/25 transition-all duration-300">
        <div className="rounded-[10px] overflow-hidden bg-slate-950 flex items-center justify-center">
          <Image
            src="/brand-logo.png"
            alt="ScamGraph AI Logo"
            width={dim.img}
            height={dim.img}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
          />
        </div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-black tracking-tight text-slate-900 dark:text-white ${dim.text} leading-none flex items-center gap-1.5`}>
            ScamGraph <span className="text-gradient">AI</span>
          </span>
          <span className={`font-medium text-slate-500 dark:text-slate-400 ${dim.sub} tracking-wider uppercase mt-0.5`}>
            Risk Intelligence
          </span>
        </div>
      )}
    </Link>
  );
}
