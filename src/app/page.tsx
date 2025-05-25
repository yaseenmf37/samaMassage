"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { TimeSlot } from "@/lib/data";

export default function Home() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [message, setMessage] = useState("");
  const [selectedMassageType, setSelectedMassageType] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  useEffect(() => {
    if (selectedMassageType === "relaxing") {
      setTotalPrice(850000);
    } else if (selectedMassageType === "vip") {
      setTotalPrice(1000000);
    } else {
      setTotalPrice(0);
    }
  }, [selectedMassageType]);

  const fetchTimeSlots = async () => {
    try {
      const response = await fetch("/api/time-slots");
      if (response.ok) {
        const data = await response.json();
        console.log("Time slots received:", data.timeSlots);
        setTimeSlots(data.timeSlots);
      }
    } catch {
      console.error("Error fetching time slots:");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!selectedDate || !selectedTime || !selectedMassageType) {
      setMessage("لطفاً تمام فیلدها را پر کنید");
      return;
    }

    try {
      const bookingData = {
        date: selectedDate,
        time: selectedTime,
        massageType: selectedMassageType,
        name: (document.getElementById("name") as HTMLInputElement).value,
        phone: (document.getElementById("phone") as HTMLInputElement).value,
        gender: (document.getElementById("gender") as HTMLSelectElement).value,
        notes: (document.getElementById("notes") as HTMLTextAreaElement).value,
      };

      // ذخیره اطلاعات رزرو در localStorage
      localStorage.setItem("bookingData", JSON.stringify(bookingData));

      // انتقال به درگاه پرداخت
      window.location.href = "https://zarinp.al/714162";
    } catch {
      setMessage("خطا در ارتباط با سرور");
    }
  };

  // فیلتر کردن زمان‌ها بر اساس تاریخ انتخاب شده
  const filteredTimeSlots = timeSlots.filter(
    (slot) => slot.date === selectedDate
  );

  return (
    <div className="min-h-screen bg-green-50 text-gray-800">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] md:h-[80vh] lg:h-[70vh]">
        <Image
          src="/massage.png"
          alt="تصویر هیرو ماساژ"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10 flex items-center justify-center h-full">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white text-center drop-shadow-2xl max-md:text-2xl">
            تجربه آرامش بی‌نهایت در سما ماساژ
          </h1>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-8xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-green-700">
            چرا ماساژ درمانی؟ فواید شگفت‌انگیز برای شما
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Benefit Card 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-xl transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="text-4xl text-green-600 mb-4 text-center">😌</div>
              <h3 className="text-xl font-semibold mb-3 text-green-600 text-center">
                کاهش استرس و اضطراب
              </h3>
              <p className="text-gray-700 text-center">
                ماساژ به عمق عضلات نفوذ کرده و تنش‌های فیزیکی و ذهنی را از بین
                می‌برد، حسی عمیق از آرامش را برای شما به ارمغان می‌آورد.
              </p>
            </div>
            {/* Benefit Card 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-xl transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="text-4xl text-green-600 mb-4 text-center">❤️</div>
              <h3 className="text-xl font-semibold mb-3 text-green-600 text-center">
                بهبود گردش خون و لنف
              </h3>
              <p className="text-gray-700 text-center">
                با تحریک جریان خون و لنف، اکسیژن‌رسانی به بافت‌ها بهتر شده و به
                دفع سموم از بدن کمک می‌کند، که نتیجه آن شادابی و سلامت بیشتر
                است.
              </p>
            </div>
            {/* Benefit Card 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-xl transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="text-4xl text-green-600 mb-4 text-center">💪</div>
              <h3 className="text-xl font-semibold mb-3 text-green-600 text-center">
                تسکین دردهای عضلانی
              </h3>
              <p className="text-gray-700 text-center">
                ماساژ منظم می‌تواند به کاهش دردهای مزمن عضلانی و مفصلی،
                اسپاسم‌ها و گرفتگی‌ها کمک کرده و انعطاف‌پذیری بدن را افزایش دهد.
              </p>
            </div>
            {/* Benefit Card 4 */}
            <div className="bg-white p-8 rounded-3xl shadow-xl transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="text-4xl text-green-600 mb-4 text-center">😴</div>
              <h3 className="text-xl font-semibold mb-3 text-green-600 text-center">
                کیفیت بهتر خواب
              </h3>
              <p className="text-gray-700 text-center">
                با کاهش تنش و افزایش آرامش، ماساژ می‌تواند به بهبود الگوهای خواب
                شما کمک کند و تجربه خوابی عمیق‌تر و راحت‌تر را فراهم آورد.
              </p>
            </div>
            {/* Benefit Card 5 */}
            <div className="bg-white p-8 rounded-3xl shadow-xl transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="text-4xl text-green-600 mb-4 text-center">✨</div>
              <h3 className="text-xl font-semibold mb-3 text-green-600 text-center">
                افزایش سطح انرژی
              </h3>
              <p className="text-gray-700 text-center">
                با رفع خستگی و بهبود اکسیژن‌رسانی، ماساژ می‌تواند سطح انرژی شما
                را افزایش داده و به شما حس سرزندگی و شادابی بیشتری ببخشد.
              </p>
            </div>
            {/* Benefit Card 6 */}
            <div className="bg-white p-8 rounded-3xl shadow-xl transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="text-4xl text-green-600 mb-4 text-center">😊</div>
              <h3 className="text-xl font-semibold mb-3 text-green-600 text-center">
                بهبود حال روحی
              </h3>
              <p className="text-gray-700 text-center">
                ماساژ با ترشح هورمون‌های حال خوب مانند سروتونین و اندورفین، به
                بهبود خلق و خو، کاهش علائم افسردگی و افزایش حس خوشبختی کمک
                می‌کند.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-16 md:py-24 bg-green-100">
        <div className="max-w-8xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-green-700">
            رزرو آنلاین وقت ماساژ
          </h2>
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-2xl mx-auto border-t-4 border-green-500">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-gray-700 text-lg font-semibold mb-2"
                >
                  نام و نام خانوادگی:
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors duration-200 text-gray-800"
                  placeholder="نام کامل خود را وارد کنید"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-gray-700 text-lg font-semibold mb-2"
                >
                  شماره موبایل:
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors duration-200 text-gray-800"
                  placeholder="۰۹۱۲ ۱۲۳ ۴۵۶۷"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-lg font-semibold mb-2">
                  جنسیت:
                </label>
                <div className="flex flex-wrap gap-6">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      className="w-5 h-5 text-green-500 border-gray-300 focus:ring-green-500"
                    />
                    <span className="mr-2 text-lg text-gray-800">خانم</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      className="w-5 h-5 text-green-500 border-gray-300 focus:ring-green-500"
                    />
                    <span className="mr-2 text-lg text-gray-800">آقا</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 text-lg font-semibold mb-2">
                  نوع ماساژ:
                </label>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <input
                      type="radio"
                      id="relaxing"
                      name="massageType"
                      value="relaxing"
                      className="w-4 h-4 text-blue-600"
                      required
                      onChange={(e) => setSelectedMassageType(e.target.value)}
                    />
                    <label htmlFor="relaxing" className="text-gray-700">
                      ماساژ ریلکسی
                    </label>
                  </div>
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <input
                      type="radio"
                      id="vip"
                      name="massageType"
                      value="vip"
                      className="w-4 h-4 text-blue-600"
                      required
                      onChange={(e) => setSelectedMassageType(e.target.value)}
                    />
                    <label htmlFor="vip" className="text-gray-700">
                      ماساژ وی‌آی‌پی
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="date"
                  className="block text-gray-700 text-lg font-semibold mb-2"
                >
                  تاریخ رزرو:
                </label>
                <select
                  id="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedTime(""); // ریست کردن زمان انتخاب شده
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors duration-200 text-gray-800 bg-white"
                  required
                >
                  <option value="">تاریخ را انتخاب کنید</option>
                  {Array.from(new Set(timeSlots.map((slot) => slot.date))).map(
                    (date) => (
                      <option key={date} value={date}>
                        {date}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div>
                <label
                  htmlFor="time"
                  className="block text-gray-700 text-lg font-semibold mb-2"
                >
                  ساعت رزرو:
                </label>
                <select
                  id="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors duration-200 text-gray-800 bg-white"
                  required
                  disabled={!selectedDate}
                >
                  <option value="">ساعت را انتخاب کنید</option>
                  {filteredTimeSlots.map((slot) => (
                    <option key={slot.time} value={slot.time}>
                      {slot.time}
                    </option>
                  ))}
                </select>
              </div>
              {message && (
                <div className="text-center text-sm">
                  <p
                    className={
                      message.includes("موفقیت")
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {message}
                  </p>
                </div>
              )}
              <div className="text-center mb-6">
                <p className="text-gray-700 mb-2">
                  مبلغ پیش پرداخت: 200,000 تومان
                </p>
                <p className="text-gray-700 mb-4">
                  {totalPrice ? (
                    <span>مبلغ کل: {totalPrice.toLocaleString()} تومان</span>
                  ) : (
                    <span className="text-red-500">
                      لطفاً نوع ماساژ را انتخاب کنید
                    </span>
                  )}
                </p>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={!selectedMassageType}
                >
                  تایید و رزرو نوبت
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-8xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-green-700 flex items-center gap-4 justify-center">
            انواع سرویس‌های ماساژ سما
            <span className="inline-block bg-green-200 text-green-800 text-lg font-bold px-4 py-2 rounded-full">
              1,000,000 تومان VIP
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* ماساژ نمک درمانی VIP */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="relative w-full h-48">
                <Image
                  src="/massage.png"
                  alt="ماساژ نمک درمانی VIP"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-green-700 text-center">
                    ماساژ نمک درمانی VIP
                  </h3>
                  <div className="text-center text-sm text-gray-600 mb-4">
                    ماساژ درمانی با نمک برای:
                  </div>
                  <ul className="list-none p-0 m-0 text-gray-700 text-sm space-y-1">
                    <li className="flex items-start">
                      <span className="ml-2 text-green-500">•</span> درمان
                      مشکلات پوستی
                    </li>
                    <li className="flex items-start">
                      <span className="ml-2 text-green-500">•</span> تسکین استرس
                      و اضطراب
                    </li>
                    <li className="flex items-start">
                      <span className="ml-2 text-green-500">•</span> پاکسازی
                      پوست
                    </li>
                    <li className="flex items-start">
                      <span className="ml-2 text-green-500">•</span> جوانسازی
                      پوست
                    </li>
                    <li className="flex items-start">
                      <span className="ml-2 text-green-500">•</span> ریلکسیشن
                      عمیق
                    </li>
                  </ul>
                </div>
                <div className="mt-6 text-center"></div>
              </div>
            </div>

            {/* ماساژ بادکش VIP */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="relative w-full h-48">
                <Image
                  src="/massage.png"
                  alt="ماساژ بادکش VIP"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-green-700 text-center">
                    ماساژ بادکش VIP
                  </h3>
                  <div className="text-center text-sm text-gray-600 mb-4">
                    ماساژ درمانی با بادکش برای:
                  </div>
                  <ul className="list-none p-0 m-0 text-gray-700 text-sm space-y-1">
                    <li className="flex items-start">
                      <span className="ml-2 text-green-500">•</span> کاهش دردهای
                      عضلانی
                    </li>
                    <li className="flex items-start">
                      <span className="ml-2 text-green-500">•</span> رفع التهاب
                    </li>
                    <li className="flex items-start">
                      <span className="ml-2 text-green-500">•</span> درمان
                      گرفتگی عضلات
                    </li>
                    <li className="flex items-start">
                      <span className="ml-2 text-green-500">•</span> بهبود گردش
                      خون
                    </li>
                    <li className="flex items-start">
                      <span className="ml-2 text-green-500">•</span> دفع سموم
                      بدن
                    </li>
                  </ul>
                </div>
                <div className="mt-6 text-center"></div>
              </div>
            </div>

            {/* ماساژ سنگ داغ VIP */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="relative w-full h-48">
                <Image
                  src="/massage.png"
                  alt="ماساژ سنگ داغ VIP"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-green-700 text-center">
                    ماساژ سنگ داغ VIP
                  </h3>
                  <div className="text-center text-sm text-gray-600 mb-4">
                    ماساژ درمانی با سنگهای داغ برای:
                  </div>
                  <ul className="list-none p-0 m-0 text-gray-700 text-sm space-y-1">
                    <li className="flex items-start">
                      <span className="ml-2 text-green-500">•</span> ریلکسیشن
                      عمیق بدن
                    </li>
                    <li className="flex items-start">
                      <span className="ml-2 text-green-500">•</span> درمان
                      سیاتیک و دیسک
                    </li>
                    <li className="flex items-start">
                      <span className="ml-2 text-green-500">•</span> رفع اسپاسم
                      و گرفتگی عضلات
                    </li>
                    <li className="flex items-start">
                      <span className="ml-2 text-green-500">•</span> درمان تریگر
                      پوینت
                    </li>
                    <li className="flex items-start">
                      <span className="ml-2 text-green-500">•</span> کاهش دردهای
                      عضلانی
                    </li>
                  </ul>
                </div>
                <div className="mt-6 text-center"></div>
              </div>
            </div>

            {/* ماساژ ترکیبی VIP */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="relative w-full h-48">
                <Image
                  src="/massage.png"
                  alt="ماساژ ترکیبی VIP"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-green-700 text-center">
                    ماساژ ترکیبی VIP
                  </h3>
                  <div className="text-center text-sm text-gray-600 mb-4">
                    ترکیبی منحصر به فرد از بهترین تکنیک‌های ماساژ شامل:
                  </div>
                  <ul className="list-none p-0 m-0 text-gray-700 text-sm space-y-1">
                    <li className="flex items-start">
                      <span className="ml-2 text-green-500">•</span> ماساژ روسی
                    </li>
                    <li className="flex items-start">
                      <span className="ml-2 text-green-500">•</span> ماساژ سوئدی
                    </li>
                    <li className="flex items-start">
                      <span className="ml-2 text-green-500">•</span> ماساژ
                      تایلندی
                    </li>
                    <li className="flex items-start">
                      <span className="ml-2 text-green-500">•</span> ماساژ صورت
                    </li>
                    <li className="flex items-start">
                      <span className="ml-2 text-green-500">•</span> ماساژ
                      درمانی
                    </li>
                    <li className="flex items-start">
                      <span className="ml-2 text-green-500">•</span> ماساژ فشاری
                    </li>
                  </ul>
                </div>
                <div className="mt-6 text-center"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* You can add a section for Regular Services here if needed, similar to the VIP section but without "VIP" in the title/price */}
    </div>
  );
}
