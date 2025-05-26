import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import TimeSlot from "@/models/TimeSlot";

export async function GET() {
  try {
    await connectDB();
    const timeSlots = await TimeSlot.find({}).sort({ date: 1, time: 1 });
    console.log("API /api/time-slots - Returning time slots:", timeSlots);
    return NextResponse.json({ timeSlots });
  } catch (error) {
    console.error("Error in /api/time-slots:", error);
    return NextResponse.json(
      { error: "خطا در ارتباط با سرور" },
      { status: 500 }
    );
  }
}
