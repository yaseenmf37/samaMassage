"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { TimeSlot } from "@/lib/data";
import { DEPOSIT_TOMAN } from "@/lib/site";

const benefits = [
  { icon: "😌", title: "کاهش استرس و اضطراب", text: "رهایی از تنش‌های فیزیکی و ذهنی و رسیدن به آرامشی عمیق." },
  { icon: "❤️", title: "بهبود گردش خون", text: "تحریک جریان خون و لنف برای اکسیژن‌رسانی بهتر و دفع سموم." },
  { icon: "💪", title: "تسکین دردهای عضلانی", text: "کاهش دردهای مزمن، اسپاسم و افزایش انعطاف‌پذیری بدن." },
  { icon: "😴", title: "کیفیت بهتر خواب", text: "کاهش تنش و کمک به خوابی عمیق‌تر و آرام‌تر." },
  { icon: "✨", title: "افزایش انرژی", text: "رفع خستگی و حس سرزندگی و شادابی در طول روز." },
  { icon: "🌸", title: "بهبود حال روحی", text: "ترشح هورمون‌های آرامش مثل سروتونین و اندورفین." },
];

const services = [
  {
    title: "ماساژ نمک درمانی VIP",
    desc: "درمان مشکلات پوستی، پاکسازی و جوانسازی پوست، ریلکسیشن عمیق.",
  },
  {
    title: "ماساژ بادکش VIP",
    desc: "کاهش دردهای عضلانی، رفع التهاب و بهبود گردش خون و دفع سموم.",
  },
  {
    title: "ماساژ سنگ داغ VIP",
    desc: "ریلکسیشن عمیق، درمان سیاتیک و دیسک، رفع اسپاسم و گرفتگی.",
  },
  {
    title: "ماساژ ترکیبی VIP",
    desc: "ترکیبی از تکنیک‌های روسی، سوئدی، تایلندی و درمانی در یک جلسه.",
  },
];

const testimonials = [
  { name: "مهسا ر.", text: "محیط فوق‌العاده آرام و ماساژور حرفه‌ای. بعد از یک هفته کاری سخت دقیقاً همون چیزی بود که لازم داشتم." },
  { name: "علی م.", text: "ماساژ سنگ داغش عالی بود، کمردردم خیلی بهتر شد. حتماً دوباره میام." },
  { name: "نگار ک.", text: "رزرو آنلاین خیلی راحت بود و دقیقاً سر وقت پذیرش شدم. کیفیت بی‌نظیر." },
];

export default function Home() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [message, setMessage] = useState("");
  const [selectedMassageType, setSelectedMassageType] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  useEffect(() => {
    if (selectedMassageType === "relaxing") setTotalPrice(850000);
    else if (selectedMassageType === "vip") setTotalPrice(1000000);
    else setTotalPrice(0);
  }, [selectedMassageType]);

  const fetchTimeSlots = async () => {
    try {
      const response = await fetch("/api/time-slots");
      if (response.ok) {
        const data = await response.json();
        setTimeSlots(data.timeSlots);
      }
    } catch {
      console.error("Error fetching time slots");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!selectedDate || !selectedTime || !selectedMassageType) {
      setMessage("لطفاً تاریخ، ساعت و نوع ماساژ را انتخاب کنید");
      return;
    }

    const name = (document.getElementById("name") as HTMLInputElement).value.trim();
    const phone = (document.getElementById("phone") as HTMLInputElement).value.trim();
    const gender =
      (document.querySelector('input[name="gender"]:checked') as HTMLInputElement)
        ?.value || "";

    if (!name || !phone) {
      setMessage("لطفاً نام و شماره موبایل را وارد کنید");
      return;
    }
    if (!gender) {
      setMessage("لطفاً جنسیت را انتخاب کنید");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate,
          time: selectedTime,
          massageType: selectedMassageType,
          name,
          phone,
          gender,
          notes: (document.getElementById("notes") as HTMLTextAreaElement).value,
        }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        // انتقال به درگاه پرداخت زرین‌پال
        window.location.href = data.url;
      } else {
        setMessage(data.error || "خطا در اتصال به درگاه پرداخت");
        setSubmitting(false);
      }
    } catch {
      setMessage("خطا در ارتباط با سرور");
      setSubmitting(false);
    }
  };

  const filteredTimeSlots = timeSlots.filter((s) => s.date === selectedDate);
  const uniqueDates = Array.from(new Set(timeSlots.map((s) => s.date)));

  return (
    <div className="text-forest-900">
      {/* ===== HERO ===== */}
      <section className="relative w-full h-[88vh] min-h-[560px] flex items-center">
        <Image
          src="/massage.png"
          alt="مرکز تخصصی ماساژ سما"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-hero-fade" />
        <div className="container-x relative z-10">
          <div className="max-w-2xl animate-fade-up">
            <span className="inline-block bg-gold/90 text-forest-900 font-bold px-4 py-1.5 rounded-full text-sm mb-5">
              🌿 مرکز تخصصی ماساژ و آرامش
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
              آرامشی عمیق برای
              <br />
              جسم و روح شما
            </h1>
            <p className="mt-6 text-lg text-cream/90 leading-8 max-w-xl">
              با کادری حرفه‌ای و محیطی دلنشین، بهترین تجربه‌ی ماساژ را در سما رقم
              بزنید. همین حالا نوبت خود را آنلاین رزرو کنید.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="#booking" className="btn-gold text-lg">
                رزرو آنلاین نوبت
              </Link>
              <Link href="#services" className="btn-outline !bg-white/10 !text-white !border-white/40 text-lg">
                مشاهده خدمات
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="bg-forest-700 text-white">
        <div className="container-x grid grid-cols-2 md:grid-cols-4 gap-6 py-10 text-center">
          {[
            { n: "+۵۰۰۰", l: "مشتری راضی" },
            { n: "۱۸", l: "مدرک تخصصی" },
            { n: "۷", l: "روز هفته باز" },
            { n: "۴", l: "سبک ماساژ VIP" },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-3xl font-extrabold text-gold-light">{s.n}</div>
              <div className="text-forest-100 text-sm mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== BENEFITS ===== */}
      <section className="py-20">
        <div className="container-x">
          <div className="text-center mb-14">
            <span className="eyebrow">چرا ماساژ درمانی؟</span>
            <h2 className="section-title">فواید شگفت‌انگیز ماساژ برای شما</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="card p-7 text-center transition-transform duration-300 hover:-translate-y-1.5"
              >
                <div className="text-4xl mb-4">{b.icon}</div>
                <h3 className="text-lg font-bold text-forest-700 mb-2">
                  {b.title}
                </h3>
                <p className="text-forest-900/70 text-sm leading-7">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section id="services" className="py-20 bg-sand/60">
        <div className="container-x">
          <div className="text-center mb-14">
            <span className="eyebrow">خدمات ما</span>
            <h2 className="section-title">انواع سرویس‌های ماساژ سما</h2>
            <p className="mt-4 text-forest-900/70">
              هر جلسه‌ی VIP با قیمت{" "}
              <span className="font-bold text-forest-700">۱٬۰۰۰٬۰۰۰ تومان</span>
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => (
              <div key={s.title} className="card overflow-hidden flex flex-col group">
                <div className="relative w-full h-44">
                  <Image
                    src="/massage.png"
                    alt={s.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className="absolute top-3 left-3 bg-gold text-forest-900 text-xs font-bold px-3 py-1 rounded-full">
                    VIP
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-forest-700 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-forest-900/70 text-sm leading-7 flex-grow">
                    {s.desc}
                  </p>
                  <Link
                    href="#booking"
                    className="mt-5 btn-primary !py-2 text-sm w-full"
                  >
                    رزرو این سرویس
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BOOKING ===== */}
      <section id="booking" className="py-20">
        <div className="container-x">
          <div className="text-center mb-12">
            <span className="eyebrow">رزرو نوبت</span>
            <h2 className="section-title">رزرو آنلاین وقت ماساژ</h2>
            <p className="mt-4 text-forest-900/70">
              فرم زیر را پر کنید و نوبت خود را در چند ثانیه ثبت کنید.
            </p>
          </div>

          <div className="card p-6 sm:p-10 max-w-3xl mx-auto border-t-4 border-gold">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block font-semibold mb-2">
                    نام و نام خانوادگی
                  </label>
                  <input id="name" type="text" className="field" placeholder="نام کامل شما" />
                </div>
                <div>
                  <label htmlFor="phone" className="block font-semibold mb-2">
                    شماره موبایل
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className="field"
                    placeholder="۰۹۱۲ ۱۲۳ ۴۵۶۷"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2">جنسیت</label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { v: "female", l: "خانم" },
                    { v: "male", l: "آقا" },
                  ].map((g) => (
                    <label
                      key={g.v}
                      className="flex-1 min-w-[120px] cursor-pointer rounded-xl border border-forest-200 px-4 py-3 text-center has-[:checked]:bg-forest-600 has-[:checked]:text-white has-[:checked]:border-forest-600 transition-colors"
                    >
                      <input type="radio" name="gender" value={g.v} className="hidden" />
                      {g.l}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2">نوع ماساژ</label>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { v: "relaxing", l: "ماساژ ریلکسی", p: "۸۵۰٬۰۰۰ تومان" },
                    { v: "vip", l: "ماساژ وی‌آی‌پی (VIP)", p: "۱٬۰۰۰٬۰۰۰ تومان" },
                  ].map((m) => (
                    <label
                      key={m.v}
                      className="cursor-pointer rounded-xl border border-forest-200 px-4 py-4 flex items-center justify-between has-[:checked]:bg-forest-50 has-[:checked]:border-forest-500 transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="massageType"
                          value={m.v}
                          required
                          onChange={(e) => setSelectedMassageType(e.target.value)}
                          className="accent-forest-600 w-5 h-5"
                        />
                        <span className="font-semibold">{m.l}</span>
                      </span>
                      <span className="text-sm text-gold-dark font-bold">{m.p}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="date" className="block font-semibold mb-2">
                    تاریخ رزرو
                  </label>
                  <select
                    id="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedTime("");
                    }}
                    className="field"
                    required
                  >
                    <option value="">تاریخ را انتخاب کنید</option>
                    {uniqueDates.map((date) => (
                      <option key={date} value={date}>
                        {date}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="time" className="block font-semibold mb-2">
                    ساعت رزرو
                  </label>
                  <select
                    id="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="field"
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
              </div>

              {uniqueDates.length === 0 && (
                <p className="text-center text-sm text-gold-dark bg-gold/10 rounded-xl py-3">
                  در حال حاضر زمان آزادی برای رزرو ثبت نشده. لطفاً بعداً مراجعه کنید
                  یا با ما تماس بگیرید.
                </p>
              )}

              <div>
                <label htmlFor="notes" className="block font-semibold mb-2">
                  توضیحات (اختیاری)
                </label>
                <textarea id="notes" rows={3} className="field" placeholder="اگر نکته‌ای هست بنویسید..." />
              </div>

              {message && (
                <p className="text-center text-sm text-red-600 bg-red-50 rounded-xl py-3">
                  {message}
                </p>
              )}

              <div className="rounded-2xl bg-cream/70 p-5 text-center">
                <p className="text-forest-900/70 text-sm mb-1">
                  مبلغ پیش‌پرداخت:{" "}
                  <span className="font-bold">
                    {DEPOSIT_TOMAN.toLocaleString("fa-IR")} تومان
                  </span>
                </p>
                <p className="mb-4">
                  {totalPrice ? (
                    <span className="text-lg font-extrabold text-forest-700">
                      مبلغ کل: {totalPrice.toLocaleString("fa-IR")} تومان
                    </span>
                  ) : (
                    <span className="text-gold-dark">لطفاً نوع ماساژ را انتخاب کنید</span>
                  )}
                </p>
                <button
                  type="submit"
                  className="btn-primary text-lg w-full sm:w-auto"
                  disabled={!selectedMassageType || submitting}
                >
                  {submitting
                    ? "در حال انتقال به درگاه..."
                    : "تایید و پرداخت پیش‌پرداخت"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 bg-sand/60">
        <div className="container-x">
          <div className="text-center mb-14">
            <span className="eyebrow">نظرات مشتریان</span>
            <h2 className="section-title">آن‌ها به ما اعتماد کرده‌اند</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card p-7">
                <div className="text-gold text-2xl mb-3">★★★★★</div>
                <p className="text-forest-900/80 leading-8 mb-5">«{t.text}»</p>
                <p className="font-bold text-forest-700">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20">
        <div className="container-x">
          <div className="rounded-4xl bg-forest-700 text-white p-10 sm:p-14 text-center shadow-soft">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              آماده‌ی یک تجربه‌ی آرامش‌بخش هستید؟
            </h2>
            <p className="text-forest-100 max-w-xl mx-auto mb-8">
              همین حالا نوبت خود را رزرو کنید و اجازه دهید حرفه‌ای‌های ما از شما
              پذیرایی کنند.
            </p>
            <Link href="#booking" className="btn-gold text-lg">
              رزرو نوبت
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
