"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BrandMark } from "@/components/ui/BrandMark";
import { useAuth } from "@/lib/auth";
import { Shield, Sparkles, User, Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { loginAsDemoUser, loginAsDemoAdmin, loginAsGuest, loginWithEmail, registerWithEmail } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleDemoUser = () => {
    loginAsDemoUser();
    router.push("/");
  };

  const handleDemoAdmin = () => {
    loginAsDemoAdmin();
    router.push("/admin");
  };

  const handleGuest = () => {
    loginAsGuest();
    router.push("/analyze");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (isRegister) {
      await registerWithEmail(name || "User", email, password);
    } else {
      await loginWithEmail(email, password);
    }
    router.push("/");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-6 px-4">
      <div className="max-w-md w-full bg-white dark:bg-[#10203A] rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
        {/* Brand Emblem */}
        <div className="flex flex-col items-center text-center space-y-3">
          <BrandMark size="lg" showText={false} />
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              ScamGraph <span className="text-gradient">AI</span>
            </h1>
            <p className="text-xs text-slate-500 italic mt-0.5">
              "Predict Before It Gets Reported"
            </p>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            ระบบตรวจสอบความเสี่ยงฟิชชิ่งและมิจฉาชีพอัจฉริยะ อิงหลักฐานจริง
          </p>
        </div>

        {/* Demo Quick Fills */}
        <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ทดสอบด้วยบัญชีสาธิต (Instant Demo Seed):</span>
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDemoUser}
              className="py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-xs font-semibold text-slate-800 dark:text-slate-200 text-center transition-all shadow-2xs"
            >
              👤 Demo User
            </button>
            <button
              onClick={handleDemoAdmin}
              className="py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-500 text-xs font-semibold text-slate-800 dark:text-slate-200 text-center transition-all shadow-2xs"
            >
              🛡️ Demo Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">ชื่อของคุณ</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="สมชาย มั่นใจ"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">อีเมล (Email)</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">รหัสผ่าน (Password)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all cursor-pointer"
          >
            {isRegister ? "สมัครสมาชิกใหม่ (Register)" : "เข้าสู่ระบบ (Sign In)"}
          </button>
        </form>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="hover:underline text-blue-600 dark:text-blue-400"
          >
            {isRegister ? "มีบัญชีอยู่แล้ว? เข้าสู่ระบบ" : "ยังไม่มีบัญชี? สมัครสมาชิก"}
          </button>

          <button
            type="button"
            onClick={handleGuest}
            className="hover:underline text-slate-600 dark:text-slate-400 font-medium"
          >
            ใช้งานทันทีแบบผู้เยี่ยมชม →
          </button>
        </div>
      </div>
    </div>
  );
}
