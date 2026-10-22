import { cookies } from "next/headers";
import { z } from "zod";
import {
  ApiError,
  authClient,
  configured,
  failure,
  originGuard,
  rateLimit,
  readBody,
} from "@/lib/server";
export async function POST(req: Request) {
  try {
    originGuard(req);
    const p = z
      .object({
        email: z.email().max(254),
        password: z.string().min(1).max(256),
      })
      .safeParse(await readBody(req));
    if (!p.success) throw new ApiError("Enter a valid email and password.");
    if (!configured() || !process.env.OWNER_USER_ID || !process.env.OWNER_EMAIL)
      throw new ApiError(
        "Owner access is not configured. Follow README.md to connect Supabase and the owner allowlist.",
        503,
      );
    await rateLimit(req, "login", 10);
    const { data, error } = await authClient().auth.signInWithPassword(p.data);
    if (
      error ||
      !data.user?.email_confirmed_at ||
      data.user.id !== process.env.OWNER_USER_ID ||
      data.user.email?.toLowerCase() !== process.env.OWNER_EMAIL.toLowerCase()
    )
      throw new ApiError(
        "Sign-in failed or this account is not authorized.",
        401,
      );
    (await cookies()).set("portfolio-owner", data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: data.session.expires_in,
    });
    return Response.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return failure(e);
  }
}
