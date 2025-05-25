"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function FailedPage() {
  const router = useRouter();

  useEffect(() => {
    // بعد از 5 ثانیه به صفحه اصلی برمی‌گردد
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full mx-4">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          پرداخت ناموفق بود
        </h1>
        <p className="text-gray-600 mb-6">
          متأسفانه پرداخت شما با موفقیت انجام نشد. لطفاً دوباره تلاش کنید.
        </p>
        <Link
          href="/"
          className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          بازگشت به صفحه اصلی
        </Link>
        <p className="text-sm text-gray-500 mt-4">
          (این صفحه به صورت خودکار بعد از 5 ثانیه به صفحه اصلی منتقل می‌شود)
        </p>
      </div>
    </div>
  );
}
