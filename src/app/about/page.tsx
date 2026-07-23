import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "درباره ما",
  description:
    "آشنایی با سما ماساژ در گرگان؛ مرکز تخصصی ماساژ و مراقبت‌های زیبایی با متخصصان دارای مدرک رسمی، فعال از سال ۱۴۰۳ با ۱۸ مدرک تخصصی و اتاق‌های خصوصی.",
  alternates: { canonical: "/about" },
};

const highlights = [
  {
    icon: "📅",
    title: `فعالیت از سال ${site.since}`,
    text: "شروع حرفه‌ای خدمات ماساژ و زیبایی در گرگان با هدف تجربه‌ای متفاوت از آرامش.",
  },
  {
    icon: "🎓",
    title: `${site.certificates.toLocaleString("fa-IR")} مدرک رسمی تخصصی`,
    text: "تعهد همیشگی به آموزش، تخصص و به‌روز بودن خدمات.",
  },
  {
    icon: "🌍",
    title: "متخصصان بین‌المللی",
    text: "بهره‌گیری از مدرک‌داران رسمی از ایران و کشورهایی مانند گرجستان.",
  },
  {
    icon: "🔒",
    title: "اتاق‌های خصوصی",
    text: "ارائه‌ی خدمات در محیطی کاملاً آرام، خصوصی و اختصاصی.",
  },
  {
    icon: "🧼",
    title: "بهداشت کامل",
    text: "رعایت دقیق اصول نظافت، تجهیزات مناسب و روغن‌های استاندارد.",
  },
  {
    icon: "🤝",
    title: "ماساژور هم‌جنس",
    text: "بانوان توسط ماساژور خانم و آقایان توسط ماساژور آقا پذیرش می‌شوند.",
  },
];

const services = [
  "انواع ماساژ تخصصی و درمانی",
  "ماساژ ریلکسی",
  "ماساژ سنگ داغ",
  "خدمات مراقبت پوست",
  "مانیکور",
  "پدیکور",
  "خدمات اختصاصی در اتاق‌های خصوصی",
];

export default function About() {
  return (
    <div className="text-forest-900">
      {/* ===== HEADER ===== */}
      <section className="bg-gradient-to-b from-sand/70 to-cream py-16">
        <div className="container-x text-center">
          <span className="eyebrow">درباره سما ماساژ</span>
          <h1 className="section-title !text-4xl sm:!text-5xl">
            آرامش، تخصص و تجربه در کنار شما
          </h1>
          <p className="mt-5 text-forest-900/70 leading-8 max-w-2xl mx-auto">
            سما ماساژ یک مجموعه‌ی تخصصی خدمات ماساژ و مراقبت‌های زیبایی در گرگان
            است که فعالیت حرفه‌ای خود را از سال {site.since} آغاز کرده است.
          </p>
        </div>
      </section>

      {/* ===== INTRO PROSE ===== */}
      <section className="py-16">
        <div className="container-x max-w-3xl mx-auto space-y-5 text-forest-900/80 leading-8 text-justify">
          <p>
            سما ماساژ با هدف ایجاد تجربه‌ای متفاوت از آرامش، سلامت و مراقبت شخصی
            فعالیت می‌کند. در این مجموعه علاوه بر ارائه‌ی انواع ماساژ تخصصی شامل
            ماساژ درمانی، ریلکسی و سنگ داغ، خدماتی مانند مانیکور، پدیکور و مراقبت
            از پوست نیز ارائه می‌شود تا مراجعه‌کنندگان در محیطی آرام و حرفه‌ای به
            مراقبت از خود بپردازند.
          </p>
          <p>
            این مجموعه با بهره‌گیری از متخصصان دارای مدارک رسمی از ایران و
            کشورهای مختلف مانند گرجستان، تلاش می‌کند بالاترین سطح کیفیت و
            استاندارد را در خدمات خود ارائه دهد. سما ماساژ تاکنون دارای{" "}
            {site.certificates.toLocaleString("fa-IR")} مدرک رسمی تخصصی در
            زمینه‌های مرتبط بوده و همواره
            بر آموزش، تخصص و به‌روز بودن خدمات تأکید دارد.
          </p>
          <p>
            بهداشت، آرامش و رضایت مشتری اولویت اصلی ماست. استفاده از تجهیزات
            مناسب، رعایت کامل اصول نظافت، محیط خصوصی و آرام، روغن‌های مناسب و
            مشاوره پیش از انجام خدمات باعث شده رضایت مراجعه‌کنندگان در سطحی بسیار
            بالا قرار داشته باشد.
          </p>
          <p className="text-forest-700 font-semibold">
            هدف ما این است که هر مراجعه‌کننده پس از حضور در مجموعه، احساس آرامش،
            انرژی مثبت و رضایت کامل را تجربه کند.
          </p>
        </div>
      </section>

      {/* ===== HIGHLIGHTS ===== */}
      <section className="py-16 bg-sand/60">
        <div className="container-x">
          <div className="text-center mb-14">
            <span className="eyebrow">چرا سما ماساژ؟</span>
            <h2 className="section-title">تعهد ما به کیفیت و آرامش شما</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((h) => (
              <div
                key={h.title}
                className="card p-7 text-center transition-transform duration-300 hover:-translate-y-1.5"
              >
                <div className="text-4xl mb-4">{h.icon}</div>
                <h3 className="text-lg font-bold text-forest-700 mb-2">
                  {h.title}
                </h3>
                <p className="text-forest-900/70 text-sm leading-7">{h.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="py-16">
        <div className="container-x">
          <div className="text-center mb-12">
            <span className="eyebrow">خدمات ما</span>
            <h2 className="section-title">آنچه در سما ماساژ ارائه می‌دهیم</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {services.map((s) => (
              <div
                key={s}
                className="card flex items-center gap-3 p-5 text-forest-900/80"
              >
                <span className="text-gold-dark text-xl">✦</span>
                <span className="font-semibold">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INFO + CTA ===== */}
      <section className="py-16 bg-sand/60">
        <div className="container-x">
          <div className="card p-8 sm:p-10 max-w-3xl mx-auto border-t-4 border-gold">
            <div className="grid sm:grid-cols-2 gap-6 text-forest-900/80">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📍</span>
                <div>
                  <div className="font-bold text-forest-700 mb-1">آدرس</div>
                  <p className="leading-7">{site.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">⏰</span>
                <div>
                  <div className="font-bold text-forest-700 mb-1">ساعت کاری</div>
                  <p className="leading-7">
                    {site.hours} (بر اساس زمان‌های رزرو شده)
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Link href="/#booking" className="btn-primary text-lg">
                رزرو آنلاین نوبت
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
