import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "سوالات متداول",
  description:
    "پاسخ پرسش‌های رایج درباره‌ی رزرو نوبت، پیش‌پرداخت، مدت جلسه، محیط خصوصی، ماساژور هم‌جنس و نکات پیش و پس از ماساژ در سما ماساژ گرگان.",
  alternates: { canonical: "/faq" },
};

const faqs: { q: string; a: string }[] = [
  {
    q: "چگونه می‌توانم وقت رزرو کنم؟",
    a: "رزرو خدمات سما ماساژ از طریق سایت، تماس تلفنی و اینستاگرام امکان‌پذیر است.",
  },
  {
    q: "آیا برای رزرو نیاز به پرداخت اولیه وجود دارد؟",
    a: "بله، برای قطعی شدن رزرو نیاز به پرداخت پیش‌پرداخت وجود دارد و مبلغ باقی‌مانده پس از انجام خدمات به‌صورت نقدی، کارت یا کارت‌به‌کارت قابل پرداخت است.",
  },
  {
    q: "آیا امکان تغییر یا لغو زمان رزرو وجود دارد؟",
    a: "در صورت هماهنگی قبلی امکان تغییر زمان وجود دارد. لطفاً در صورت تغییر برنامه، زودتر اطلاع دهید تا نظم مجموعه حفظ شود.",
  },
  {
    q: "هر جلسه ماساژ چقدر زمان می‌برد؟",
    a: "زمان استاندارد هر جلسه معمولاً یک ساعت است، اما امکان رزرو زمان‌های بیشتر نیز وجود دارد.",
  },
  {
    q: "آیا ماساژور آقایان و بانوان جدا هستند؟",
    a: "بله، برای حفظ راحتی و آرامش مراجعه‌کنندگان، آقایان توسط ماساژور آقا و بانوان توسط ماساژور خانم خدمات دریافت می‌کنند.",
  },
  {
    q: "آیا محیط مجموعه خصوصی است؟",
    a: "بله، خدمات در محیطی آرام و اتاق‌های خصوصی انجام می‌شود.",
  },
  {
    q: "آیا قبل از مراجعه نیاز به رعایت نکات خاصی است؟",
    a: "رعایت بهداشت شخصی قبل از مراجعه اهمیت زیادی دارد تا تجربه‌ای بهتر و دلپذیرتر برای شما و مجموعه ایجاد شود.",
  },
  {
    q: "آیا افراد دارای بیماری خاص می‌توانند ماساژ دریافت کنند؟",
    a: "در صورت داشتن بیماری، شرایط خاص جسمی یا مصرف داروهای خاص، حتماً قبل از انجام ماساژ موضوع را با مجموعه در میان بگذارید تا از بروز مشکلات احتمالی جلوگیری شود.",
  },
  {
    q: "آیا خدمات فقط ماساژ است؟",
    a: "خیر، علاوه بر ماساژ، خدماتی مانند مانیکور، پدیکور و مراقبت‌های پوستی نیز ارائه می‌شود.",
  },
  {
    q: "آیا امکان رزرو گروهی وجود دارد؟",
    a: "بله، امکان رزرو برای تعداد نفرات مختلف وجود دارد، اما بهتر است از قبل هماهنگی انجام شود.",
  },
  {
    q: "آیا پارکینگ دارید؟",
    a: "امکان پارک در اطراف مجموعه وجود دارد، اما لطفاً برای زمان مراجعه، برنامه‌ریزی لازم را انجام دهید.",
  },
  {
    q: "آیا ماساژ درمانی جایگزین درمان پزشکی است؟",
    a: "خدمات ماساژ می‌تواند به بهبود آرامش، کاهش تنش‌های عضلانی و افزایش حس سلامت کمک کند، اما جایگزین تشخیص و درمان پزشکی نیست.",
  },
  {
    q: "بعد از ماساژ چه نکاتی را رعایت کنیم؟",
    a: "بعد از ماساژ بهتر است آب کافی مصرف کنید، کمی استراحت داشته باشید و اجازه دهید بدن شما از تأثیرات ماساژ بهره‌مند شود.",
  },
  {
    q: "اگر دیر به وقت رزرو شده برسیم چه می‌شود؟",
    a: "لطفاً برای احترام به زمان شما و سایر مراجعه‌کنندگان، در زمان تعیین‌شده حضور داشته باشید. تأخیر ممکن است باعث کاهش زمان ارائه خدمات شود.",
  },
];

function FaqStructuredData() {
  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export default function FAQ() {
  return (
    <div className="text-forest-900">
      <FaqStructuredData />

      {/* ===== HEADER ===== */}
      <section className="bg-gradient-to-b from-sand/70 to-cream py-16">
        <div className="container-x text-center">
          <span className="eyebrow">راهنمای مراجعه‌کنندگان</span>
          <h1 className="section-title !text-4xl sm:!text-5xl">سوالات متداول</h1>
          <p className="mt-5 text-forest-900/70 leading-8 max-w-2xl mx-auto">
            پاسخ پرسش‌های رایجی که ممکن است پیش از رزرو نوبت داشته باشید. اگر
            پاسخ سوالتان را پیدا نکردید، با ما در ارتباط باشید.
          </p>
        </div>
      </section>

      {/* ===== ACCORDION ===== */}
      <section className="py-16">
        <div className="container-x max-w-3xl mx-auto space-y-4">
          {faqs.map((f, i) => (
            <details
              key={i}
              className="card group p-0 overflow-hidden [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 font-bold text-forest-700 list-none">
                <span>{f.q}</span>
                <span className="text-gold-dark text-xl shrink-0 transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="px-5 pb-5 -mt-1 text-forest-900/75 leading-8">
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="pb-20">
        <div className="container-x">
          <div className="rounded-4xl bg-forest-700 text-white p-10 sm:p-14 text-center shadow-soft max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">
              هنوز سوالی دارید؟
            </h2>
            <p className="text-forest-100 max-w-xl mx-auto mb-8">
              همین حالا نوبت خود را رزرو کنید یا از راه‌های ارتباطی با ما در تماس
              باشید.
            </p>
            <Link href="/#booking" className="btn-gold text-lg">
              رزرو آنلاین نوبت
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
