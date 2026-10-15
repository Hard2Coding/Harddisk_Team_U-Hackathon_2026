import { NextRequest, NextResponse } from "next/server";
import { validateImageFile } from "@/lib/file-validation";
import { DEMO_ANALYSIS } from "@/lib/demo-result";

/**
 * POST /api/analyze — multipart/form-data with a `file` field (screenshot).
 *
 * Until GEMINI_API_KEY is configured this returns a clearly-labelled demo
 * result so the frontend can be built and demoed end-to-end.
 * TODO(gemini): call Gemini with the image, validate output with Zod, return it.
 */
export async function POST(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Please upload the screenshot as form data." }, { status: 400 });
  }

  const file = form.get("file");
  const check = validateImageFile(file instanceof File ? file : null);
  if (!check.ok) {
    return NextResponse.json({ error: check.message }, { status: check.status });
  }

  if (!process.env.GEMINI_API_KEY) {
    // Small delay so the loading state is visible in demo mode.
    await new Promise((r) => setTimeout(r, 1200));
    return NextResponse.json(DEMO_ANALYSIS);
  }

  // Gemini integration is the next step; fall back to demo until implemented.
  return NextResponse.json(DEMO_ANALYSIS);
}
