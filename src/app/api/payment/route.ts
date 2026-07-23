import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import TimeSlot from "@/models/TimeSlot";
import Booking from "@/models/Booking";
import Payment from "@/models/Payment";
import { requestPayment } from "@/lib/zarinpal";
import { DEPOSIT_RIAL, site } from "@/lib/site";
import { toEnglishDigits } from "@/lib/jalali";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// چند دقیقه یک زمان برای شخصی که در حال پرداخت است «نگه داشته» می‌شود
const HOLD_MINUTES = 15;

function siteBaseUrl(request: Request): string {
  if (process.env.PUBLIC_BASE_URL)
    return process.env.PUBLIC_BASE_URL.replace(/\/$/, "");
  const host = request.headers.get("host");
  if (host) {
    const proto =
      host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https";
    return `${proto}://${host}`;
  }
  return site.url.replace(/\/$/, "");
}

// شروع فرایند پرداخت: ساخت درخواست در زرین‌پال و بازگرداندن آدرس درگاه
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, time, massageType, name, phone, gender, notes } = body;

    if (!date || !time || !massageType) {
      return NextResponse.json(
        { error: "تاریخ، ساعت و نوع ماساژ الزامی هستند" },
        { status: 400 }
      );
    }

    await connectDB();

    // ۱) زمان باید در لیست زمان‌های آزاد باشد
    const slot = await TimeSlot.findOne({ date, time });
    if (!slot) {
      return NextResponse.json(
        { error: "این زمان برای رزرو موجود نیست" },
        { status: 400 }
      );
    }

    // ۲) نباید رزرو نهایی‌شده‌ای برای این زمان باشد
    const already = await Booking.findOne({ date, time });
    if (already) {
      return NextResponse.json(
        { error: "این زمان قبلاً رزرو شده است" },
        { status: 400 }
      );
    }

    // ۳) اگر شخص دیگری همین حالا در حال پرداخت برای این زمان است، جلوگیری کن
    const holdSince = new Date(Date.now() - HOLD_MINUTES * 60 * 1000);
    const activeHold = await Payment.findOne({
      date,
      time,
      status: "pending",
      createdAt: { $gt: holdSince },
    });
    if (activeHold) {
      return NextResponse.json(
        {
          error:
            "این زمان در حال حاضر توسط شخص دیگری در حال پرداخت است. لطفاً چند دقیقه بعد دوباره تلاش کنید.",
        },
        { status: 409 }
      );
    }

    const cleanPhone = phone
      ? toEnglishDigits(String(phone)).replace(/\s/g, "")
      : undefined;
    const callbackUrl = `${siteBaseUrl(request)}/api/payment/callback`;
    const description = `بیعانه رزرو ${site.name} — ${date} ساعت ${time}`;

    const result = await requestPayment({
      amountRial: DEPOSIT_RIAL,
      callbackUrl,
      description,
      mobile: cleanPhone,
    });

    if (!result.ok || !result.authority || !result.url) {
      return NextResponse.json(
        { error: result.message || "خطا در اتصال به درگاه پرداخت" },
        { status: 502 }
      );
    }

    // سشن پرداخت را ذخیره کن؛ رزرو نهایی فقط پس از تأیید در callback ساخته می‌شود
    await Payment.create({
      authority: result.authority,
      amount: DEPOSIT_RIAL,
      status: "pending",
      date,
      time,
      massageType,
      name,
      phone: cleanPhone,
      gender,
      notes,
    });

    return NextResponse.json({ url: result.url });
  } catch (error) {
    console.error("Error in /api/payment:", error);
    return NextResponse.json(
      { error: "خطا در ارتباط با سرور" },
      { status: 500 }
    );
  }
}
