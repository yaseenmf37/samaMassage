import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { username, password } = data;

    // بررسی اعتبار کاربر
    if (username === "admin" && password === "admin123") {
      // ذخیره توکن در کوکی
      const cookieStore = await cookies();
      cookieStore.set("admin-token", "admin-token", {
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
  } catch {
    return NextResponse.json(
      { error: "خطا در ارتباط با سرور" },
      { status: 500 }
    );
  }
}
