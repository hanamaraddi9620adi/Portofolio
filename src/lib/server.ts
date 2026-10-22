import "server-only";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createHmac } from "node:crypto";
export const configured = () =>
  Boolean(
    process.env.SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.SUPABASE_ANON_KEY,
  );
export function database() {
  if (!configured()) throw new Error("Storage is not configured");
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
export function authClient() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
export async function owner() {
  if (!configured() || !process.env.OWNER_USER_ID || !process.env.OWNER_EMAIL)
    return null;
  const token = (await cookies()).get("portfolio-owner")?.value;
  if (!token) return null;
  const { data, error } = await authClient().auth.getUser(token);
  const u = data.user;
  return !error &&
    u?.email_confirmed_at &&
    u.id === process.env.OWNER_USER_ID &&
    u.email?.toLowerCase() === process.env.OWNER_EMAIL.toLowerCase()
    ? u
    : null;
}
export class ApiError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export function originGuard(req: Request) {
  const expected = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  if (req.headers.get("origin") !== new URL(expected).origin)
    throw new ApiError("Request origin is not allowed.", 403);
}
export async function readBody(req: Request) {
  if (!req.headers.get("content-type")?.startsWith("application/json"))
    throw new ApiError("Expected JSON.", 415);
  const reader = req.body?.getReader();
  if (!reader) throw new ApiError("Request body is required.");
  let size = 0;
  const chunks: Uint8Array[] = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 12288) {
      await reader.cancel();
      throw new ApiError("Request is too large.", 413);
    }
    chunks.push(value);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString());
  } catch {
    throw new ApiError("Invalid JSON.");
  }
}
export async function rateLimit(req: Request, bucket: string, limit: number) {
  if (
    !process.env.RATE_LIMIT_SECRET ||
    process.env.RATE_LIMIT_SECRET.length < 32
  )
    throw new ApiError(
      "Submissions are not configured yet. Please use email.",
      503,
    );
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  const hour = Math.floor(Date.now() / 3600000);
  const hash = createHmac("sha256", process.env.RATE_LIMIT_SECRET)
    .update(`${hour}:${bucket}:${ip}`)
    .digest("hex");
  const { data, error } = await database().rpc("take_rate_limit", {
    bucket_key: hash,
    max_hits: limit,
  });
  if (error)
    throw new ApiError(
      "Submission protection is unavailable. Please try later.",
      503,
    );
  if (!data)
    throw new ApiError("Too many requests. Please try again later.", 429);
}
export async function verifyHuman(token?: string) {
  if (!process.env.TURNSTILE_SECRET_KEY) {
    if (process.env.NODE_ENV === "production")
      throw new ApiError(
        "The form is not connected yet. Please use email.",
        503,
      );
    return;
  }
  if (!token) throw new ApiError("Please complete the verification.");
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
      }),
      signal: AbortSignal.timeout(8000),
    },
  );
  const result = await response.json();
  if (
    !result.success ||
    result.hostname !==
      new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
        .hostname
  )
    throw new ApiError("Verification expired or failed. Please retry.");
}
export function failure(error: unknown) {
  return Response.json(
    {
      error:
        error instanceof ApiError
          ? error.message
          : "The request could not be completed. Please try again later.",
    },
    {
      status: error instanceof ApiError ? error.status : 500,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
