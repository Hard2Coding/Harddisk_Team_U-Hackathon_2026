import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function PATCH(req: NextRequest) {
  try {
    const { id, status, reason } = await req.json();
    if (!id || !status || !reason) {
      return NextResponse.json({ error: "id, status, and reason are required" }, { status: 400 });
    }
    storage.updateReportStatus(id, status, reason);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
