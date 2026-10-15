import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET() {
  const reports = storage.getReports();
  return NextResponse.json(reports);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const report = storage.addReport({
      user_name: body.user_name || "Citizen Reporter",
      kind: body.kind || "text",
      text: body.text,
      detail: body.detail || "",
      entities: body.entities || [],
      evidence_files: body.evidence_files || [],
    });
    return NextResponse.json(report);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
