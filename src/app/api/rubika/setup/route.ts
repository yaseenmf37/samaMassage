import { NextResponse } from "next/server";
import {
  updateBotEndpoint,
  setCommands,
  getMe,
} from "@/lib/rubika";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/rubika/setup?secret=XXX
// یک‌بار بعد از دیپلوی صدا زده می‌شود تا webhook و دستورات ثبت شوند.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (!process.env.SETUP_SECRET || secret !== process.env.SETUP_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const base = (process.env.PUBLIC_BASE_URL || origin).replace(/\/$/, "");
  const webhookUrl = `${base}/api/rubika/webhook`;

  const results: Record<string, unknown> = { webhookUrl };

  // اعتبارسنجی توکن
  results.getMe = await getMe();

  // ثبت اندپوینت‌ها (پیام‌ها و کلیک دکمه‌های اینلاین)
  results.receiveUpdate = await updateBotEndpoint(webhookUrl, "ReceiveUpdate");
  results.receiveInlineMessage = await updateBotEndpoint(
    webhookUrl,
    "ReceiveInlineMessage"
  );

  // دستورات ربات
  results.setCommands = await setCommands([
    { command: "start", description: "شروع و نمایش منو" },
    { command: "login", description: "ورود مدیر با رمز" },
    { command: "menu", description: "نمایش منوی مدیریت" },
    { command: "logout", description: "خروج از پنل مدیریت" },
    { command: "id", description: "نمایش شناسه چت" },
  ]);

  const reachable =
    !!results.getMe &&
    typeof results.getMe === "object" &&
    // اگر روبیکا در دسترس باشد، پاسخ JSON معتبر با status/data می‌دهد
    (("status" in (results.getMe as object)) ||
      ("data" in (results.getMe as object)));

  return NextResponse.json({
    ok: true,
    reachable,
    note: reachable
      ? "روبیکا از سرور در دسترس است ✅ webhook ثبت شد."
      : "به نظر می‌رسد روبیکا از این سرور در دسترس نیست ❌ — از پنل سایت استفاده کن.",
    results,
  });
}
