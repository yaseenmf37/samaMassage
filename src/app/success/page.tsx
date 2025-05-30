"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    console.log("Attempting to retrieve booking data from localStorage...");
    const bookingDataString = localStorage.getItem("bookingData");

    if (bookingDataString) {
      console.log("Booking data found in localStorage:", bookingDataString);
      try {
        const bookingData = JSON.parse(bookingDataString);
        console.log("Parsed booking data:", bookingData);
        // ارسال اطلاعات رزرو به API سرور
        console.log("Sending booking data to /api/bookings...");
        fetch("/api/bookings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        })
          .then(async (response) => {
            console.log("Response received from /api/bookings:", response);
            if (!response.ok) {
              const errorText = await response.text();
              console.error(
                "API responded with an error status:",
                response.status,
                errorText
              );
              // شاید نیاز به نمایش پیامی به کاربر باشد
              return Promise.reject(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            console.log("Data received from /api/bookings:", data);
            if (data.success) {
              console.log("Booking successfully recorded!");
              localStorage.removeItem("bookingData"); // پاک کردن اطلاعات از localStorage
            } else {
              console.error("Failed to record booking:", data.error);
              // شاید نیاز به نمایش پیامی به کاربر باشد
            }
          })
          .catch((error) => {
            console.error("Error during fetch or processing response:", error);
            // شاید نیاز به نمایش پیامی به کاربر باشد
          });
      } catch (e) {
        console.error("Error parsing booking data from localStorage:", e);
      }
    } else {
      console.warn("No booking data found in localStorage.");
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      router.push("/");
    }
  }, [countdown, router]);

  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-2xl text-center transform transition-transform duration-500 ease-in-out hover:scale-105">
        <div className="text-6xl text-green-500 mb-6 animate-bounce">✅</div>
        <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-4">
          پرداخت موفقیت‌آمیز!
        </h1>
        <p className="text-gray-700 text-lg mb-6">
          پرداخت شما با موفقیت انجام شد و رزرو شما ثبت نهایی گردید.
        </p>
        <p className="text-gray-600 text-sm mb-8">
          در حال انتقال به صفحه اصلی در {countdown} ثانیه...
        </p>
        <Link
          href="/"
          className="inline-block bg-green-600 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-green-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
}
