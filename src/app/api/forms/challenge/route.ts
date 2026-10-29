import { issueFormToken } from "@/lib/form-protection";
import { ApiError, configured, failure, rateLimit } from "@/lib/server";

export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  try {
    if (!configured())
      throw new ApiError(
        "The contact service is temporarily unavailable. Please use email.",
        503,
      );
    await rateLimit(req, "form-challenge", 120);
    return Response.json(
      { token: issueFormToken(process.env.RATE_LIMIT_SECRET!) },
      {
        headers: { "Cache-Control": "private, no-store" },
      },
    );
  } catch (error) {
    return failure(error);
  }
}
