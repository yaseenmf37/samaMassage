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

interface Database {
  timeSlots: TimeSlot[];
  bookings: Booking[];
}

const DB_FILE = path.join(process.cwd(), "db.json");

// خواندن داده‌ها از فایل
function readDB(): Database {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
      return {
        timeSlots: data.timeSlots || [],
        bookings: data.bookings || [],
      };
    }
  } catch (error) {
    console.error("Error reading database:", error);
  }
  return { timeSlots: [], bookings: [] };
}

// ذخیره داده‌ها در فایل
function writeDB(data: Database) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing to database:", error);
    throw error;
  }
}

// توابع کمکی برای مدیریت داده‌ها
export function addTimeSlot(date: string, time: string) {
  console.log("Adding time slot:", { date, time });
  const db = readDB();
  const newTimeSlot = { date, time };

  // بررسی تکراری نبودن
  const exists = db.timeSlots.some(
    (slot: TimeSlot) => slot.date === date && slot.time === time
  );

  if (exists) {
    console.log("Time slot already exists");
    return null;
  }

  db.timeSlots.push(newTimeSlot);
  writeDB(db);
  console.log("Time slot added successfully");
  return newTimeSlot;
}

export function removeTimeSlot(date: string, time: string) {
  console.log("Removing time slot:", { date, time });
  const db = readDB();
  const index = db.timeSlots.findIndex(
    (slot: TimeSlot) => slot.date === date && slot.time === time
  );

  if (index === -1) {
    console.log("Time slot not found");
    return false;
  }

  db.timeSlots.splice(index, 1);
  writeDB(db);
  console.log("Time slot removed successfully");
  return true;
}

export function addBooking(booking: Booking) {
  console.log("Adding booking:", booking);
  const db = readDB();

  // بررسی تکراری نبودن
  const exists = db.bookings.some(
    (b: Booking) => b.date === booking.date && b.time === booking.time
  );

  if (exists) {
    console.log("Booking already exists");
    return null;
  }

  db.bookings.push(booking);
  writeDB(db);
  console.log("Booking added successfully");
  return booking;
}

export function removeBooking(date: string, time: string) {
  console.log("Removing booking:", { date, time });
  const db = readDB();
  const index = db.bookings.findIndex(
    (booking: Booking) => booking.date === date && booking.time === time
  );

  if (index === -1) {
    console.log("Booking not found");
    return false;
  }

  db.bookings.splice(index, 1);
  writeDB(db);
  console.log("Booking removed successfully");
  return true;
}

export function getTimeSlots() {
  console.log("Getting time slots");
  return readDB().timeSlots;
}

export function getBookings() {
  console.log("Getting bookings");
  return readDB().bookings;
}

// تابع کمکی برای تبدیل تاریخ به فرمت استاندارد
export function standardizeDate(date: string): string {
  try {
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
