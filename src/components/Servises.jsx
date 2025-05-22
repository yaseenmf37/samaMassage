import React from "react";

const Servises = () => {
  const services = [
    {
      id: 1,
      title: "ماساژ ترکیبی VIP",
      description:
        "ترکیبی منحصر به فرد از بهترین تکنیک‌های ماساژ شامل:\n• ماساژ روسی\n• ماساژ سوئدی\n• ماساژ تایلندی\n• ماساژ صورت\n• ماساژ درمانی\n• ماساژ فشاری",
      image: "/tarkibi.webp",
    },
    {
      id: 2,
      title: "ماساژ سنگ داغ VIP",
      description:
        "ماساژ درمانی با سنگ‌های داغ برای:\n• ریلکسیشن عمیق بدن\n• درمان سیاتیک و دیسک\n• رفع اسپاسم و گرفتگی عضلات\n• درمان تریگر پوینت\n• کاهش دردهای عضلانی",
      image: "/sang.webp",
    },
    {
      id: 3,
      title: "ماساژ بادکش VIP",
      description:
        "ماساژ درمانی با بادکش برای:\n• کاهش دردهای عضلانی\n• رفع التهاب\n• درمان گرفتگی عضلات\n• بهبود گردش خون\n• دفع سموم بدن",
      image: "/baad.jpg",
    },
    {
      id: 4,
      title: "ماساژ نمک درمانی VIP",
      description:
        "ماساژ درمانی با نمک برای:\n• درمان مشکلات پوستی\n• تسکین استرس و اضطراب\n• پاکسازی پوست\n• جوانسازی پوست\n• ریلکسیشن عمیق",
      image: "/namak.jpg",
    },
  ];

  const combinedServices = [
    {
      id: 1,
      title: "ماساژ ریلکسی VIP",
      description:
        "ماساژ آرامش‌بخش و ریلکسی برای:\n• کاهش استرس و اضطراب\n• بهبود کیفیت خواب\n• آرامش ذهن و بدن\n• رفع خستگی روزانه\n• افزایش انرژی مثبت\n• تجربه آرامش عمیق",
      image: "/relax.png",
    },
  ];

  return (
    <div className="w-full py-12 px-4">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-4 max-md:flex-col max-md:gap-8">
          <h2 className="text-4xl font-bold text-gray-800">
            سرویس‌های ماساژ VIP
          </h2>
          <div className="bg-green-50 px-6 py-2 rounded-full">
            <p className="text-green-600 font-bold text-xl">1,000,000 تومان</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105"
          >
            <div className="relative h-48">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {service.title}
                </h3>
              </div>
              <div className="text-gray-600 whitespace-pre-line">
                {service.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-20 mb-12">
        <div className="flex items-center justify-center gap-4 max-md:flex-col max-md:gap-8">
          <h2 className="text-4xl font-bold text-gray-800">
            سرویس ماساژ های ریلکسی
          </h2>
          <div className="bg-green-50 px-6 py-2 rounded-full">
            <p className="text-green-600 font-bold text-xl">850,000 تومان</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {combinedServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105"
          >
            <div className="relative h-48">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {service.title}
                </h3>
                <p className="text-green-600 font-semibold mt-2">
                  {service.price}
                </p>
              </div>
              <div className="text-gray-600 whitespace-pre-line">
                {service.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Servises;
