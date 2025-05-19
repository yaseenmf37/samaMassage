import React from "react";

const About = () => {
  return (
    <section
      id="about"
      className="bg-green-50 py-12 px-4 rounded-2xl my-10 max-w-6xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-center text-green-700 mb-10">
        درباره سما ماساژ
      </h2>

      <div className="flex flex-col md:flex-row items-center gap-10">
        <img
          src="../../public/img.png"
          alt="درباره ماساژ"
          className="w-40 h-40 rounded-xl object-cover shadow-md"
        />

        <div className="text-gray-700 text-justify leading-loose space-y-4">
          <p>
            در سما ماساژ، با تکیه بر تجربه و دانش حرفه‌ای، به شما کمک می‌کنیم تا
            استرس روزمره را از بین برده و حس آرامش و طراوت را به زندگی خود
            بازگردانید.
          </p>
          <p>
            خدمات ما شامل انواع ماساژ درمانی، ریلکسیشن، و تخصصی برای تمامی
            گروه‌های سنی می‌باشد. تمرکز ما بر کیفیت، احترام، و آرامش مشتریان
            است.
          </p>
          <p>
            ما از بهترین روغن‌ها و تکنیک‌های استاندارد روز دنیا استفاده می‌کنیم
            تا تجربه‌ای بی‌نظیر برایتان رقم بزنیم.
          </p>
        </div>
      </div>

      <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-orange-500 mb-2">
            محیط آرام و بهداشتی
          </h3>
          <p className="text-gray-600 text-sm">
            اتاق‌های ماساژ تمیز و مجهز برای آرامش کامل شما
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-orange-500 mb-2">
            ماساژورهای متخصص
          </h3>
          <p className="text-gray-600 text-sm">
            همکاری با افراد حرفه‌ای و آموزش‌دیده
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-orange-500 mb-2">
            رزرو آسان
          </h3>
          <p className="text-gray-600 text-sm">
            تنها با چند کلیک، وقت خود را انتخاب کنید
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
