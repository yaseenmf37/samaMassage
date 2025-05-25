import { NextResponse } from "next/server";
import { timeSlots } from "@/lib/data";

export async function GET() {
  return NextResponse.json({ timeSlots });
}
