import { NextRequest, NextResponse } from "next/server";
import { validateImageFile } from "@/lib/file-validation";
import { DEMO_ANALYSIS } from "@/lib/demo-result";
import { analyzeScreenshotWithGemini } from "@/lib/gemini";

/**
 * POST /api/analyze — multipart/form-data with a `file` field (screenshot).
 * Sends the image to Gemini vision model with a structured fraud detection prompt.
 * If GEMINI_API_KEY is not yet configured, returns a preview DEMO_ANALYSIS.
 */
export async function POST(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Please upload the screenshot as form data." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Please choose a screenshot to analyze." }, { status: 400 });
  }

  const check = validateImageFile(file);
  if (!check.ok) {
    return NextResponse.json({ error: check.message }, { status: check.status });
  }

  // If no Gemini API key is configured yet, return demo preview
  if (!process.env.GEMINI_API_KEY) {
    await new Promise((r) => setTimeout(r, 1200));
    return NextResponse.json(DEMO_ANALYSIS);
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const analysis = await analyzeScreenshotWithGemini(buffer, file.type);
    return NextResponse.json(analysis);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "AI analysis failed";
    console.error("Gemini Analysis Error:", errorMsg);

    // If quota or API key error occurs, provide informative error
    if (errorMsg.includes("API key not valid") || errorMsg.includes("API_KEY_INVALID")) {
      return NextResponse.json(
        { error: "The provided GEMINI_API_KEY is invalid. Please check your .env file or Vercel configuration." },
        { status: 502 }
      );
    }
    if (errorMsg.includes("quota") || errorMsg.includes("RATE_LIMIT")) {
      return NextResponse.json(
        { error: "Gemini API rate limit or quota exceeded. Please try again shortly." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "We could not analyze this screenshot with AI. Please ensure the image is clear and try again." },
      { status: 502 }
    );
  }
}
