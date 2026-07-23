import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import TimeSlot from "@/models/TimeSlot";
import Booking from "@/models/Booking";
import Admin from "@/models/Admin";
import {
  sendMessage,
  editMessageText,
  editMessageKeypad,
  btn,
  inlineKeypad,
  chatKeypad,
  Keypad,
} from "@/lib/rubika";
import {
  getNextDays,
  jalaliValueToLabel,
  normalizeJalaliDate,
  normalizeTime,
  toPersianDigits,
  todayJalali,
  JALALI_MONTHS,
  toEnglishDigits,
} from "@/lib/jalali";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

// ---------- دیباگ سبک (در همین instance گرم می‌ماند) ----------
type Dbg = {
  lastBody?: unknown;
  lastError?: string;
  lastAt?: string;
  lastChatId?: string;
  lastText?: string;
  count: number;
};
const dbg: Dbg = { count: 0 };

// حذف کاراکترهای جهت/فاصله‌ی نامرئی و trim
function cleanText(t: string): string {
  return (t || "")
    .replace(/[‎‏‪-‮⁦-⁩﻿]/g, "")
    .trim();
}

// اتصال به دیتابیس با تایم‌اوت کوتاه تا فانکشن هنگ نکند
async function connectWithTimeout(ms = 8000): Promise<boolean> {
  try {
    await Promise.race([
      connectDB(),
      new Promise((_, rej) => setTimeout(() => rej(new Error("db-timeout")), ms)),
    ]);
    return true;
  } catch (e) {
    dbg.lastError = "DB: " + String(e);
    return false;
  }
}

// ---------- ثابت‌ها ----------
const LBL_ADD = "➕ افزودن زمان";
const LBL_FREE = "🟢 زمان‌های آزاد";
const LBL_BOOK = "🔴 رزروها";
const LBL_TODAY = "📅 برنامه امروز";
const LBL_HELP = "❓ راهنما";

const SITE_URL = process.env.PUBLIC_BASE_URL || "https://sama-massage.vercel.app";

function mainKeypad(): Keypad {
  return chatKeypad([
    [btn("m_add", LBL_ADD)],
    [btn("m_free", LBL_FREE), btn("m_book", LBL_BOOK)],
    [btn("m_today", LBL_TODAY), btn("m_help", LBL_HELP)],
  ]);
}

// ---------- کمکی‌ها ----------
function isOk(resp: any): boolean {
  return !!(resp && (resp.status === "OK" || resp.data));
}

async function isAdmin(chatId: string): Promise<boolean> {
  const a = await Admin.findOne({ chatId }).lean();
  return !!a;
}

function shortDate(dateValue: string): string {
  const clean = toEnglishDigits(dateValue).trim();
  const m = clean.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
  if (!m) return dateValue;
  const jm = Number(m[2]);
  const jd = Number(m[3]);
  return `${toPersianDigits(jd)} ${JALALI_MONTHS[(jm - 1 + 12) % 12]}`;
}

// ساعت‌های پیشنهادی ۹ تا ۲۲
function timeButtonsForDate(dateValue: string) {
  const rows = [];
  let current: ReturnType<typeof btn>[] = [];
  for (let h = 9; h <= 22; h++) {
    const t = `${h < 10 ? "0" + h : h}:00`;
    current.push(btn(`addtime|${dateValue}|${t}`, toPersianDigits(t)));
    if (current.length === 4) {
      rows.push(current);
      current = [];
    }
  }
  if (current.length) rows.push(current);
  rows.push([
    btn(`addcustom|${dateValue}`, "⌨️ ساعت دلخواه"),
    btn("m_add_menu", "⬅️ روز دیگر"),
  ]);
  return inlineKeypad(rows);
}

function daySelectKeypad(): Keypad {
  const days = getNextDays(14);
  const rows = [];
  let current: ReturnType<typeof btn>[] = [];
  for (const d of days) {
    current.push(btn(`addday|${d.value}`, `${d.weekday} ${d.shortLabel}`));
    if (current.length === 2) {
      rows.push(current);
      current = [];
    }
  }
  if (current.length) rows.push(current);
  return inlineKeypad(rows);
}

// ---------- رندر لیست‌ها ----------
async function renderFree(): Promise<{ text: string; keypad: Keypad }> {
  const slots: any[] = await TimeSlot.find({}).sort({ date: 1, time: 1 }).lean();
  if (slots.length === 0) {
    return {
      text: "🟢 هیچ زمان آزادی ثبت نشده.\n\nبرای افزودن، «➕ افزودن زمان» را بزن.",
      keypad: inlineKeypad([[btn("m_add_menu", "➕ افزودن زمان")]]),
    };
  }
  // گروه‌بندی بر اساس روز برای متن
  const byDate: Record<string, string[]> = {};
  for (const s of slots) {
    (byDate[s.date] = byDate[s.date] || []).push(s.time);
  }
  let text = `🟢 زمان‌های آزاد (${toPersianDigits(slots.length)})\n\n`;
  for (const date of Object.keys(byDate)) {
    text += `📅 ${jalaliValueToLabel(date)}\n`;
    text += `   ${byDate[date].map((t) => toPersianDigits(t)).join(" ، ")}\n\n`;
  }
  text += "برای حذف هر زمان، روی دکمه‌اش بزن 👇";

  const rows = [];
  let current: ReturnType<typeof btn>[] = [];
  for (const s of slots.slice(0, 40)) {
    current.push(
      btn(`del|${s.date}|${s.time}`, `🗑 ${shortDate(s.date)} ${toPersianDigits(s.time)}`)
    );
    if (current.length === 2) {
      rows.push(current);
      current = [];
    }
  }
  if (current.length) rows.push(current);
  rows.push([btn("m_free", "🔄 بروزرسانی")]);
  return { text, keypad: inlineKeypad(rows) };
}

async function renderBookings(): Promise<{ text: string; keypad: Keypad }> {
  const books: any[] = await Booking.find({}).sort({ date: 1, time: 1 }).lean();
  if (books.length === 0) {
    return {
      text: "🔴 هنوز رزروی ثبت نشده.",
      keypad: inlineKeypad([[btn("m_free", "🟢 زمان‌های آزاد")]]),
    };
  }
  const typeMap: Record<string, string> = {
    relaxing: "ریلکسی",
    vip: "وی‌آی‌پی (VIP)",
  };
  const genderMap: Record<string, string> = { female: "خانم", male: "آقا" };
  let text = `🔴 رزروهای ثبت‌شده (${toPersianDigits(books.length)})\n\n`;
  const rows = [];
  for (const b of books.slice(0, 40)) {
    text += `📅 ${jalaliValueToLabel(b.date)} — ساعت ${toPersianDigits(b.time)}\n`;
    text += `👤 ${b.name || "-"}  |  📞 ${toPersianDigits(b.phone || "-")}\n`;
    text += `💆 ${typeMap[b.massageType] || b.massageType || "-"}  |  ${genderMap[b.gender] || b.gender || "-"}\n`;
    if (b.notes) text += `📝 ${b.notes}\n`;
    text += "———————————\n";
    rows.push([
      btn(
        `delbk|${b.date}|${b.time}`,
        `🗑 حذف ${shortDate(b.date)} ${toPersianDigits(b.time)}`
      ),
    ]);
  }
  rows.push([btn("m_book", "🔄 بروزرسانی")]);
  return { text, keypad: inlineKeypad(rows) };
}

async function renderToday(): Promise<{ text: string; keypad: Keypad }> {
  const today = todayJalali().value;
  const slots: any[] = await TimeSlot.find({ date: today }).sort({ time: 1 }).lean();
  const books: any[] = await Booking.find({ date: today }).sort({ time: 1 }).lean();
  let text = `📅 برنامه امروز — ${jalaliValueToLabel(today)}\n\n`;
  text += `🟢 آزاد (${toPersianDigits(slots.length)}): `;
  text += slots.length
    ? slots.map((s) => toPersianDigits(s.time)).join(" ، ")
    : "—";
  text += `\n\n🔴 رزرو شده (${toPersianDigits(books.length)}):\n`;
  if (books.length) {
    for (const b of books) {
      text += `  • ${toPersianDigits(b.time)} — ${b.name || "-"} (${toPersianDigits(
        b.phone || "-"
      )})\n`;
    }
  } else {
    text += "  —\n";
  }
  return {
    text,
    keypad: inlineKeypad([
      [btn("m_free", "🟢 آزادها"), btn("m_book", "🔴 رزروها")],
    ]),
  };
}

// افزودن یک زمان آزاد
async function addSlot(
  chatId: string,
  date: string,
  time: string,
  messageId?: string
) {
  const existing = await TimeSlot.findOne({ date, time });
  const booked = await Booking.findOne({ date, time });
  let text: string;
  if (booked) {
    text = `⚠️ این زمان قبلاً رزرو شده:\n${jalaliValueToLabel(date)} — ساعت ${toPersianDigits(time)}`;
  } else if (existing) {
    text = `ℹ️ این زمان از قبل در لیست آزاد هست:\n${jalaliValueToLabel(date)} — ساعت ${toPersianDigits(time)}`;
  } else {
    await TimeSlot.create({ date, time });
    text = `✅ زمان اضافه شد:\n📅 ${jalaliValueToLabel(date)}\n🕐 ساعت ${toPersianDigits(time)}`;
  }
  const kp = inlineKeypad([
    [btn(`addday|${date}`, "➕ ساعت دیگر همین روز")],
    [btn("m_add_menu", "📆 روز دیگر"), btn("m_free", "🟢 لیست آزادها")],
  ]);
  if (messageId) {
    await editMessageText(chatId, messageId, text);
    await editMessageKeypad(chatId, messageId, kp);
  } else {
    await sendMessage(chatId, text, { inlineKeypad: kp });
  }
}

// ---------- پردازش پیام متنی / منو ----------
async function handleText(chatId: string, text: string, menuButtonId?: string) {
  // دکمه‌های منوی پایین (chat keypad) ممکن است فقط button_id بفرستند؛ به متن نگاشت می‌کنیم
  const menuMap: Record<string, string> = {
    m_add: LBL_ADD,
    m_free: LBL_FREE,
    m_book: LBL_BOOK,
    m_today: LBL_TODAY,
    m_help: LBL_HELP,
  };
  if (menuButtonId && menuMap[menuButtonId]) text = menuMap[menuButtonId];
  const trimmed = cleanText(text || "");

  // دستورات عمومی
  if (trimmed === "/start" || trimmed === "شروع" || trimmed === "/menu") {
    if (await isAdmin(chatId)) {
      await sendMessage(
        chatId,
        "🌿 پنل مدیریت سما ماساژ\nاز منوی پایین استفاده کن:",
        { chatKeypad: mainKeypad(), chatKeypadType: "New" }
      );
    } else {
      await sendMessage(
        chatId,
        `🌿 به ربات سما ماساژ خوش اومدی!\n\nبرای رزرو نوبت به سایت مراجعه کن:\n${SITE_URL}\n\n👤 اگر مدیر هستی، برای ورود بنویس:\n/login رمز`
      );
    }
    return;
  }

  if (trimmed === "/id") {
    await sendMessage(chatId, `chat_id شما:\n${chatId}`);
    return;
  }

  // ورود مدیر با PIN
  if (trimmed.startsWith("/login")) {
    const pin = process.env.RUBIKA_ADMIN_PIN;
    const given = trimmed.replace("/login", "").trim();
    if (!pin) {
      await sendMessage(chatId, "⚠️ رمز مدیریت روی سرور تنظیم نشده است.");
      return;
    }
    if (given === pin) {
      await Admin.updateOne(
        { chatId },
        { $set: { chatId }, $setOnInsert: { pending: { action: null, date: null } } },
        { upsert: true }
      );
      await sendMessage(
        chatId,
        "✅ خوش اومدی مدیر عزیز!\nحالا می‌تونی از منوی پایین همه‌چیز رو مدیریت کنی.",
        { chatKeypad: mainKeypad(), chatKeypadType: "New" }
      );
    } else {
      await sendMessage(chatId, "❌ رمز اشتباهه.");
    }
    return;
  }

  if (trimmed === "/logout") {
    await Admin.deleteOne({ chatId });
    await sendMessage(chatId, "از پنل خارج شدی. برای ورود دوباره: /login رمز", {
      chatKeypadType: "Removed",
    });
    return;
  }

  // از این‌جا به بعد فقط مدیرها
  const admin = await Admin.findOne({ chatId });
  if (!admin) {
    await sendMessage(
      chatId,
      `برای رزرو نوبت به سایت مراجعه کن:\n${SITE_URL}\n\n👤 مدیر هستی؟ بنویس: /login رمز`
    );
    return;
  }

  // اگر منتظر ساعت دلخواه هستیم
  if (admin.pending?.action === "await_time" && admin.pending?.date) {
    const t = normalizeTime(trimmed);
    if (t) {
      const date = admin.pending.date;
      admin.pending = { action: null, date: null };
      await admin.save();
      await addSlot(chatId, date, t);
      return;
    }
    // اگر ساعت نبود، پایین‌تر بررسی می‌شود
  }

  // منوها
  if (trimmed === LBL_ADD || trimmed === "افزودن زمان") {
    await sendMessage(chatId, "📆 روز مورد نظر را انتخاب کن:", {
      inlineKeypad: daySelectKeypad(),
    });
    await sendMessage(
      chatId,
      "💡 یا مستقیم بنویس (مثال):\n1403/05/20 14:30"
    );
    return;
  }
  if (trimmed === LBL_FREE || trimmed === "زمان‌های آزاد") {
    const { text: t, keypad } = await renderFree();
    await sendMessage(chatId, t, { inlineKeypad: keypad });
    return;
  }
  if (trimmed === LBL_BOOK || trimmed === "رزروها") {
    const { text: t, keypad } = await renderBookings();
    await sendMessage(chatId, t, { inlineKeypad: keypad });
    return;
  }
  if (trimmed === LBL_TODAY || trimmed === "برنامه امروز") {
    const { text: t, keypad } = await renderToday();
    await sendMessage(chatId, t, { inlineKeypad: keypad });
    return;
  }
  if (trimmed === LBL_HELP || trimmed === "راهنما") {
    await sendMessage(
      chatId,
      "🌿 راهنمای پنل مدیریت\n\n" +
        "➕ افزودن زمان: روز و ساعت آزاد اضافه کن (یا بنویس 1403/05/20 14:30)\n" +
        "🟢 زمان‌های آزاد: لیست آزادها + حذف\n" +
        "🔴 رزروها: لیست رزروهای مشتری‌ها + حذف\n" +
        "📅 برنامه امروز: خلاصه امروز\n\n" +
        "خروج از پنل: /logout",
      { chatKeypad: mainKeypad(), chatKeypadType: "New" }
    );
    return;
  }

  // تلاش برای افزودن مستقیم: "1403/05/20 14:30"
  const parts = toEnglishDigits(trimmed).split(/\s+/);
  if (parts.length === 2) {
    const d = normalizeJalaliDate(parts[0]);
    const t = normalizeTime(parts[1]);
    if (d && t) {
      await addSlot(chatId, d, t);
      return;
    }
  }

  await sendMessage(
    chatId,
    "متوجه نشدم 🤔 از منوی پایین استفاده کن یا برای راهنما «❓ راهنما» را بزن.",
    { chatKeypad: mainKeypad(), chatKeypadType: "New" }
  );
}

// ---------- پردازش کلیک دکمه‌های اینلاین ----------
async function handleCallback(
  chatId: string,
  messageId: string,
  buttonId: string
) {
  // فقط مدیرها
  if (!(await isAdmin(chatId))) {
    await sendMessage(chatId, "⛔️ فقط مدیر می‌تواند این کار را انجام دهد.\n/login رمز");
    return;
  }

  const [action, a1, a2] = buttonId.split("|");

  switch (action) {
    case "m_add_menu":
    case "m_add": {
      await editMessageText(chatId, messageId, "📆 روز مورد نظر را انتخاب کن:");
      await editMessageKeypad(chatId, messageId, daySelectKeypad());
      return;
    }
    case "addday": {
      const date = a1;
      await editMessageText(
        chatId,
        messageId,
        `🕐 ساعت را برای ${jalaliValueToLabel(date)} انتخاب کن:`
      );
      await editMessageKeypad(chatId, messageId, timeButtonsForDate(date));
      return;
    }
    case "addtime": {
      await addSlot(chatId, a1, a2, messageId);
      return;
    }
    case "addcustom": {
      const date = a1;
      await Admin.updateOne(
        { chatId },
        { $set: { pending: { action: "await_time", date } } }
      );
      await editMessageText(
        chatId,
        messageId,
        `⌨️ ساعت را برای ${jalaliValueToLabel(date)} بنویس (مثال: 14:30):`
      );
      await editMessageKeypad(chatId, messageId, inlineKeypad([]));
      return;
    }
    case "del": {
      await TimeSlot.deleteOne({ date: a1, time: a2 });
      const { text, keypad } = await renderFree();
      await editMessageText(
        chatId,
        messageId,
        `✅ حذف شد: ${shortDate(a1)} ${toPersianDigits(a2)}\n\n${text}`
      );
      await editMessageKeypad(chatId, messageId, keypad);
      return;
    }
    case "delbk": {
      await Booking.deleteOne({ date: a1, time: a2 });
      // زمان دوباره آزاد بشه؟ پیش‌فرض خیر — مدیر خودش اضافه می‌کند
      const { text, keypad } = await renderBookings();
      await editMessageText(
        chatId,
        messageId,
        `✅ رزرو حذف شد: ${shortDate(a1)} ${toPersianDigits(a2)}\n\n${text}`
      );
      await editMessageKeypad(chatId, messageId, keypad);
      return;
    }
    case "m_free": {
      const { text, keypad } = await renderFree();
      await editMessageText(chatId, messageId, text);
      await editMessageKeypad(chatId, messageId, keypad);
      return;
    }
    case "m_book": {
      const { text, keypad } = await renderBookings();
      await editMessageText(chatId, messageId, text);
      await editMessageKeypad(chatId, messageId, keypad);
      return;
    }
    default:
      return;
  }
}

// استخراج مقاومِ رویداد از بدنه‌ی webhook (شکل‌های مختلف روبیکا)
function extractEvent(body: any): {
  isInline: boolean;
  chatId?: string;
  messageId?: string;
  buttonId?: string;
  text?: string;
  type?: string;
} {
  const inline =
    body?.inline_message ||
    body?.update?.inline_message ||
    (body?.aux_data && body?.message_id && !body?.new_message ? body : null);
  if (inline) {
    return {
      isInline: true,
      chatId: inline.chat_id || inline.object_guid || body?.chat_id,
      messageId: inline.message_id,
      buttonId: inline.aux_data?.button_id,
      text: inline.text,
      type: "InlineMessage",
    };
  }
  const update = body?.update || (body?.type ? body : body?.new_message ? body : null);
  if (update) {
    const msg = update.new_message || update.updated_message || {};
    return {
      isInline: false,
      chatId: update.chat_id || update.object_guid || msg.chat_id,
      messageId: msg.message_id,
      buttonId: msg.aux_data?.button_id,
      text: msg.text,
      type: update.type || "NewMessage",
    };
  }
  return { isInline: false };
}

// ---------- ورودی webhook ----------
export async function POST(request: Request) {
  let body: any = null;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ status: "OK" });
  }

  dbg.count++;
  dbg.lastBody = body;
  dbg.lastError = undefined;

  const ev = extractEvent(body);
  dbg.lastChatId = ev.chatId;
  dbg.lastText = ev.text;

  try {
    const connected = await connectWithTimeout(8000);

    if (!connected) {
      // webhook می‌رسد ولی دیتابیس در دسترس نیست → به کاربر خبر بده
      if (ev.chatId) {
        await sendMessage(
          ev.chatId,
          "⚠️ اتصال به دیتابیس برقرار نشد.\nلطفاً در MongoDB Atlas دسترسی شبکه (Network Access) را روی «Allow from Anywhere / 0.0.0.0/0» تنظیم کن."
        );
      }
      return NextResponse.json({ status: "OK", db: false });
    }

    if (ev.isInline) {
      if (ev.chatId && ev.messageId && ev.buttonId) {
        await handleCallback(ev.chatId, ev.messageId, ev.buttonId);
      }
      return NextResponse.json({ status: "OK" });
    }

    // کلیک دکمه‌ی اینلاین (شیشه‌ای) که داخل NewMessage آمده — فقط اگر داده‌ی اینلاینِ ما باشد (شامل «|»)
    if (
      ev.buttonId &&
      ev.buttonId.includes("|") &&
      ev.chatId &&
      ev.messageId
    ) {
      await handleCallback(ev.chatId, ev.messageId, ev.buttonId);
    } else if (ev.type === "StartedBot" && ev.chatId) {
      await handleText(ev.chatId, "/start");
    } else if (ev.chatId) {
      // پیام متنی یا دکمه‌ی منوی پایین (chat keypad) — با متن یا button_id منو
      await handleText(ev.chatId, ev.text || "", ev.buttonId);
    }
  } catch (err) {
    dbg.lastError = String(err);
    console.error("webhook error:", err);
    if (ev.chatId) {
      await sendMessage(ev.chatId, "⚠️ خطای داخلی رخ داد. دوباره تلاش کن.").catch(
        () => {}
      );
    }
  }

  dbg.lastAt = new Date().toISOString();
  return NextResponse.json({ status: "OK" });
}

// GET: تست سلامت + peek دیباگ (?peek=SETUP_SECRET)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const peek = searchParams.get("peek");

  if (peek && process.env.SETUP_SECRET && peek === process.env.SETUP_SECRET) {
    // تست اتصال دیتابیس + شمارش
    let dbOk = false;
    let dbError: string | null = null;
    let adminCount = -1;
    let slotCount = -1;
    try {
      await Promise.race([
        connectDB(),
        new Promise((_, rej) =>
          setTimeout(() => rej(new Error("db-timeout-10s")), 10000)
        ),
      ]);
      dbOk = true;
      adminCount = await Admin.estimatedDocumentCount();
      slotCount = await TimeSlot.estimatedDocumentCount();
    } catch (e) {
      dbError = String(e);
    }
    return NextResponse.json({
      env: {
        hasMongo: !!process.env.MONGODB_URI,
        hasToken: !!process.env.RUBIKA_BOT_TOKEN,
        hasPin: !!process.env.RUBIKA_ADMIN_PIN,
        hasSetupSecret: !!process.env.SETUP_SECRET,
      },
      db: { ok: dbOk, error: dbError, adminCount, slotCount },
      webhookDebug: {
        count: dbg.count,
        lastAt: dbg.lastAt,
        lastChatId: dbg.lastChatId,
        lastText: dbg.lastText,
        lastError: dbg.lastError,
        lastBody: dbg.lastBody,
      },
    });
  }

  return NextResponse.json({ ok: true, service: "rubika-webhook" });
}
