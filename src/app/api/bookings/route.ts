import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import TimeSlot from "@/models/TimeSlot";
import Booking from "@/models/Booking";

export async function POST(request: Request) {
  console.log("Received POST request to /api/bookings");
  try {
    const body = await request.json();
    console.log("Request body:", body);
    const { date, time, massageType, name, phone, gender, notes } = body;

    if (!date || !time) {
      console.error("Validation error: Date or time is missing");
      return NextResponse.json(
        { error: "تاریخ و زمان الزامی هستند" },
        { status: 400 }
      );
    }

    await connectDB();

    // بررسی وجود زمان در لیست زمان‌های موجود
    const timeSlot = await TimeSlot.findOne({ date, time });
    if (!timeSlot) {
      console.error("Validation error: Time slot does not exist");
      return NextResponse.json(
        { error: "این زمان برای رزرو موجود نیست" },
        { status: 400 }
      );
    }

    // بررسی رزرو بودن زمان
    const existingBooking = await Booking.findOne({ date, time });
    if (existingBooking) {
      console.error("Validation error: Time slot is already booked");
      return NextResponse.json(
        { error: "این زمان قبلاً رزرو شده است" },
        { status: 400 }
      );
    }

    console.log("Attempting to add booking and remove time slot...");
    // ثبت رزرو و حذف از لیست زمان‌های موجود
    const booking = await Booking.create({
      date,
      time,
      massageType,
      name,
      phone,
      gender,
      notes,
    });

    await TimeSlot.deleteOne({ date, time });
    console.log("Booking successful!");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in /api/bookings:", error);
    return NextResponse.json(
      { error: "خطا در ارتباط با سرور" },
      { status: 500 }
    );
  }
}
