import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET() {
  const stats = storage.getAdminStats();
  return NextResponse.json(stats);
}
