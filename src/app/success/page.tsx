"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refId = searchParams.get("ref_id") || "";
  const [countdown, setCountdown] = useState(8);

  // نکته: رزرو در سمت سرور و پس از «تأیید پرداخت» ساخته می‌شود.
  // این صفحه فقط نتیجه را نمایش می‌دهد و دیگر خودش رزروی ثبت نمی‌کند.
  useEffect(() => {
    const timer = setInterval(() => setCountdown((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 0) router.push("/");
  }, [countdown, router]);

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md w-full">
        <div className="text-6xl text-green-500 mb-6">✅</div>
        <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-4">
          پرداخت موفقیت‌آمیز!
        </h1>
        <p className="text-gray-700 text-lg mb-4">
          بیعانه با موفقیت پرداخت شد و رزرو شما ثبت نهایی گردید.
        </p>
        {refId && (
          <p className="text-gray-600 text-sm mb-4">
            کد پیگیری پرداخت:{" "}
            <span className="font-bold" dir="ltr">
              {refId}
            </span>
          </p>
        )}
        <p className="text-gray-500 text-sm mb-8">
          در حال انتقال به صفحه اصلی در {countdown} ثانیه...
        </p>
        <Link
          href="/"
          className="inline-block bg-green-600 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
        >
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessInner />
    </Suspense>
  );
}
