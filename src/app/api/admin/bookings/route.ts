import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  timeSlots,
  bookings,
  removeTimeSlot,
  addBooking,
  TimeSlot,
  Booking,
} from "@/lib/data";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("admin-token");

    if (!adminSession) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
    }

    return NextResponse.json({ bookings });
  } catch {
    return NextResponse.json(
      { error: "خطا در ارتباط با سرور" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("admin-token");

    if (!adminSession) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
    }

    const { date, time } = await request.json();

    if (!date || !time) {
      return NextResponse.json(
        { error: "تاریخ و زمان الزامی هستند" },
        { status: 400 }
      );
    }

    const success = removeTimeSlot(date, time);
    if (!success) {
      return NextResponse.json(
        { error: "زمان مورد نظر یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "خطا در ارتباط با سرور" },
      { status: 500 }
    );
  }
}
