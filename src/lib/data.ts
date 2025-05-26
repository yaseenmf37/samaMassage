import lowdb from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
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

// تنظیم دیتابیس
const adapter = new FileSync(path.join(process.cwd(), "db.json"));
const db = lowdb(adapter);

// مقداردهی اولیه دیتابیس
db.defaults({ timeSlots: [], bookings: [] }).write();

// توابع کمکی برای مدیریت داده‌ها
export function addTimeSlot(date: string, time: string) {
  console.log("Adding time slot:", { date, time });
  const timeSlots = db.get("timeSlots").value();
  const newTimeSlot = { date, time };

  // بررسی تکراری نبودن
  const exists = timeSlots.some(
    (slot: TimeSlot) => slot.date === date && slot.time === time
  );

  if (exists) {
    console.log("Time slot already exists");
    return null;
  }

  db.get("timeSlots").push(newTimeSlot).write();
  console.log("Time slot added successfully");
  return newTimeSlot;
}

export function removeTimeSlot(date: string, time: string) {
  console.log("Removing time slot:", { date, time });
  const timeSlots = db.get("timeSlots").value();
  const index = timeSlots.findIndex(
    (slot: TimeSlot) => slot.date === date && slot.time === time
  );

  if (index === -1) {
    console.log("Time slot not found");
    return false;
  }

  db.get("timeSlots").splice(index, 1).write();
  console.log("Time slot removed successfully");
  return true;
}

export function addBooking(booking: Booking) {
  console.log("Adding booking:", booking);
  const bookings = db.get("bookings").value();

  // بررسی تکراری نبودن
  const exists = bookings.some(
    (b: Booking) => b.date === booking.date && b.time === booking.time
  );

  if (exists) {
    console.log("Booking already exists");
    return null;
  }

  db.get("bookings").push(booking).write();
  console.log("Booking added successfully");
  return booking;
}

export function removeBooking(date: string, time: string) {
  console.log("Removing booking:", { date, time });
  const bookings = db.get("bookings").value();
  const index = bookings.findIndex(
    (booking: Booking) => booking.date === date && booking.time === time
  );

  if (index === -1) {
    console.log("Booking not found");
    return false;
  }

  db.get("bookings").splice(index, 1).write();
  console.log("Booking removed successfully");
  return true;
}

export function getTimeSlots() {
  console.log("Getting time slots");
  return db.get("timeSlots").value();
}

export function getBookings() {
  console.log("Getting bookings");
  return db.get("bookings").value();
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
