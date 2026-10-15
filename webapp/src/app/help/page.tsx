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
  Radio,
} from "lucide-react";

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "ScamGraph AI คำนวณคะแนนความเสี่ยง (Risk Score) อย่างไร?",
      a: "ระบบใช้หลักการ Evidence-Grounded Scoring โดยผสมผสานคะแนนจากโมเดลจำแนกข้อความ (TF-IDF + Logistic Regression) การตรวจโครงสร้างตัวอักษรของ URL (XGBoost Tree SHAP) และเกณฑ์ขั้นต่ำตามประวัติจริง (History Floor Policy) โดยหากพบข้อมูลตรงกับฐานข้อมูลภัยคุกคามที่ยืนยันแล้ว คะแนนจะถูกปรับขึ้นขั้นต่ำที่ 85 คะแนนทันที",
    },
    {
      q: "คำว่า 'ไม่พบประวัติ (No History Found) ≠ ปลอดภัย' หมายความว่าอย่างไร?",
      a: "มิจฉาชีพสร้างโดเมนเว็บไซต์ใหม่และเปลี่ยนเบอร์โทรศัพท์หรือบัญชีม้าทุกวัน บัญชีหรือลิงก์ที่เพิ่งเปิดใหม่จึงยังไม่มีประวัติการรายงานในระบบ การที่ระบบไม่พบประวัติเดิม จึงไม่ได้หมายความว่าเว็บไซต์หรือเบอร์นั้นปลอดภัย ผู้ใช้ยังคงต้องพิจารณาคำเตือนและเนื้อหาความเสี่ยงร่วมด้วย",
    },
    {
      q: "ระบบมีความปลอดภัยต่อข้อมูลส่วนตัวอย่างไร (Privacy & Zero-Trust)?",
      a: "ScamGraph AI ใช้ระบบ Zero-Fetch คือไม่คลิกหรือดาวน์โหลดเว็บไซต์ปลายทางที่ผู้ใช้ส่งมาโดยเด็ดขาด ป้องกันมัลแวร์ ส่วนเบอร์โทรศัพท์และเลขบัญชีจะถูกปกปิด (Masked) เช่น 081-xxx-4567 เสมอ และรูปภาพ OCR จะถูกลบพิกัด GPS อัตโนมัติในหน่วยความจำก่อนวิเคราะห์",
    },
    {
      q: "ถ้าเผลอโอนเงินให้มิจฉาชีพไปแล้ว ต้องทำอย่างไรทันที?",
      a: "1. โทรติดต่อศูนย์ AOC 1441 ทันที (เปิดตลอด 24 ชั่วโมง) เพื่อประสานงานระงับธุรกรรมบัญชีม้าปลายทาง\n2. โทรติดต่อสายด่วนภัยการเงินของธนาคารที่คุณใช้โอน เพื่อขอ Bank Case ID สำหรับอายัดบัญชี\n3. แจ้งความออนไลน์ผ่านเว็บไซต์ทางการของสำนักงานตำรวจแห่งชาติที่ thaipoliceonline.go.th ภายใน 72 ชั่วโมง",
    },
  ];

  const emergencyHotlines = [
    {
      name: "ศูนย์ปฏิบัติการแก้ไขปัญหาอาชญากรรมออนไลน์ (AOC)",
      number: "1441",
      desc: "สายด่วนระงับบัญชีม้าและรับแจ้งคดีหลอกลวงออนไลน์ 24 ชั่วโมง",
      tag: "ภาครัฐ / 24 ชม.",
      color: "border-red-500/30 bg-red-500/5",
    },
    {
      name: "ศูนย์รับเรื่องร้องเรียน กสทช.",
      number: "1200",
      desc: "แจ้งเบาะแส SMS หลอกลวง เสาสัญญาณปลอม และแก๊งคอลเซ็นเตอร์",
      tag: "กสทช. ฟรีค่าโทร",
      color: "border-blue-500/30 bg-blue-500/5",
    },
    {
      name: "แจ้งความออนไลน์ ตำรวจไซเบอร์",
      number: "thaipoliceonline.go.th",
      desc: "ระบบแจ้งความคดีอาชญากรรมทางเทคโนโลยี สำนักงานตำรวจแห่งชาติ",
      isWeb: true,
      tag: "ตำรวจไซเบอร์",
      color: "border-purple-500/30 bg-purple-500/5",
    },
  ];

  const bankHotlines = [
    { bank: "ธนาคารกสิกรไทย (KBank)", tel: "02-888-8888", ext: "กด 001" },
    { bank: "ธนาคารไทยพาณิชย์ (SCB)", tel: "02-777-7575", ext: "สายด่วนภัยออนไลน์" },
    { bank: "ธนาคารกรุงไทย (Krungthai)", tel: "02-111-1111", ext: "กด 108" },
    { bank: "ธนาคารกรุงเทพ (BBL)", tel: "1333", ext: "หรือ 02-645-5555" },
    { bank: "ธนาคารทหารไทยธนชาต (ttb)", tel: "1428", ext: "กด 03" },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold mb-2">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Support & Emergency Hotlines</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          ศูนย์ช่วยเหลือ & สายด่วนแจ้งภัยการเงิน (Help Center)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          คำถามที่พบบ่อย หลักการทำงานของ AI และช่องทางติดต่อฉุกเฉินกับหน่วยงานภาครัฐและธนาคาร
        </p>
      </div>

      {/* Emergency Hotlines Cards */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-500" />
          <span>เบอร์โทรฉุกเฉินเมื่อตกเป็นเหยื่อมิจฉาชีพ (Emergency Response)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {emergencyHotlines.map((h, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-3xl border ${h.color} space-y-3 flex flex-col justify-between`}
            >
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
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
                  className="inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  <span>เข้าสู่ระบบแจ้งความ</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <a
                  href={`tel:${h.number}`}
                  className="inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>โทร {h.number}</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bank Fraud Hotlines */}
      <div className="bg-white dark:bg-[#10203A] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Building className="w-4 h-4 text-blue-500" />
          <span>สายด่วนแจ้งระงับธุรกรรมธนาคารพาณิชย์ (24 ชั่วโมง)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {bankHotlines.map((b, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">{b.bank}</div>
                <div className="text-[11px] text-slate-500">{b.ext}</div>
              </div>
              <a
                href={`tel:${b.tel}`}
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors"
              >
                {b.tel}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Search & Accordion */}
      <div className="bg-white dark:bg-[#10203A] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              คำถามที่พบบ่อย (Frequently Asked Questions)
            </h3>
            <p className="text-xs text-slate-500">
              ความรู้ความเข้าใจเกี่ยวกับการประเมินความเสี่ยงและมาตรการความปลอดภัย
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาคำถาม..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-hidden"
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
                  className="w-full flex items-center justify-between gap-3 text-left font-bold text-sm text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line animate-in fade-in">
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
