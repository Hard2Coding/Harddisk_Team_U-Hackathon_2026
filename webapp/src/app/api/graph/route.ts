import { NextResponse } from "next/server";

export async function GET() {
  const sampleGraph = {
    nodes: [
      { id: "http://kbank-verify-otp.xyz", type: "url", label: "kbank-verify-otp.xyz", is_sample: true, report_status: "confirmed", provenance: "AOC 1441 Alert" },
      { id: "0891234567", type: "phone", label: "089-xxx-4567", is_sample: true, report_status: "confirmed", provenance: "Police Cyber Threat Bulletin" },
      { id: "1402998810", type: "account", label: "140-xxx-8810 (Mule)", is_sample: true, report_status: "confirmed", provenance: "BOT Mule Watchlist" },
      { id: "0819994321", type: "wallet", label: "081-xxx-4321 (PromptPay)", is_sample: true, report_status: "reported", provenance: "Community Clues #941" },
      { id: "@scam_loan_fake", type: "line", label: "@scam_loan***", is_sample: true, report_status: "reported", provenance: "Victim Report" },
      { id: "threat-AOC-948", type: "campaign", label: "AOC Phishing Campaign #948", is_sample: true, report_status: "confirmed", provenance: "AOC Cyber Hub" },
      { id: "scb-secure-update.top", type: "domain", label: "scb-secure-update.top", is_sample: true, report_status: "confirmed", provenance: "ThaiCERT" },
    ],
    edges: [
      { id: "e1", source: "http://kbank-verify-otp.xyz", target: "threat-AOC-948", relationship: "associated_domain" },
      { id: "e2", source: "0891234567", target: "threat-AOC-948", relationship: "origin_caller" },
      { id: "e3", source: "threat-AOC-948", target: "1402998810", relationship: "destination_mule" },
      { id: "e4", source: "0891234567", target: "@scam_loan_fake", relationship: "redirect_chat" },
      { id: "e5", source: "scb-secure-update.top", target: "1402998810", relationship: "linked_payout" },
      { id: "e6", source: "@scam_loan_fake", target: "0819994321", relationship: "transfer_target" },
    ],
    is_sample: true,
  };

  return NextResponse.json(sampleGraph);
}
