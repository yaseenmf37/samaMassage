import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { timeSlots, addTimeSlot, removeTimeSlot } from "@/lib/data";

export async function GET() {
  try {
    const cookieStore = cookies();
    const adminSession = cookieStore.get("admin_session");

    if (adminSession?.value !== "authenticated") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
    }

    console.log("Admin panel - Current time slots:", timeSlots);
    return NextResponse.json({ timeSlots });
  } catch (error) {
    console.error("Error in GET /api/admin/time-slots:", error);
    return NextResponse.json(
      { error: "خطا در پردازش درخواست" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const adminSession = cookieStore.get("admin_session");

    if (adminSession?.value !== "authenticated") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
    }

    const body = await request.json();
    const { date, time } = body;

    if (!date || !time) {
      return NextResponse.json(
        { error: "تاریخ و زمان الزامی هستند" },
        { status: 400 }
      );
    }

    addTimeSlot(date, time);
    console.log("Admin panel - Added new time slot:", { date, time });
    console.log("Admin panel - Updated time slots:", timeSlots);
    return NextResponse.json({ success: true, timeSlot: { date, time } });
  } catch (error) {
    console.error("Error in POST /api/admin/time-slots:", error);
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

    removeTimeSlot(date, time);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/admin/time-slots:", error);
    return NextResponse.json(
      { error: "خطا در پردازش درخواست" },
      { status: 500 }
    );
  }
}
