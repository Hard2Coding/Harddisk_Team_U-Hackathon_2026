"use client";
import React, { useState } from "react";
import {
  HelpCircle,
  Search,
  PhoneCall,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Building,
} from "lucide-react";

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does ScamGraph AI calculate risk scores?",
      a: "The platform employs an Evidence-Grounded fusion architecture. It combines character n-gram text classification (TF-IDF + Logistic Regression), structural lexical URL inspection (XGBoost Tree SHAP), and an empirical History Floor Policy. If a record matches a confirmed threat registry entry, a minimum deterministic score floor (e.g. 85.0) is enforced.",
    },
    {
      q: "What does 'No History Found ≠ Safe' mean?",
      a: "Fraudsters deploy fresh disposable domains, VoIP numbers, and mule bank accounts daily. Brand-new scam operations have zero past complaints or threat records. Consequently, the lack of past records does NOT guarantee safety. The system highlights this distinction to prevent a false sense of security.",
    },
    {
      q: "How does ScamGraph protect user privacy and security (Zero-Trust)?",
      a: "Under the Zero-Trust input policy, the engine NEVER visits, resolves, or executes untrusted links submitted by users, shielding you from drive-by malware and tracking tokens. Phone numbers and bank accounts are automatically masked (e.g., 081-xxx-4567), and images uploaded for OCR have GPS and EXIF device metadata stripped in-memory before scanning.",
    },
    {
      q: "What should I do immediately if I accidentally transferred funds to a scammer?",
      a: "1. Call the 24/7 Anti-Online Scam Center (AOC 1441) immediately to initiate an emergency freeze on the recipient mule account.\n2. Contact your bank's dedicated cyber fraud hotline to obtain a Bank Case ID.\n3. File an official cyber crime report at thaipoliceonline.go.th within 72 hours.",
    },
  ];

  const emergencyHotlines = [
    {
      name: "Anti-Online Scam Operation Center (AOC)",
      number: "1441",
      desc: "24/7 National hotline for emergency account freezes and cyber fraud response.",
      tag: "Government / 24 Hours",
      color: "border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-900/50",
    },
    {
      name: "National Telecom Bureau (NBTC)",
      number: "1200",
      desc: "Report SMS phishing, rogue cellular base stations, and call center scams.",
      tag: "Telecom Regulatory",
      color: "border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900/50",
    },
    {
      name: "Cyber Crime Police Reporting",
      number: "thaipoliceonline.go.th",
      desc: "Official Royal Thai Police online cyber crime incident reporting portal.",
      isWeb: true,
      tag: "Police Department",
      color: "border-purple-200 bg-purple-50/50 dark:bg-purple-950/20 dark:border-purple-900/50",
    },
  ];

  const bankHotlines = [
    { bank: "Kasikornbank (KBank)", tel: "02-888-8888", ext: "Ext 001 (Cyber Fraud)" },
    { bank: "Siam Commercial Bank (SCB)", tel: "02-777-7575", ext: "24/7 Cyber Hotline" },
    { bank: "Krungthai Bank (KTB)", tel: "02-111-1111", ext: "Ext 108 (Fraud Center)" },
    { bank: "Bangkok Bank (BBL)", tel: "1333", ext: "or 02-645-5555" },
    { bank: "TMBThanachart (ttb)", tel: "1428", ext: "Ext 03 (Urgent Fraud)" },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800 text-xs font-bold mb-2">
          <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
          <span>Support & Emergency Fraud Hotlines</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Help Center & Emergency Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Frequently asked questions, AI methodology, and emergency contacts for financial fraud and law enforcement
        </p>
      </div>

      {/* Emergency Hotlines Cards */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-600" />
          <span>Emergency Cyber Fraud Hotlines (Immediate Action)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {emergencyHotlines.map((h, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-3xl border ${h.color} space-y-4 flex flex-col justify-between shadow-2xs`}
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                  {h.tag}
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                  {h.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {h.desc}
                </p>
              </div>

              {h.isWeb ? (
                <a
                  href={`https://${h.number}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  <span>Open Police Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <a
                  href={`tel:${h.number}`}
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call {h.number}</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bank Fraud Hotlines */}
      <div className="bg-white dark:bg-[#10203A] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Building className="w-4 h-4 text-blue-600" />
          <span>Major Commercial Bank 24/7 Cyber Fraud Centers</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {bankHotlines.map((b, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">{b.bank}</div>
                <div className="text-[11px] text-slate-500">{b.ext}</div>
              </div>
              <a
                href={`tel:${b.tel}`}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors shadow-2xs"
              >
                {b.tel}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Search & Accordion */}
      <div className="bg-white dark:bg-[#10203A] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Frequently Asked Questions (FAQ)
            </h3>
            <p className="text-xs text-slate-500">
              Methodology, safety guarantees, and risk score interpretations
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-hidden"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-4 first:pt-0 last:pb-0">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-3 text-left font-bold text-sm text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line animate-in fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
