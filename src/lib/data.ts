import fs from "fs";
import path from "path";

export interface TimeSlot {
  date: string;
  time: string;
}

export interface Booking extends TimeSlot {
  massageType: string;
  name: string;
  phone: string;
  gender: string;
  notes?: string;
}

const DATA_FILE = path.join(process.cwd(), "data.json");

// تعریف آرایه‌های گلوبال برای زمان‌ها و رزروها
let globalTimeSlots: TimeSlot[] = [];
let globalBookings: Booking[] = [];

// خواندن داده‌ها از فایل هنگام شروع برنامه
const loadData = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
      globalTimeSlots = data.timeSlots || [];
      globalBookings = data.bookings || [];
      console.log("Data loaded from file.", {
        globalTimeSlots,
        globalBookings,
      });
    } else {
      console.log("Data file not found, starting with empty data.");
    }
  } catch (error) {
    console.error("Error loading data file:", error);
  }
};

// ذخیره داده‌ها در فایل
const saveData = () => {
  try {
    const dataToSave = { timeSlots: globalTimeSlots, bookings: globalBookings };
    fs.writeFileSync(DATA_FILE, JSON.stringify(dataToSave, null, 2));
    console.log("Data saved to file.");
  } catch (error) {
    console.error("Error saving data file:", error);
  }
};

// بارگذاری داده‌ها هنگام ایمپورت شدن ماژول
loadData();

// توابع کمکی برای مدیریت داده‌ها با استفاده از آرایه‌های گلوبال
export function addTimeSlot(date: string, time: string) {
  console.log("Adding time slot:", { date, time });
  globalTimeSlots.push({ date, time });
  saveData();
  console.log("Updated time slots:", globalTimeSlots);
  return { date, time };
}

export function removeTimeSlot(date: string, time: string) {
  console.log("Removing time slot:", { date, time });
  const index = globalTimeSlots.findIndex(
    (slot: TimeSlot) => slot.date === date && slot.time === time
  );
  if (index !== -1) {
    globalTimeSlots.splice(index, 1);
    saveData();
    console.log("Updated time slots after removal:", globalTimeSlots);
    return true;
  }
  return false;
}

export function addBooking(booking: Booking) {
  console.log("Adding booking:", booking);
  // استانداردسازی تاریخ و زمان
  const standardizedBooking = {
    ...booking,
    date: standardizeDate(booking.date),
    time: standardizeTime(booking.time),
  };
  globalBookings.push(standardizedBooking);
  saveData();
  console.log("Updated bookings:", globalBookings);
  return standardizedBooking;
}

export function removeBooking(date: string, time: string) {
  console.log("Removing booking:", { date, time });
  const index = globalBookings.findIndex(
    (booking: Booking) => booking.date === date && booking.time === time
  );
  if (index !== -1) {
    globalBookings.splice(index, 1);
    saveData();
    console.log("Updated bookings after removal:", globalBookings);
    return true;
  }
  return false;
}

export function getTimeSlots() {
  console.log("Getting time slots:", globalTimeSlots);
  return globalTimeSlots;
}

export function getBookings() {
  console.log("Getting bookings:", globalBookings);
  return globalBookings;
}

// تابع کمکی برای تبدیل تاریخ به فرمت استاندارد
export function standardizeDate(date: string): string {
  try {
    // تبدیل تاریخ شمسی به میلادی
    const [year, month, day] = date.split("/").map(Number);
    const persianDate = new Date(year, month - 1, day);
    return persianDate.toISOString().split("T")[0];
  } catch (error) {
    console.error("Error standardizing date:", error);
    return date;
  }
}

// تابع کمکی برای تبدیل زمان به فرمت استاندارد
export function standardizeTime(time: string): string {
  try {
    // اطمینان از فرمت 24 ساعته
    const [hours, minutes] = time.split(":").map(Number);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  } catch (error) {
    console.error("Error standardizing time:", error);
    return time;
  }
}

// Export the arrays (اختیاری، برای دسترسی مستقیم در صورت نیاز)
// export { globalTimeSlots as timeSlots, globalBookings as bookings };
