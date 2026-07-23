// ابزار تبدیل تاریخ میلادی <-> شمسی و تولید روزها بر اساس ساعت ایران
// الگوریتم تبدیل برگرفته از jalaali-js (MIT)

function div(a: number, b: number): number {
  return Math.floor(a / b);
}

export function gregorianToJalali(
  gy: number,
  gm: number,
  gd: number
): [number, number, number] {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy: number;
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    365 * gy +
    div(gy2 + 3, 4) -
    div(gy2 + 99, 100) +
    div(gy2 + 399, 400) +
    gd +
    g_d_m[gm - 1];
  jy = -1595 + 33 * div(days, 12053);
  days %= 12053;
  jy += 4 * div(days, 1461);
  days %= 1461;
  if (days > 365) {
    jy += div(days - 1, 365);
    days = (days - 1) % 365;
  }
  const jm = days < 186 ? 1 + div(days, 31) : 7 + div(days - 186, 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return [jy, jm, jd];
}

export function jalaliToGregorian(
  jy: number,
  jm: number,
  jd: number
): [number, number, number] {
  let gy: number;
  jy += 1595;
  let days =
    -355668 +
    365 * jy +
    div(jy, 33) * 8 +
    div((jy % 33) + 3, 4) +
    jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
  gy = 400 * div(days, 146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * div(--days, 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * div(days, 1461);
  days %= 1461;
  if (days > 365) {
    gy += div(days - 1, 365);
    days = (days - 1) % 365;
  }
  let gd = days + 1;
  const sal_a = [
    0,
    31,
    (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  let gm = 0;
  for (gm = 0; gm < 13; gm++) {
    const v = sal_a[gm];
    if (gd <= v) break;
    gd -= v;
  }
  return [gy, gm, gd];
}

export const JALALI_MONTHS = [
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

// شنبه تا جمعه
export const JALALI_WEEKDAYS = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
];

export function toPersianDigits(input: string | number): string {
  const s = String(input);
  const map: Record<string, string> = {
    "0": "۰",
    "1": "۱",
    "2": "۲",
    "3": "۳",
    "4": "۴",
    "5": "۵",
    "6": "۶",
    "7": "۷",
    "8": "۸",
    "9": "۹",
  };
  return s.replace(/[0-9]/g, (d) => map[d]);
}

export function toEnglishDigits(input: string): string {
  const map: Record<string, string> = {
    "۰": "0",
    "۱": "1",
    "۲": "2",
    "۳": "3",
    "۴": "4",
    "۵": "5",
    "۶": "6",
    "۷": "7",
    "۸": "8",
    "۹": "9",
    "٠": "0",
    "١": "1",
    "٢": "2",
    "٣": "3",
    "٤": "4",
    "٥": "5",
    "٦": "6",
    "٧": "7",
    "٨": "8",
    "٩": "9",
  };
  return input.replace(/[۰-۹٠-٩]/g, (d) => map[d] || d);
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

// فرمت استاندارد ذخیره‌سازی تاریخ: YYYY/MM/DD شمسی
export function formatJalali(jy: number, jm: number, jd: number): string {
  return `${jy}/${pad2(jm)}/${pad2(jd)}`;
}

// تاریخ کنونی به وقت ایران (تهران) به صورت میلادی
export function nowInIranGregorian(): {
  gy: number;
  gm: number;
  gd: number;
  hour: number;
  minute: number;
} {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(new Date());
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return {
    gy: get("year"),
    gm: get("month"),
    gd: get("day"),
    hour: get("hour") === 24 ? 0 : get("hour"),
    minute: get("minute"),
  };
}

// تاریخ امروز به شمسی (وقت ایران)
export function todayJalali(): { jy: number; jm: number; jd: number; value: string } {
  const { gy, gm, gd } = nowInIranGregorian();
  const [jy, jm, jd] = gregorianToJalali(gy, gm, gd);
  return { jy, jm, jd, value: formatJalali(jy, jm, jd) };
}

export interface JalaliDay {
  value: string; // 1403/05/20
  jy: number;
  jm: number;
  jd: number;
  weekday: string; // شنبه ...
  label: string; // شنبه ۲۰ مرداد
  shortLabel: string; // ۲۰ مرداد
}

// weekday index (0 = شنبه) از روی تاریخ میلادی
function jalaliWeekdayIndex(gy: number, gm: number, gd: number): number {
  // getUTCDay: 0=Sunday..6=Saturday ; استفاده از ظهر برای جلوگیری از خطای ساعت
  const jsDay = new Date(Date.UTC(gy, gm - 1, gd, 12, 0, 0)).getUTCDay();
  // Saturday(6) -> 0, Sunday(0) -> 1, ... Friday(5) -> 6
  return (jsDay + 1) % 7;
}

// تولید N روز آینده (شامل امروز) بر اساس وقت ایران
export function getNextDays(count: number): JalaliDay[] {
  const { gy, gm, gd } = nowInIranGregorian();
  const days: JalaliDay[] = [];
  const base = Date.UTC(gy, gm - 1, gd, 12, 0, 0);
  for (let i = 0; i < count; i++) {
    const d = new Date(base + i * 86400000);
    const cgy = d.getUTCFullYear();
    const cgm = d.getUTCMonth() + 1;
    const cgd = d.getUTCDate();
    const [jy, jm, jd] = gregorianToJalali(cgy, cgm, cgd);
    const wIdx = jalaliWeekdayIndex(cgy, cgm, cgd);
    const weekday = JALALI_WEEKDAYS[wIdx];
    const shortLabel = `${toPersianDigits(jd)} ${JALALI_MONTHS[jm - 1]}`;
    days.push({
      value: formatJalali(jy, jm, jd),
      jy,
      jm,
      jd,
      weekday,
      label: `${weekday} ${shortLabel}`,
      shortLabel,
    });
  }
  return days;
}

// تبدیل مقدار ذخیره‌شده تاریخ (YYYY/MM/DD شمسی) به برچسب خوانا
export function jalaliValueToLabel(value: string): string {
  const clean = toEnglishDigits(value).trim();
  const m = clean.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
  if (!m) return value;
  const jy = Number(m[1]);
  const jm = Number(m[2]);
  const jd = Number(m[3]);
  if (jm < 1 || jm > 12) return value;
  const [gy, gm, gd] = jalaliToGregorian(jy, jm, jd);
  const wIdx = jalaliWeekdayIndex(gy, gm, gd);
  return `${JALALI_WEEKDAYS[wIdx]} ${toPersianDigits(jd)} ${JALALI_MONTHS[jm - 1]} ${toPersianDigits(jy)}`;
}

// اعتبارسنجی و نرمال‌سازی رشته تاریخ ورودی کاربر به فرمت استاندارد
export function normalizeJalaliDate(input: string): string | null {
  const clean = toEnglishDigits(input).trim().replace(/-/g, "/");
  const m = clean.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
  if (!m) return null;
  const jy = Number(m[1]);
  const jm = Number(m[2]);
  const jd = Number(m[3]);
  if (jm < 1 || jm > 12 || jd < 1 || jd > 31) return null;
  return formatJalali(jy, jm, jd);
}

// اعتبارسنجی و نرمال‌سازی ساعت به فرمت HH:MM
export function normalizeTime(input: string): string | null {
  const clean = toEnglishDigits(input).trim().replace(/[.\s]/g, ":");
  const m = clean.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const h = Number(m[1]);
  const mm = Number(m[2]);
  if (h > 23 || mm > 59) return null;
  return `${pad2(h)}:${pad2(mm)}`;
}
