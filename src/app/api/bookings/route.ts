import { NextResponse } from "next/server";
import { timeSlots, bookings, removeTimeSlot, addBooking } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, time } = body;

    if (!date || !time) {
      return NextResponse.json(
        { error: "تاریخ و زمان الزامی هستند" },
        { status: 400 }
      );
    }

    // بررسی وجود زمان در لیست زمان‌های موجود
    const timeSlotExists = timeSlots.some(
      (slot) => slot.date === date && slot.time === time
    );

    if (!timeSlotExists) {
      return NextResponse.json(
        { error: "این زمان برای رزرو موجود نیست" },
        { status: 400 }
      );
    }

    // بررسی رزرو بودن زمان
    const isBooked = bookings.some(
      (booking) => booking.date === date && booking.time === time
    );

    if (isBooked) {
      return NextResponse.json(
        { error: "این زمان قبلاً رزرو شده است" },
        { status: 400 }
      );
    }

    // ثبت رزرو و حذف از لیست زمان‌های موجود
    addBooking(date, time);
    removeTimeSlot(date, time);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "خطا در ارتباط با سرور" },
      { status: 500 }
    );
  }
}
