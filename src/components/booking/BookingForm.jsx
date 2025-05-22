import axios from "axios";
import { useState, useEffect } from "react";
import InputField from "./InputField";
import RadioGroup from "./RadioGroup";
import { validateName, validatePhone } from "./utils";
// import DateObject from "date-object";
import DateObject from "react-date-object";
import { useNavigate } from "react-router-dom";

export default function BookingForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    gender: "زن",
    massageType: "ریلکسی",
    date: "",
    time: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
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
        const rows = res.data.data;

        // تبدیل داده‌ها به فرمت مورد نیاز
        const slots = rows.map((row) => ({
          date: row["date"],
          time: row["time"],
        }));

        setAllSlots(slots);

        // تاریخ‌های یکتا
        const uniqueDates = [...new Set(slots.map((s) => s.date))];
        setAvailableDays(uniqueDates);
      } catch (err) {
        console.error("Error fetching slots:", err);
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
      newErrors.phone = "شماره موبایل متغیر نیست. لطفا لاتین وارد کنید";
    if (!termsAccepted) newErrors.terms = "لطفاً قوانین را بپذیرید.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      // ذخیره اطلاعات در localStorage برای استفاده بعد از پرداخت
      const bookingData = {
        ...form,
        timestamp: new Date().toLocaleString("fa-IR"),
      };
      localStorage.setItem("pendingBooking", JSON.stringify(bookingData));

      // هدایت به درگاه پرداخت
      window.location.href = "https://zarinp.al/714162";
    } catch (error) {
      alert("خطا در ارسال اطلاعات. لطفاً دوباره تلاش کنید.");
      console.error(error);
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

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="terms"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="terms" className="text-sm">
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => setShowTermsModal(true)}
          >
            قوانین و مقررات
          </span>
          {" را مطالعه کرده و می‌پذیرم"}
        </label>
      </div>
      {errors.terms && (
        <div className="text-red-500 text-sm">{errors.terms}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl"
      >
        {loading ? "در حال ارسال..." : "ثبت رزرو"}
      </button>

      {/* مودال قوانین و مقررات */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">قوانین و مقررات</h3>
              <button
                onClick={() => setShowTermsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4 text-sm">
              <p>1. رزرو ماساژ فقط از طریق این وب‌سایت امکان‌پذیر است.</p>
              <p>2. حداقل 24 ساعت قبل از زمان رزرو باید ثبت‌نام انجام شود.</p>
              <p>
                3. در صورت کنسل کردن رزرو کمتر از 24 ساعت قبل از زمان تعیین شده،
                مبلغ پیش‌پرداخت قابل بازگشت نیست.
              </p>
              <p>4. لطفاً 15 دقیقه قبل از زمان رزرو در محل حضور داشته باشید.</p>
              <p>5. همراه داشتن کارت شناسایی الزامی است.</p>
              <p>6. رعایت بهداشت فردی و استفاده از حوله شخصی الزامی است.</p>
              <p>
                7. در صورت بروز هرگونه مشکل یا سوال، با پشتیبانی تماس بگیرید.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowTermsModal(false)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
