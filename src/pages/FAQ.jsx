import React, { useState } from "react";
import { useSpring, animated, config } from "react-spring";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "آیا قبل از ماساژ نیاز به آمادگی خاصی دارم؟",
      answer:
        "بله، توصیه می‌شود قبل از ماساژ:\n• حداقل 2 ساعت قبل از ماساژ غذای سنگین نخورید\n• دوش بگیرید و بدن خود را تمیز کنید\n• از مصرف الکل و دخانیات خودداری کنید\n• لباس راحت بپوشید",
    },
    {
      question: "چه افرادی نباید ماساژ بگیرند؟",
      answer:
        "در موارد زیر باید از ماساژ خودداری کنید:\n• تب بالا\n• بیماری‌های پوستی مسری\n• زخم‌های باز\n• شکستگی‌های اخیر\n• بارداری (در برخی موارد)\n• مشکلات قلبی شدید",
    },
    {
      question: "مدت زمان هر جلسه ماساژ چقدر است؟",
      answer:
        "مدت زمان ماساژ بسته به نوع آن متفاوت است:\n• ماساژ ریلکسی: 40 تا 45 دقیقه\n• ماساژ ترکیبی: 1 ساعته\n•",
    },
    {
      question: "آیا ماساژ درد دارد؟",
      answer:
        "ماساژ نباید دردناک باشد. در ماساژ درمانی ممکن است کمی فشار احساس کنید که طبیعی است، اما اگر درد شدید احساس کردید، حتماً به ماساژور اطلاع دهید.",
    },
    {
      question: "چه زمانی نباید ماساژ بگیرم؟",
      answer:
        "در این موارد از ماساژ خودداری کنید:\n• بلافاصله بعد از ورزش شدید\n• در صورت داشتن سرماخوردگی یا آنفولانزا\n• در صورت داشتن تب\n• در صورت مصرف داروهای خاص (با پزشک مشورت کنید)",
    },
    {
      question: "آیا نیاز به رزرو قبلی دارم؟",
      answer:
        "بله، برای اطمینان از در دسترس بودن ماساژور و زمان مورد نظر شما، حتماً از 24 ساعت قبل رزرو کنید.",
    },
  ];

  const FAQItem = ({ question, answer, index }) => {
    const isOpen = openIndex === index;

    const contentAnimation = useSpring({
      from: {
        maxHeight: 0,
        opacity: 0,
        transform: "translateY(-10px)",
      },
      to: {
        maxHeight: isOpen ? 500 : 0,
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? "translateY(0px)" : "translateY(-10px)",
      },
      config: {
        tension: 300,
        friction: 30,
        mass: 1,
      },
    });

    const arrowAnimation = useSpring({
      from: { transform: "rotate(0deg)" },
      to: { transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" },
      config: config.gentle,
    });

    return (
      <div className="rounded-lg shadow-md overflow-hidden mb-4 bg-white hover:shadow-lg transition-shadow duration-300">
        <button
          onClick={() => setOpenIndex(isOpen ? null : index)}
          className="w-full p-6 text-right flex items-center justify-between hover:bg-gray-50 transition-colors duration-300"
        >
          <animated.div
            style={arrowAnimation}
            className="text-green-600 text-sm"
          >
            ▼
          </animated.div>
          <h3 className="text-xl font-bold text-gray-800 flex-1 mr-4">
            {question}
          </h3>
        </button>
        <animated.div
          style={{
            ...contentAnimation,
            overflow: "hidden",
          }}
        >
          <div className="px-6 pb-6">
            <p className="text-gray-600 whitespace-pre-line">{answer}</p>
          </div>
        </animated.div>
      </div>
    );
  };

  return (
    <div className="w-full py-12 px-4 bg-gray-50 my-10 rounded-2xl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          سوالات متداول
        </h1>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
