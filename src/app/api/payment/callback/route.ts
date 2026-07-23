import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import TimeSlot from "@/models/TimeSlot";
import Booking from "@/models/Booking";
import Payment from "@/models/Payment";
import { verifyPayment } from "@/lib/zarinpal";
import { notifyAdmins } from "@/lib/rubika";
import { jalaliValueToLabel, toPersianDigits } from "@/lib/jalali";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function baseUrl(request: Request): string {
  if (process.env.PUBLIC_BASE_URL)
    return process.env.PUBLIC_BASE_URL.replace(/\/$/, "");
  const host = request.headers.get("host");
  if (host) {
    const proto =
      host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https";
    return `${proto}://${host}`;
  }
  return "";
}

// زرین‌پال بعد از پرداخت کاربر را با پارامترهای Authority و Status به اینجا برمی‌گرداند
export async function GET(request: Request) {
  const url = new URL(request.url);
  const authority =
    url.searchParams.get("Authority") || url.searchParams.get("authority") || "";
  const status =
    url.searchParams.get("Status") || url.searchParams.get("status") || "";

  const base = baseUrl(request);
  const fail = (reason: string) =>
    NextResponse.redirect(
      `${base}/payment/failed?reason=${encodeURIComponent(reason)}`,
      302
    );
  const succeed = (refId: string) =>
    NextResponse.redirect(
      `${base}/success?ref_id=${encodeURIComponent(refId)}`,
      302
    );

  try {
    if (!authority) return fail("no-authority");

    await connectDB();

    const payment = await Payment.findOne({ authority });
    if (!payment) return fail("not-found");

    // اگر قبلاً پردازش شده، دوباره پردازش نکن (idempotent)
    if (payment.status === "paid") return succeed(payment.refId || "");
    if (payment.status === "failed") return fail("already-failed");

    // اگر کاربر پرداخت را لغو کرده باشد
    if (status !== "OK") {
      payment.status = "failed";
      await payment.save();
      return fail("canceled");
    }

    // تأیید پرداخت با زرین‌پال (سمت سرور — قابل جعل نیست)
    const verify = await verifyPayment(authority, payment.amount);
    if (!verify.ok) {
      payment.status = "failed";
      await payment.save();
      return fail("verify-failed");
    }

    // پرداخت تأیید شد
    payment.status = "paid";
    payment.refId = verify.refId;
    await payment.save();

    // بررسی اینکه در این فاصله کسی این نوبت را نگرفته باشد
    const taken = await Booking.findOne({
      date: payment.date,
      time: payment.time,
    });
    if (taken) {
      // پول دریافت شده ولی نوبت پر شده — به ادمین برای عودت وجه اطلاع بده
      notifyAdmins(
        `⚠️ پرداخت انجام شد ولی این نوبت قبلاً رزرو شده بود!\n` +
          `لطفاً مبلغ بیعانه را به مشتری عودت دهید.\n\n` +
          `📅 ${jalaliValueToLabel(payment.date)}\n` +
          `🕐 ساعت ${toPersianDigits(payment.time)}\n` +
          `👤 ${payment.name || "-"}\n` +
          `📞 ${toPersianDigits(payment.phone || "-")}\n` +
          `🔖 کد پیگیری: ${toPersianDigits(payment.refId || "-")}`
      ).catch((e) => console.error("notifyAdmins error:", e));
      return succeed(payment.refId || "");
    }

    // ثبت رزرو نهایی و حذف زمان از لیست آزاد
    await Booking.create({
      date: payment.date,
      time: payment.time,
      massageType: payment.massageType,
      name: payment.name,
      phone: payment.phone,
      gender: payment.gender,
      notes: payment.notes,
    });
    await TimeSlot.deleteOne({ date: payment.date, time: payment.time });

    // اطلاع به ادمین‌ها در روبیکا
    const typeMap: Record<string, string> = {
      relaxing: "ریلکسی",
      vip: "وی‌آی‌پی (VIP)",
    };
    const genderMap: Record<string, string> = { female: "خانم", male: "آقا" };
    const tomanStr = (payment.amount / 10).toLocaleString("fa-IR");
    const notifText =
      `🔔 رزرو جدید — بیعانه پرداخت شد!\n\n` +
      `📅 ${jalaliValueToLabel(payment.date)}\n` +
      `🕐 ساعت ${toPersianDigits(payment.time)}\n` +
      `👤 ${payment.name || "-"}\n` +
      `📞 ${toPersianDigits(payment.phone || "-")}\n` +
      `💆 ${typeMap[payment.massageType] || payment.massageType || "-"}\n` +
      `🧑 ${genderMap[payment.gender] || payment.gender || "-"}\n` +
      `💰 بیعانه: ${tomanStr} تومان\n` +
      `🔖 کد پیگیری: ${toPersianDigits(payment.refId || "-")}` +
      (payment.notes ? `\n📝 ${payment.notes}` : "");
    notifyAdmins(notifText).catch((e) =>
      console.error("notifyAdmins error:", e)
    );

    return succeed(payment.refId || "");
  } catch (error) {
    console.error("Error in /api/payment/callback:", error);
    return fail("server-error");
  }
}
