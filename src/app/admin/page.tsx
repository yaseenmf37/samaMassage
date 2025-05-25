"use client"; // این خط برای استفاده از State و Effect در کامپوننت‌های کلاینت لازم است

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

interface TimeSlot {
  date: string;
  time: string;
}

export default function AdminPanel() {
  const [dateInput, setDateInput] = useState("");
  const [timeInput, setTimeInput] = useState("");
  const [message, setMessage] = useState("");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [bookings, setBookings] = useState<TimeSlot[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchTimeSlots();
    fetchBookings();
  }, []);

  const fetchTimeSlots = async () => {
    try {
      const response = await fetch("/api/admin/time-slots");
      if (response.ok) {
        const data = await response.json();
        setTimeSlots(data.timeSlots);
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/admin/bookings");
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleAddTimeSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!dateInput || !timeInput) {
      setMessage("لطفاً تاریخ و ساعت را وارد کنید");
      return;
    }

    try {
      const response = await fetch("/api/admin/time-slots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date: dateInput, time: timeInput }),
      });

      if (response.ok) {
        setMessage("زمان با موفقیت اضافه شد");
        setDateInput("");
        setTimeInput("");
        fetchTimeSlots();
      } else {
        const data = await response.json();
        setMessage(data.error || "خطا در افزودن زمان");
      }
    } catch (error) {
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
        setMessage("زمان با موفقیت حذف شد");
        fetchTimeSlots();
      } else {
        const data = await response.json();
        setMessage(data.error || "خطا در حذف زمان");
      }
    } catch (error) {
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
        setMessage("رزرو با موفقیت حذف شد");
        fetchBookings();
      } else {
        const data = await response.json();
        setMessage(data.error || "خطا در حذف رزرو");
      }
    } catch (error) {
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
                value={dateInput}
                onChange={(date) => {
                  if (date) {
                    const formattedDate = date.format("YYYY/MM/DD");
                    setDateInput(formattedDate);
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
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
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
