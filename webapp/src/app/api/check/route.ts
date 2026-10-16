import { NextRequest, NextResponse } from "next/server";
import { analyzeTextWithRules } from "@/lib/rules-adapter";
import { analyzeTextWithGemini } from "@/lib/gemini";
import {
  extractBankAccountsFromText,
  checkMultipleBankAccounts,
  enrichAnalysisWithBankMatches,
} from "@/lib/bank-threat-lookup";
import { predictScamWithML } from "@/lib/ml/textClassifier";

const MAX_CHARS = 5000;

/** POST /api/check — JSON { text, kind: "text" | "url" } → ScamAnalysis */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { text, kind } = (body ?? {}) as { text?: unknown; kind?: unknown };
  if (typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "Please paste a message or link to check." }, { status: 400 });
  }
  if (text.length > MAX_CHARS) {
    return NextResponse.json({ error: "That text is too long. Paste up to 5,000 characters." }, { status: 413 });
  }

  // If Gemini API key is configured, use Gemini with fallback to rules
  if (process.env.GEMINI_API_KEY) {
    try {
      const geminiResult = await analyzeTextWithGemini(text);
      return NextResponse.json(geminiResult);
    } catch (err: unknown) {
      console.warn("Gemini text analysis failed, falling back to rule engine:", err);
    }
  }

  try {
    const mlPrediction = predictScamWithML(text);
    const baseResult = analyzeTextWithRules(text, kind === "url" ? "url" : "text");
    const candidateAccounts = extractBankAccountsFromText(text);
    const bankMatches = checkMultipleBankAccounts(candidateAccounts);
    const enriched = enrichAnalysisWithBankMatches(baseResult, bankMatches);
    return NextResponse.json({
      ...enriched,
      mlPrediction,
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
