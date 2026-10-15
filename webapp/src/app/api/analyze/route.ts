import { NextRequest, NextResponse } from "next/server";
import { analyzeInput } from "@/lib/scamEngine";
import { storage } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, kind } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const thresholds = storage.getThresholds();
    const result = analyzeInput(text, kind || "text", thresholds);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Analysis failed" }, { status: 500 });
  }
}
