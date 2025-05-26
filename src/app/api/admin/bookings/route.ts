import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("admin-token");

    if (!adminSession) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
    }

    await connectDB();
    const bookings = await Booking.find({}).sort({ date: 1, time: 1 });
    console.log("Admin panel - Current bookings:", bookings);
    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings in admin panel:", error);
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

    await connectDB();
    const result = await Booking.deleteOne({ date, time });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "رزرو مورد نظر یافت نشد" },
        { status: 404 }
      );
    }

    const updatedBookings = await Booking.find({}).sort({ date: 1, time: 1 });
    console.log("Admin panel - Booking removed:", { date, time });
    console.log("Admin panel - Updated bookings:", updatedBookings);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting booking in admin panel:", error);
    return NextResponse.json(
      { error: "خطا در ارتباط با سرور" },
      { status: 500 }
    );
  }
}
