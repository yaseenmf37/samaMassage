import React from "react";

const MassageBenefits = () => {
  const benefits = [
    {
      title: "کاهش استرس",
      desc: "ماساژ باعث کاهش تنش‌های عضلانی و اضطراب می‌شود و به آرامش ذهنی کمک می‌کند.",
    },
    {
      title: "بهبود گردش خون",
      desc: "با تحریک جریان خون، مواد مغذی بهتر به عضلات می‌رسند و سموم سریع‌تر دفع می‌شوند.",
    },
    {
      title: "افزایش انعطاف‌پذیری",
      desc: "ماساژ عضلات را نرم کرده و دامنه حرکتی مفاصل را افزایش می‌دهد.",
    },
    {
      title: "کاهش دردهای مزمن",
      desc: "افراد با دردهای عضلانی یا اسکلتی مزمن، با ماساژ احساس بهبود و تسکین پیدا می‌کنند.",
    },
    {
      title: "بهبود خواب",
      desc: "ماساژ به تنظیم هورمون‌های خواب مانند ملاتونین کمک کرده و بی‌خوابی را کاهش می‌دهد.",
    },
    {
      title: "تقویت سیستم ایمنی",
      desc: "با کاهش استرس و بهبود جریان لنف، ماساژ موجب تقویت عملکرد سیستم ایمنی می‌شود.",
    },
  ];

  return (
    <section className="bg-[#d2ffe4c1] py-16 px-4 rounded-3xl">
      <h2 className="text-3xl font-bold text-green-700 text-center mb-12">
        فواید ماساژ برای بدن و ذهن
      </h2>
      <div className="space-y-16 max-w-6xl mx-auto">
        {benefits.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col md:flex-row ${
              index % 2 !== 0 ? "md:flex-row-reverse" : ""
            } items-center gap-6 md:gap-10`}
          >
            {/* تصویر */}
            <div className="w-36 h-36 flex-shrink-0 max-md:hidden">
              <img
                src="/img.png"
                alt="massage"
                className="rounded-xl w-full h-full object-cover"
              />
            </div>

            {/* متن */}
            <div className="bg-white shadow-lg rounded-2xl p-6 w-full">
              <h3 className="text-2xl text-green-700 font-semibold mb-3">
                {item.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MassageBenefits;
