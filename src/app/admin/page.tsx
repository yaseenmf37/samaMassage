"use client"; // این خط برای استفاده از State و Effect در کامپوننت‌های کلاینت لازم است

import { useState, useEffect } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { TimeSlot, Booking } from "@/lib/data";

export default function AdminPage() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [timeSlotsRes, bookingsRes] = await Promise.all([
        fetch("/api/admin/time-slots"),
        fetch("/api/admin/bookings"),
      ]);

      if (timeSlotsRes.ok && bookingsRes.ok) {
        const [timeSlotsData, bookingsData] = await Promise.all([
          timeSlotsRes.json(),
          bookingsRes.json(),
        ]);
        setTimeSlots(timeSlotsData.timeSlots);
        setBookings(bookingsData.bookings);
      }
    } catch {
      setMessage("خطا در دریافت اطلاعات");
    }
  };

  const handleAddTimeSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!date || !time) {
      setMessage("لطفاً تاریخ و زمان را وارد کنید");
      return;
    }

    try {
      const response = await fetch("/api/admin/time-slots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date, time }),
      });

      if (response.ok) {
        setDate("");
        setTime("");
        fetchData();
        setMessage("زمان با موفقیت اضافه شد");
      } else {
        setMessage("خطا در اضافه کردن زمان");
      }
    } catch {
      setMessage("خطا در ارتباط با سرور");
    }
  };

  const handleDeleteTimeSlot = async (date: string, time: string) => {
    try {
      const response = await fetch("/api/admin/time-slots", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date, time }),
      });

      if (response.ok) {
        fetchData();
        setMessage("زمان با موفقیت حذف شد");
      } else {
        setMessage("خطا در حذف زمان");
      }
    } catch {
      setMessage("خطا در ارتباط با سرور");
    }
  };

  const handleDeleteBooking = async (date: string, time: string) => {
    try {
      const response = await fetch("/api/admin/bookings", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date, time }),
      });

      if (response.ok) {
        fetchData();
        setMessage("رزرو با موفقیت حذف شد");
      } else {
        setMessage("خطا در حذف رزرو");
      }
    } catch {
      setMessage("خطا در ارتباط با سرور");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          پنل مدیریت زمان‌های رزرو
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">افزودن زمان جدید</h2>
          <form onSubmit={handleAddTimeSlot} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">تاریخ:</label>
              <DatePicker
                calendar={persian}
                locale={persian_fa}
                calendarPosition="bottom-right"
                value={date}
                onChange={(date) => {
                  if (date) {
                    const formattedDate = date.format("YYYY/MM/DD");
                    setDate(formattedDate);
                  }
                }}
                inputClass="w-full px-4 py-2 border rounded-lg"
                placeholder="تاریخ را انتخاب کنید"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">ساعت:</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              افزودن زمان
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">زمان‌های موجود</h2>
          <div className="space-y-2">
            {timeSlots.map((slot) => (
              <div
                key={`${slot.date}-${slot.time}`}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <span>
                  {slot.date} - {slot.time}
                </span>
                <button
                  onClick={() => handleDeleteTimeSlot(slot.date, slot.time)}
                  className="text-red-600 hover:text-red-800"
                >
                  حذف
                </button>
              </div>
            ))}
            {timeSlots.length === 0 && (
              <p className="text-gray-500 text-center">هیچ زمانی موجود نیست</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">رزروهای انجام شده</h2>
          <div className="space-y-2">
            {bookings.map((booking) => (
              <div
                key={`${booking.date}-${booking.time}`}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <span>
                  {booking.date} - {booking.time}
                </span>
                <button
                  onClick={() =>
                    handleDeleteBooking(booking.date, booking.time)
                  }
                  className="text-red-600 hover:text-red-800"
                >
                  حذف
                </button>
              </div>
            ))}
            {bookings.length === 0 && (
              <p className="text-gray-500 text-center">
                هیچ رزروی انجام نشده است
              </p>
            )}
          </div>
        </div>

        {message && (
          <div className="mt-4 p-4 bg-blue-50 text-blue-700 rounded-lg text-center">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
