import React from "react";

const Servises = () => {
  const services = [
    {
      id: 1,
      title: "ماساژ ترکیبی VIP",
      description:
        "ترکیبی منحصر به فرد از بهترین تکنیک‌های ماساژ شامل:\n• ماساژ روسی\n• ماساژ سوئدی\n• ماساژ تایلندی\n• ماساژ صورت\n• ماساژ درمانی\n• ماساژ فشاری",
      image: "/img.png",
      price: "1,000,000 تومان",
    },
    {
      id: 2,
      title: "ماساژ سنگ داغ VIP",
      description:
        "ماساژ درمانی با سنگ‌های داغ برای:\n• ریلکسیشن عمیق بدن\n• درمان سیاتیک و دیسک\n• رفع اسپاسم و گرفتگی عضلات\n• درمان تریگر پوینت\n• کاهش دردهای عضلانی",
      image: "/img.png",
      price: "1,200,000 تومان",
    },
    {
      id: 3,
      title: "ماساژ بادکش VIP",
      description:
        "ماساژ درمانی با بادکش برای:\n• کاهش دردهای عضلانی\n• رفع التهاب\n• درمان گرفتگی عضلات\n• بهبود گردش خون\n• دفع سموم بدن",
      image: "/img.png",
      price: "1,100,000 تومان",
    },
    {
      id: 4,
      title: "ماساژ نمک درمانی VIP",
      description:
        "ماساژ درمانی با نمک برای:\n• درمان مشکلات پوستی\n• تسکین استرس و اضطراب\n• پاکسازی پوست\n• جوانسازی پوست\n• ریلکسیشن عمیق",
      image: "/img.png",
      price: "1,300,000 تومان",
    },
  ];

  return (
    <div className="w-full py-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
        سرویس‌های ماساژ VIP
      </h2>
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
              {/* <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                {service.price}
              </div> */}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {service.title}
              </h3>
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
