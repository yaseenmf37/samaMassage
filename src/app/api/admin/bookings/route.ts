import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { bookings, removeTimeSlot } from "@/lib/data";

export async function GET() {
  try {
    const cookieStore = cookies();
    const adminSession = cookieStore.get("admin_session");

    if (adminSession?.value !== "authenticated") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
    }

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Error in GET /api/admin/bookings:", error);
    return NextResponse.json(
      { error: "خطا در پردازش درخواست" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieStore = cookies();
    const adminSession = cookieStore.get("admin_session");

    if (adminSession?.value !== "authenticated") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
    }

    const body = await request.json();
    const { date, time } = body;

    // حذف رزرو و اضافه کردن زمان به لیست زمان‌های موجود
    const index = bookings.findIndex(
      (booking) => booking.date === date && booking.time === time
    );
    if (index !== -1) {
      bookings.splice(index, 1);
      // اضافه کردن زمان به لیست زمان‌های موجود
      removeTimeSlot(date, time);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "رزرو مورد نظر یافت نشد" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/admin/bookings:", error);
    return NextResponse.json(
      { error: "خطا در پردازش درخواست" },
      { status: 500 }
    );
  }
}
