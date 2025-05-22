import { useState, useEffect } from "react";
import InputField from "./InputField";
import RadioGroup from "./RadioGroup";
import { validateName, validatePhone } from "./utils";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { bookingService } from "../../services/bookingService";

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
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [availableDays, setAvailableDays] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);

  // تایم‌های ثابت برای هر روز
  const availableTimeSlots = [
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
  ];

  // تولید تاریخ‌های 15 روز آینده
  useEffect(() => {
    const days = getNext15Days();
    setAvailableDays(days);
  }, []);

  // دریافت تایم‌های موجود برای تاریخ انتخاب شده
  useEffect(() => {
    async function fetchAvailableTimes() {
      if (!form.date) {
        setAvailableTimes([]);
        return;
      }
      try {
        const times = await bookingService.getAvailableTimes(form.date);
        setAvailableTimes(times);
      } catch (error) {
        toast.error("خطا در دریافت تایم‌های موجود");
        setAvailableTimes([]);
      }
    }

    fetchAvailableTimes();
  }, [form.date]);

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
      toast.error("خطا در ارسال اطلاعات. لطفاً دوباره تلاش کنید.");
      console.error(error);
      setLoading(false);
    }
  };

  const massageOptions = [
    { label: "ریلکسی", price: 850000, prepay: 200000 },
    { label: "VIP", price: 1000000, prepay: 200000 },
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
        {availableDays.map((day) => (
          <option key={day.value} value={day.value}>
            {day.label}
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
          را مطالعه کرده و می‌پذیرم
        </label>
      </div>
      {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
      >
        {loading ? "در حال پردازش..." : "ادامه و پرداخت"}
      </button>
    </form>
  );
}
