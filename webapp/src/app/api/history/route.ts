import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET() {
  const history = storage.getHistory();
  return NextResponse.json(history);
}

export async function POST(req: NextRequest) {
  try {
    const analysis = await req.json();
    const item = storage.addHistory(analysis);
    return NextResponse.json(item);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (id) {
    storage.deleteHistory(id);
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: "Missing ID" }, { status: 400 });
}
