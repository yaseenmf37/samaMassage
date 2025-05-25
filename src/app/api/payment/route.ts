import { NextResponse } from "next/server";
import { addBooking } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { date, time, massageType, name, phone, gender, notes } = data;

    // در اینجا می‌توانید با درگاه پرداخت ارتباط برقرار کنید
    // و وضعیت پرداخت را بررسی کنید

    // اگر پرداخت موفق بود، رزرو را ثبت کنید
    const booking = await addBooking({
      date,
      time,
      massageType,
      name,
      phone,
      gender,
      notes,
    });

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    return NextResponse.json(
      { error: "خطا در پردازش پرداخت" },
      { status: 500 }
    );
  }
}
