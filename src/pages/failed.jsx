import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Failed() {
  const navigate = useNavigate();

  useEffect(() => {
    // بعد از 5 ثانیه به صفحه اصلی هدایت می‌شود
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
            className="mx-auto h-16 w-16 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          پرداخت ناموفق بود
        </h2>
        <p className="text-gray-600 mb-8">
          متأسفانه پرداخت شما با مشکل مواجه شد. لطفاً دوباره تلاش کنید یا با
          پشتیبانی تماس بگیرید.
        </p>
        <div className="space-y-4">
          <Link
            to="/"
            className="block w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
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
