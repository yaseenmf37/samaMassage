import axios from "axios";
import { useState, useEffect } from "react";
import InputField from "./InputField";
import RadioGroup from "./RadioGroup";
import { validateName, validatePhone } from "./utils";
// import DateObject from "date-object";
import DateObject from "react-date-object";

export default function BookingForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    gender: "زن",
    massageType: "ریلکسی",
    date: "",
    time: "",
  });
  const [dateObj, setDateObj] = useState(null);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [availableDays, setAvailableDays] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [allSlots, setAllSlots] = useState([]);

  useEffect(() => {
    async function fetchSlots() {
      try {
        const endpoint =
          "https://v1.nocodeapi.com/hirad_code/google_sheets/KxyYWWEQsUFfClqY?tabId=Sheet2";
        const res = await axios.get(endpoint);
        // فرض: اولین ردیف هدر است
        const rows = res.data.data;
        console.log("rows from sheet:", rows); // لاگ ردیف‌ها
        const slots = rows.map((row) => ({
          date: row["date"],
          time: row["time"],
        }));
        console.log("slots:", slots); // لاگ اسلات‌ها
        setAllSlots(slots);
        // تاریخ‌های یکتا
        const uniqueDates = [...new Set(slots.map((s) => s.date))];
        setAvailableDays(uniqueDates);
      } catch (err) {
        setAvailableDays([]);
      }
    }
    fetchSlots();
  }, []);

  // وقتی تاریخ انتخاب شد، ساعت‌های مجاز همان تاریخ را پیدا کن
  useEffect(() => {
    if (!form.date) {
      setAvailableTimes([]);
      return;
    }
    const times = allSlots
      .filter((s) => s.date === form.date)
      .map((s) => s.time);
    setAvailableTimes(times);
  }, [form.date, allSlots]);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // اعتبارسنجی
    const newErrors = {};
    if (!validateName(form.name)) newErrors.name = "نام معتبر نیست.";
    if (!validatePhone(form.phone))
      newErrors.phone = "شماره موبایل معتبر نیست.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const endpoint =
        "https://v1.nocodeapi.com/hirad_code/google_sheets/OCYcMVSbTPlthojY?tabId=Sheet1";

      await axios.post(endpoint, [
        [
          form.name,
          form.phone,
          form.gender,
          form.massageType,
          form.date,
          form.time,
          new Date().toLocaleString("fa-IR"),
        ],
      ]);

      alert("رزرو با موفقیت ثبت شد!");
      setForm({
        name: "",
        phone: "",
        gender: "زن",
        massageType: "ریلکسی",
        date: "",
        time: "",
      });
    } catch (error) {
      alert("خطا در ارسال اطلاعات. لطفاً دوباره تلاش کنید.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const massageOptions = [
    { label: "ریلکسی", price: 850000, prepay: 200000 },
    { label: "VIP", price: 1000000, prepay: 200000 },
  ];

  // تابع تبدیل اعداد به فارسی
  function toPersianDigits(str) {
    return str.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
  }

  // آرایه ماه‌های فارسی
  const persianMonths = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];

  function getNext15Days() {
    const days = [];
    let date = new Date();
    let added = 0;
    const formatter = new Intl.DateTimeFormat("fa-IR", { dateStyle: "full" });
    while (added < 15) {
      // جمعه = 5 در تقویم fa-IR (شنبه=0)
      if (date.getDay() !== 5) {
        days.push({
          value: date.toLocaleDateString("fa-IR"),
          label: formatter.format(date),
        });
        added++;
      }
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        label="نام و نام خانوادگی"
        value={form.name}
        onChange={(val) => handleChange("name", val)}
        error={errors.name}
      />

      <InputField
        label="شماره موبایل"
        value={form.phone}
        onChange={(val) => handleChange("phone", val)}
        error={errors.phone}
      />

      <RadioGroup
        label="جنسیت"
        name="gender"
        options={["زن", "مرد"]}
        selected={form.gender}
        onChange={(val) => handleChange("gender", val)}
      />

      <div className="text-green-700 text-sm mb-2">
        {form.gender === "زن"
          ? "ماساژِست شما خانم است."
          : "ماساژِست شما آقاست."}
      </div>

      <RadioGroup
        label="نوع ماساژ"
        name="massageType"
        options={massageOptions.map((opt) => opt.label)}
        selected={form.massageType}
        onChange={(val) => handleChange("massageType", val)}
      />

      <select
        className="w-full border rounded-xl p-2"
        value={form.date}
        onChange={(e) => handleChange("date", e.target.value)}
        required
      >
        <option value="">انتخاب تاریخ</option>
        {availableDays.map((date) => (
          <option key={date} value={date}>
            {date}
          </option>
        ))}
      </select>

      <select
        className="w-full border rounded-xl p-2"
        value={form.time}
        onChange={(e) => handleChange("time", e.target.value)}
        required
      >
        <option value="">انتخاب ساعت</option>
        {availableTimes.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>

      <div className="bg-gray-100 rounded-xl p-3 text-center">
        {(() => {
          const selected = massageOptions.find(
            (opt) => opt.label === form.massageType
          );
          if (!selected) return null;
          return (
            <>
              <div>قیمت: {selected.price.toLocaleString()} تومان</div>
              <div>پیش‌پرداخت: {selected.prepay.toLocaleString()} تومان</div>
            </>
          );
        })()}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl"
      >
        {loading ? "در حال ارسال..." : "ثبت رزرو"}
      </button>
    </form>
  );
}
