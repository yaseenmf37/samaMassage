import React from "react";

export default function TermsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50 p-4 overflow-y-auto m-0">
      <div className="bg-white rounded-xl shadow-2xl w-11/12 max-w-lg max-h-[90vh] overflow-y-auto relative transform transition-all duration-300 scale-100 opacity-100 p-4 sm:p-6">
        <div className="pb-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            قوانین و مقررات مجموعه‌ی ماساژ
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div className="py-4 text-gray-700 text-sm leading-relaxed">
          <p className="mb-4">
            لطفاً قبل از رزرو، قوانین و مقررات زیر را با دقت مطالعه فرمایید:
          </p>

          <h3 className="text-md font-semibold mb-2 text-gray-800">
            1. شرایط رزرو:
          </h3>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>رزرو نوبت فقط از طریق وبسایت امکان‌پذیر است.</li>
            <li>
              لطفاً اطلاعات تماس خود را به دقت وارد نمایید تا در صورت نیاز برای
              هماهنگی با شما تماس گرفته شود.
            </li>
            <li>
              امکان لغو یا تغییر نوبت تا ۲۴ ساعت قبل از زمان رزرو شده وجود دارد.
            </li>
            <li>
              در صورت عدم حضور در زمان مقرر و عدم اطلاع‌رسانی قبلی، مبلغ
              پیش‌پرداخت مسترد نخواهد شد.
            </li>
          </ul>

          <h3 className="text-md font-semibold mb-2 text-gray-800">
            2. پرداخت:
          </h3>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>مبلغ پیش‌پرداخت برای قطعی شدن رزرو الزامی است.</li>
            <li>مابقی هزینه خدمات پس از اتمام جلسه در محل دریافت می‌گردد.</li>
            <li>تمامی پرداخت‌ها از طریق درگاه پرداخت امن انجام می‌شود.</li>
          </ul>

          <h3 className="text-md font-semibold mb-2 text-gray-800">
            3. بهداشت و سلامت:
          </h3>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>
              لطفاً در صورت داشتن هرگونه بیماری خاص، آلرژی یا شرایط پزشکی، قبل
              از شروع ماساژ به ماساژور اطلاع دهید.
            </li>
            <li>رعایت بهداشت فردی قبل از حضور در مجموعه الزامی است.</li>
            <li>
              محیط مجموعه کاملاً ضدعفونی شده و بهداشت در بالاترین سطح رعایت
              می‌گردد.
            </li>
          </ul>

          <h3 className="text-md font-semibold mb-2 text-gray-800">
            4. حریم خصوصی:
          </h3>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>
              اطلاعات شخصی شما نزد مجموعه محفوظ خواهد ماند و برای هیچ شخص ثالثی
              فاش نخواهد شد.
            </li>
            <li>استفاده از تلفن همراه در طول جلسه ماساژ مجاز نمی‌باشد.</li>
          </ul>

          <p className="mb-4">
            با کلیک بر روی دکمه "بستن و پذیرفتن" یا دکمه بستن بالا، شما تمامی
            موارد فوق را مطالعه کرده و می‌پذیرید.
          </p>
        </div>

        <div className="pt-4 border-t border-gray-200 text-right">
          <button
            onClick={onClose}
            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 focus:outline-none text-sm font-semibold"
          >
            بستن و پذیرفتن
          </button>
        </div>
      </div>
    </div>
  );
}
