import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Footer = () => {
  const navigate = useNavigate();

  const handleCopyPhone = () => {
    const phoneNumber = "09390310090";
    navigator.clipboard
      .writeText(phoneNumber)
      .then(() => toast.success("شماره تماس کپی شد!"))
      .catch((err) => {
        console.error("کپی نشد:", err);
        toast.error("خطا در کپی کردن شماره تماس");
      });
  };

  const scrollToSection = (sectionId) => {
    navigate("/"); // برگشت به صفحه اصلی
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 30);
  };

  return (
    <footer className="bg-gradient-to-r from-green-500 to-green-700 text-white py-8 rounded-t-2xl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center flex-wrap gap-6">
          <div>
            <h2 className="text-2xl font-bold">آدرس</h2>
            <p className="text-gray-100 mt-2">
              درحال حاضر آدرس به صورت پیامکی برای شما ارسال میشود.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold">لینک‌های سریع</h2>
            <ul className="space-y-2 mt-2">
              <li>
                <Link to="/" className="hover:text-gray-100">
                  خانه
                </Link>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("services")}
                  className="hover:text-gray-100"
                >
                  خدمات
                </button>
              </li>
              <li>
                <Link to="/faq" className="hover:text-gray-100">
                  سوالات متداول
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold">ارتباط با ما</h2>
            <p
              className="text-gray-100 mt-2 cursor-pointer"
              onClick={handleCopyPhone}
            >
              تلفن: 09390310090
            </p>
            <a
              href="https://www.instagram.com/sama_massage_gorgan?igsh=YnZ4OHJzd2xmZ3U="
              className="text-gray-100 mt-1"
            >
              اینستاگرام: @samamassage
            </a>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-100">
          <p>© تمامی حقوق این سایت متعلق به مجموعه سما ماساژ میباشد</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
