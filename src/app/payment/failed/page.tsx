"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const reasonMap: Record<string, string> = {
  canceled: "پرداخت توسط شما لغو شد.",
  "verify-failed": "پرداخت تأیید نشد. اگر مبلغی از حساب شما کسر شده، طی ۷۲ ساعت به‌صورت خودکار بازمی‌گردد.",
  "not-found": "اطلاعات پرداخت یافت نشد.",
  "no-authority": "اطلاعات بازگشت از درگاه ناقص بود.",
  "already-failed": "این تراکنش قبلاً ناموفق ثبت شده است.",
  "server-error": "خطای داخلی سرور رخ داد.",
};

function FailedInner() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") || "";
  const text = reasonMap[reason] || "پرداخت انجام نشد.";

  return (
    <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md w-full">
        <div className="text-6xl text-red-500 mb-6">❌</div>
        <h1 className="text-2xl md:text-3xl font-bold text-red-700 mb-4">
          پرداخت ناموفق
        </h1>
        <p className="text-gray-700 text-lg mb-6">{text}</p>
        <p className="text-gray-500 text-sm mb-8">
          نوبت شما رزرو نشد. می‌توانید دوباره تلاش کنید.
        </p>
        <Link
          href="/#booking"
          className="inline-block bg-forest-600 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-forest-700 transition-colors"
        >
          تلاش دوباره برای رزرو
        </Link>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={null}>
      <FailedInner />
    </Suspense>
  );
}
