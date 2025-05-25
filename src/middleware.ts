import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const adminToken = request.cookies.get("admin-token");
  const isAdminPath = request.nextUrl.pathname.startsWith("/admin");
  const isLoginPath = request.nextUrl.pathname === "/admin/login";

  // اگر کاربر به صفحه لاگین می‌رود و قبلاً لاگین کرده است، به پنل مدیریت هدایت می‌شود
  if (isLoginPath && adminToken) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // اگر کاربر به مسیرهای ادمین می‌رود و لاگین نکرده است، به صفحه لاگین هدایت می‌شود
  if (isAdminPath && !isLoginPath && !adminToken) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
