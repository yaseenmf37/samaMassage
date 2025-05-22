import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Header = () => {
  const navigate = useNavigate(); // برای پیمایش به صفحه

  const handleScrollToBooking = () => {
    navigate("/"); // به صفحه اصلی بروید
    setTimeout(() => {
      const element = document.getElementById("booking"); // پیدا کردن بخش رزرو
      if (element) {
        element.scrollIntoView({ behavior: "smooth" }); // اسکرول به بخش رزرو
      }
    }, 30); // با کمی تأخیر تا صفحه بارگذاری کامل شود
  };

  const handleCopyPhone = () => {
    const phoneNumber = "09390310090"; // شماره تماس که می‌خواهید کپی شود
    navigator.clipboard
      .writeText(phoneNumber)
      .then(() => {
        toast.success("شماره تماس کپی شد!");
      })
      .catch((error) => {
        console.error("خطا در کپی کردن شماره تماس: ", error);
        toast.error("خطا در کپی کردن شماره تماس");
      });
  };

  return (
    <header className="bg-gradient-to-r from-green-500 to-green-700 py-4 rounded-b-2xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
        <Link to="/" className="text-white text-3xl font-bold">
          سما ماساژ
        </Link>
        <nav>
          <ul className="flex space-x-8 text-center gap-6 max-md:gap-4">
            <li className="!m-0">
              <button
                onClick={handleScrollToBooking} // فراخوانی تابع اسکرول
                className="text-white text-lg hover:text-gray-200"
              >
                رزرو
              </button>
            </li>
            <li className="!m-0">
              <Link
                to="/about"
                className="text-white text-lg hover:text-gray-200"
              >
                درباره ما
              </Link>
            </li>
            <li className="!m-0">
              <button
                onClick={handleCopyPhone} // کپی کردن شماره تماس
                className="text-white text-lg hover:text-gray-200"
              >
                تماس با ما
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
