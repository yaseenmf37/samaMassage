"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { TimeSlot, Booking } from "@/lib/data";

const typeMap: Record<string, string> = {
  relaxing: "ریلکسی",
  vip: "وی‌آی‌پی (VIP)",
};
const genderMap: Record<string, string> = { female: "خانم", male: "آقا" };

export default function AdminPage() {
  const router = useRouter();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const flash = (m: string) => {
    setMessage(m);
    setTimeout(() => setMessage(""), 3000);
  };

  const fetchData = async () => {
    try {
      const [tsRes, bkRes] = await Promise.all([
        fetch("/api/admin/time-slots"),
        fetch("/api/admin/bookings"),
      ]);
      if (tsRes.ok && bkRes.ok) {
        const [tsData, bkData] = await Promise.all([tsRes.json(), bkRes.json()]);
        setTimeSlots(tsData.timeSlots);
        setBookings(bkData.bookings);
      }
    } catch {
      flash("خطا در دریافت اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTimeSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return flash("تاریخ و ساعت را وارد کنید");
    try {
      const res = await fetch("/api/admin/time-slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, time }),
      });
      if (res.ok) {
        setDate("");
        setTime("");
        fetchData();
        flash("✅ زمان اضافه شد");
      } else {
        const d = await res.json();
        flash(d.error || "خطا در افزودن زمان");
      }
    } catch {
      flash("خطا در ارتباط با سرور");
    }
  };

  const del = async (
    url: string,
    d: string,
    t: string,
    okMsg: string
  ) => {
    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: d, time: t }),
      });
      if (res.ok) {
        fetchData();
        flash(okMsg);
      } else flash("خطا در حذف");
    } catch {
      flash("خطا در ارتباط با سرور");
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  // گروه‌بندی زمان‌های آزاد بر اساس تاریخ
  const grouped = timeSlots.reduce<Record<string, string[]>>((acc, s) => {
    (acc[s.date] = acc[s.date] || []).push(s.time);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-cream pb-16">
      {/* نوار بالا */}
      <div className="bg-forest-700 text-white">
        <div className="container-x flex items-center justify-between py-5">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <h1 className="text-xl font-extrabold">پنل مدیریت سما ماساژ</h1>
          </div>
          <button
            onClick={logout}
            className="text-sm bg-white/15 hover:bg-white/25 rounded-full px-4 py-2 transition-colors"
          >
            خروج
          </button>
        </div>
      </div>

      <div className="container-x mt-8 space-y-8">
        {/* خلاصه */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card p-5 text-center">
            <div className="text-3xl font-extrabold text-forest-600">
              {timeSlots.length.toLocaleString("fa-IR")}
            </div>
            <div className="text-sm text-forest-900/60 mt-1">زمان آزاد</div>
          </div>
          <div className="card p-5 text-center">
            <div className="text-3xl font-extrabold text-gold-dark">
              {bookings.length.toLocaleString("fa-IR")}
            </div>
            <div className="text-sm text-forest-900/60 mt-1">رزرو ثبت‌شده</div>
          </div>
        </div>

        {/* افزودن زمان */}
        <div className="card p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            ➕ افزودن زمان جدید
          </h2>
          <form
            onSubmit={handleAddTimeSlot}
            className="grid sm:grid-cols-[1fr_1fr_auto] gap-4 items-end"
          >
            <div>
              <label className="block text-sm font-semibold mb-2">تاریخ</label>
              <DatePicker
                calendar={persian}
                locale={persian_fa}
                calendarPosition="bottom-right"
                value={date}
                onChange={(d) => {
                  if (d) setDate(d.format("YYYY/MM/DD"));
                }}
                inputClass="field"
                placeholder="انتخاب تاریخ"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">ساعت</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="field"
              />
            </div>
            <button type="submit" className="btn-primary h-[50px]">
              افزودن
            </button>
          </form>
        </div>

        {/* زمان‌های آزاد */}
        <div className="card p-6">
          <h2 className="text-lg font-bold mb-4">🟢 زمان‌های آزاد</h2>
          {loading ? (
            <p className="text-forest-900/50 text-center py-6">در حال بارگذاری...</p>
          ) : Object.keys(grouped).length === 0 ? (
            <p className="text-forest-900/50 text-center py-6">هیچ زمان آزادی نیست</p>
          ) : (
            <div className="space-y-5">
              {Object.entries(grouped).map(([d, times]) => (
                <div key={d}>
                  <div className="text-sm font-bold text-forest-600 mb-2">
                    📅 {d}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {times.map((t) => (
                      <button
                        key={t}
                        onClick={() =>
                          del("/api/admin/time-slots", d, t, "زمان حذف شد")
                        }
                        className="group flex items-center gap-2 rounded-full border border-forest-200 bg-forest-50 px-4 py-2 text-sm hover:bg-red-50 hover:border-red-300 transition-colors"
                        title="کلیک برای حذف"
                      >
                        <span>{t}</span>
                        <span className="text-red-500 opacity-60 group-hover:opacity-100">
                          ✕
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* رزروها */}
        <div className="card p-6">
          <h2 className="text-lg font-bold mb-4">🔴 رزروهای انجام‌شده</h2>
          {loading ? (
            <p className="text-forest-900/50 text-center py-6">در حال بارگذاری...</p>
          ) : bookings.length === 0 ? (
            <p className="text-forest-900/50 text-center py-6">هنوز رزروی ثبت نشده</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {bookings.map((b) => (
                <div
                  key={`${b.date}-${b.time}`}
                  className="rounded-2xl border border-forest-100 p-4 bg-cream/40"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-forest-700">
                      📅 {b.date} — {b.time}
                    </span>
                    <button
                      onClick={() =>
                        del("/api/admin/bookings", b.date, b.time, "رزرو حذف شد")
                      }
                      className="text-red-500 text-sm hover:text-red-700"
                    >
                      حذف
                    </button>
                  </div>
                  <div className="text-sm text-forest-900/75 space-y-1">
                    <div>👤 {b.name || "-"}</div>
                    <div dir="ltr" className="text-right">
                      📞 {b.phone || "-"}
                    </div>
                    <div>
                      💆 {typeMap[b.massageType] || b.massageType || "-"} ·{" "}
                      {genderMap[b.gender] || b.gender || "-"}
                    </div>
                    {b.notes && <div>📝 {b.notes}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* توست */}
      {message && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-forest-800 text-white px-6 py-3 rounded-full shadow-soft text-sm animate-fade-up">
          {message}
        </div>
      )}
    </div>
  );
}
