import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";
import TimeSlot from "@/models/TimeSlot";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("admin-token");

    if (!adminSession) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
    }

    await connectDB();
    const timeSlots = await TimeSlot.find({}).sort({ date: 1, time: 1 });
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

    await connectDB();

    // بررسی تکراری نبودن
    const existingTimeSlot = await TimeSlot.findOne({ date, time });
    if (existingTimeSlot) {
      return NextResponse.json(
        { error: "این زمان قبلاً ثبت شده است" },
        { status: 400 }
      );
    }

    const timeSlot = await TimeSlot.create({ date, time });
    console.log("Admin panel - Added new time slot:", timeSlot);

    const updatedTimeSlots = await TimeSlot.find({}).sort({ date: 1, time: 1 });
    console.log("Admin panel - Updated time slots:", updatedTimeSlots);

    return NextResponse.json({ success: true, timeSlot });
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

    await connectDB();
    const result = await TimeSlot.deleteOne({ date, time });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "زمان مورد نظر یافت نشد" },
        { status: 404 }
      );
    }

    const updatedTimeSlots = await TimeSlot.find({}).sort({ date: 1, time: 1 });
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
