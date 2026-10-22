import { NextRequest, NextResponse } from "next/server";
// Fast early redirect only. The dashboard and export independently verify the
// token with Supabase and enforce both owner ID and verified email.
export function proxy(request: NextRequest) {
  if (!request.cookies.get("portfolio-owner")?.value)
    return NextResponse.redirect(new URL("/admin/login", request.url));
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
export const config = { matcher: "/admin/analytics/:path*" };
