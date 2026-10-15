import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET() {
  const thresholds = storage.getThresholds();
  return NextResponse.json(thresholds);
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    storage.setThresholds({
      medium: Number(body.medium) || 40.0,
      high: Number(body.high) || 70.0,
    });
    return NextResponse.json({ success: true, thresholds: storage.getThresholds() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
