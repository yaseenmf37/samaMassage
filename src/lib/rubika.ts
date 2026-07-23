// کلاینت سبک برای Bot API روبیکا
// همه‌ی تماس‌ها سمت سرور (Vercel) انجام می‌شود.

const API_BASE = "https://botapi.rubika.ir/v3";

export function getBotToken(): string {
  const token = process.env.RUBIKA_BOT_TOKEN;
  if (!token) {
    throw new Error("RUBIKA_BOT_TOKEN تعریف نشده است");
  }
  return token;
}

export interface InlineButton {
  id: string;
  type: string;
  button_text: string;
}
export interface KeypadRow {
  buttons: InlineButton[];
}
export interface Keypad {
  rows: KeypadRow[];
  resize_keyboard?: boolean;
  on_time_keyboard?: boolean;
}

async function call(
  method: string,
  body: Record<string, unknown>
): Promise<any> {
  const token = getBotToken();
  const url = `${API_BASE}/${token}/${method}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      // جلوگیری از کش شدن در ران‌تایم Next
      cache: "no-store",
    });
    const text = await res.text();
    let json: any = null;
    try {
      json = JSON.parse(text);
    } catch {
      json = { raw: text, status_code: res.status };
    }
    if (!res.ok) {
      console.error(`Rubika ${method} HTTP ${res.status}:`, text.slice(0, 300));
    }
    return json;
  } catch (err) {
    console.error(`Rubika ${method} failed:`, err);
    return null;
  }
}

// ---------- سازنده‌های دکمه/کیبورد ----------

export function btn(id: string, text: string): InlineButton {
  return { id, type: "Simple", button_text: text };
}

export function inlineKeypad(rows: InlineButton[][]): Keypad {
  return { rows: rows.map((buttons) => ({ buttons })) };
}

export function chatKeypad(rows: InlineButton[][]): Keypad {
  return {
    rows: rows.map((buttons) => ({ buttons })),
    resize_keyboard: true,
    on_time_keyboard: false,
  };
}

// ---------- متدها ----------

export async function sendMessage(
  chatId: string,
  text: string,
  opts: {
    inlineKeypad?: Keypad;
    chatKeypad?: Keypad;
    chatKeypadType?: "New" | "Removed";
    disableNotification?: boolean;
  } = {}
): Promise<any> {
  const payload: Record<string, unknown> = {
    chat_id: chatId,
    text,
    disable_notification: opts.disableNotification ?? false,
  };
  if (opts.inlineKeypad) payload.inline_keypad = opts.inlineKeypad;
  if (opts.chatKeypad) payload.chat_keypad = opts.chatKeypad;
  if (opts.chatKeypadType) payload.chat_keypad_type = opts.chatKeypadType;
  return call("sendMessage", payload);
}

export async function editMessageText(
  chatId: string,
  messageId: string,
  text: string
): Promise<any> {
  return call("editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text,
  });
}

export async function editMessageKeypad(
  chatId: string,
  messageId: string,
  inlineKeypad: Keypad
): Promise<any> {
  return call("editMessageKeypad", {
    chat_id: chatId,
    message_id: messageId,
    inline_keypad: inlineKeypad,
  });
}

export async function deleteMessage(
  chatId: string,
  messageId: string
): Promise<any> {
  return call("deleteMessage", { chat_id: chatId, message_id: messageId });
}

export async function setCommands(
  commands: { command: string; description: string }[]
): Promise<any> {
  return call("setCommands", { bot_commands: commands });
}

export async function updateBotEndpoint(
  url: string,
  type: string
): Promise<any> {
  return call("updateBotEndpoints", { url, type });
}

export async function getMe(): Promise<any> {
  return call("getMe", {});
}

// ارسال پیام به همه‌ی ادمین‌های ثبت‌شده در دیتابیس
export async function notifyAdmins(
  text: string,
  inlineKeypad?: Keypad
): Promise<void> {
  try {
    const connectDB = (await import("@/lib/mongodb")).default;
    const Admin = (await import("@/models/Admin")).default;
    await connectDB();
    const admins = await Admin.find({}).lean();
    await Promise.all(
      admins.map((a: any) =>
        sendMessage(a.chatId, text, inlineKeypad ? { inlineKeypad } : {})
      )
    );
  } catch (err) {
    console.error("notifyAdmins failed:", err);
  }
}
