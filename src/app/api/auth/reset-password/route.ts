import { cookies } from "next/headers";
import { z } from "zod";
import { isAllowedOwner } from "@/lib/owner-access";
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
      .object({
        accessToken: z.string().min(20).max(8192),
        refreshToken: z.string().min(10).max(512),
        password: z.string().min(12).max(128),
      })
      .safeParse(await readBody(req));
    if (!input.success)
      throw new ApiError(
        "Use a valid recovery link and a password of 12–128 characters.",
      );
    if (!configured())
      throw new ApiError("Account recovery is temporarily unavailable.", 503);
    await rateLimit(req, "password-reset", 5);
    const auth = authClient();
    const { data: session, error: sessionError } = await auth.auth.setSession({
      access_token: input.data.accessToken,
      refresh_token: input.data.refreshToken,
    });
    if (sessionError || !session.session)
      throw new ApiError(
        "Your recovery link is invalid or expired. Request a new email.",
        401,
      );
    const { data, error } = await auth.auth.getUser(
      session.session.access_token,
    );
    if (
      error ||
      !isAllowedOwner(
        data.user,
        process.env.OWNER_USER_ID,
        process.env.OWNER_EMAIL,
      )
    )
      throw new ApiError(
        "This recovery link does not belong to the portfolio owner.",
        403,
      );
    const { error: updateError } = await auth.auth.updateUser({
      password: input.data.password,
    });
    if (updateError)
      throw new ApiError(
        updateError.code === "same_password"
          ? "Choose a different password from your previous one."
          : "The password could not be updated. Request a fresh recovery link and choose a strong password.",
        400,
      );
    await auth.auth.signOut({ scope: "global" });
    (await cookies()).delete("portfolio-owner");
    return Response.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return failure(error);
  }
}
