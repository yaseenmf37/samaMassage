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

// خواندن داده‌ها از فایل
const readData = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
      return {
        timeSlots: data.timeSlots || [],
        bookings: data.bookings || [],
      };
    }
  } catch (error) {
    console.error("Error reading data file:", error);
  }
  return { timeSlots: [], bookings: [] };
};

// ذخیره داده‌ها در فایل
const saveData = (data: { timeSlots: TimeSlot[]; bookings: Booking[] }) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error saving data file:", error);
  }
};

// خواندن داده‌های اولیه
const { timeSlots, bookings } = readData();

// توابع کمکی برای مدیریت داده‌ها
export function addTimeSlot(date: string, time: string) {
  console.log("Adding time slot:", { date, time });
  timeSlots.push({ date, time });
  saveData({ timeSlots, bookings });
  console.log("Updated time slots:", timeSlots);
  return { date, time };
}

export function removeTimeSlot(date: string, time: string) {
  console.log("Removing time slot:", { date, time });
  const index = timeSlots.findIndex(
    (slot: TimeSlot) => slot.date === date && slot.time === time
  );
  if (index !== -1) {
    timeSlots.splice(index, 1);
    saveData({ timeSlots, bookings });
    console.log("Updated time slots after removal:", timeSlots);
    return true;
  }
  return false;
}

export function addBooking(booking: Booking) {
  console.log("Adding booking:", booking);
  // حذف زمان از لیست زمان‌های موجود
  removeTimeSlot(booking.date, booking.time);
  // اضافه کردن به لیست رزروها
  bookings.push(booking);
  saveData({ timeSlots, bookings });
  console.log("Updated bookings:", bookings);
  return booking;
}

export function getTimeSlots() {
  return timeSlots;
}

export function getBookings() {
  return bookings;
}

// Export the arrays
export { timeSlots, bookings };
