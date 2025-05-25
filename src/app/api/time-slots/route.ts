import { NextResponse } from "next/server";
import { getTimeSlots } from "@/lib/data";

export async function GET() {
  const timeSlots = getTimeSlots();
  console.log("API /api/time-slots - Returning time slots:", timeSlots);
  return NextResponse.json({ timeSlots });
}
