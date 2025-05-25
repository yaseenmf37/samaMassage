import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// در یک محیط واقعی، این اطلاعات باید در متغیرهای محیطی ذخیره شوند
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // در یک محیط واقعی، باید از JWT یا روش‌های امن‌تر استفاده کنید
      cookies().set("admin_session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24 ساعت
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "نام کاربری یا رمز عبور اشتباه است" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "خطا در پردازش درخواست" },
      { status: 500 }
    );
  }
}
