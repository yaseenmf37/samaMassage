import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { bookingService } from "../services/bookingService";

export default function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    const saveBookingData = async () => {
      try {
        const bookingData = JSON.parse(localStorage.getItem("pendingBooking"));

        if (bookingData) {
          await bookingService.createBooking(bookingData);
          toast.success("اطلاعات رزرو با موفقیت ثبت شد");

          const { date, time } = bookingData;
          await bookingService.markTimeAsBooked(date, time);

          localStorage.removeItem("pendingBooking");
        }
      } catch (error) {
        console.error("خطا در ذخیره اطلاعات:", error);
        toast.error(
          "متأسفانه در ثبت اطلاعات مشکلی پیش آمد. لطفا با پشتیبانی تماس بگیرید."
        );
      }
    };

    saveBookingData();

    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4 p-8 bg-white rounded-xl shadow-lg text-center">
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          پرداخت با موفقیت انجام شد
        </h2>
        <p className="text-gray-600 mb-8">
          رزرو شما با موفقیت ثبت شد. جزئیات رزرو به شماره موبایل شما ارسال خواهد
          شد.
        </p>
        <div className="space-y-4">
          <Link
            to="/"
            className="block w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            بازگشت به صفحه اصلی
          </Link>
          <p className="text-sm text-gray-500">
            در حال انتقال به صفحه اصلی
            <span className="loading-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </p>
        </div>
      </div>

      <style jsx>{`
        .loading-dots span {
          animation: loadingDots 1.4s infinite;
          opacity: 0;
          display: inline-block;
        }
        .loading-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }
        .loading-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes loadingDots {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
