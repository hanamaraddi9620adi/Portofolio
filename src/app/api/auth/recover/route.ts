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
    const input = z
      .object({ email: z.string().trim().toLowerCase().pipe(z.email()) })
      .safeParse(await readBody(req));
    if (!input.success) throw new ApiError("Enter your owner email address.");
    if (!configured() || !process.env.OWNER_EMAIL || !process.env.OWNER_USER_ID)
      throw new ApiError("Account recovery is temporarily unavailable.", 503);
    await rateLimit(req, "password-recovery", 3);
    if (input.data.email === process.env.OWNER_EMAIL.trim().toLowerCase()) {
      // One fixed recipient and destination; this endpoint cannot relay emails.
      const { error } = await authClient().auth.resetPasswordForEmail(
        process.env.OWNER_EMAIL.trim(),
        {
          redirectTo: new URL(
            "/admin/reset-password",
            process.env.NEXT_PUBLIC_SITE_URL!,
          ).href,
        },
      );
      if (error)
        throw new ApiError(
          "Recovery email could not be sent. Please try again later.",
          503,
        );
    }
    return Response.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return failure(error);
  }
}
