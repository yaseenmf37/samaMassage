import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { addTimeSlot, removeTimeSlot, getTimeSlots } from "@/lib/data";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("admin-token");

    if (!adminSession) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
    }

    const timeSlots = getTimeSlots();
    console.log("Admin panel - Current time slots:", timeSlots);
    return NextResponse.json({ timeSlots });
  } catch (error) {
    console.error("Error fetching time slots in admin panel:", error);
    return NextResponse.json(
      { error: "خطا در ارتباط با سرور" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    addTimeSlot(date, time);
    console.log("Admin panel - Added new time slot:", { date, time });
    const updatedTimeSlots = getTimeSlots();
    console.log("Admin panel - Updated time slots:", updatedTimeSlots);
    return NextResponse.json({ success: true, timeSlot: { date, time } });
  } catch (error) {
    console.error("Error adding time slot in admin panel:", error);
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
    const updatedTimeSlots = getTimeSlots();
    console.log("Admin panel - Time slot removed:", { date, time });
    console.log("Admin panel - Updated time slots:", updatedTimeSlots);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting time slot in admin panel:", error);
    return NextResponse.json(
      { error: "خطا در ارتباط با سرور" },
      { status: 500 }
    );
  }
}
