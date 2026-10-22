import { visitSchema } from "@/lib/validation";
import {
  ApiError,
  configured,
  database,
  failure,
  originGuard,
  rateLimit,
  readBody,
  verifyHuman,
} from "@/lib/server";
export async function POST(req: Request) {
  try {
    originGuard(req);
    const parsed = visitSchema.safeParse(await readBody(req));
    if (!parsed.success)
      throw new ApiError(
        "Check your details, LinkedIn profile URL and consent.",
      );
    if (!configured())
      throw new ApiError(
        "Professional visits are not connected yet. You can reach me by email.",
        503,
      );
    await rateLimit(req, "visit", 5);
    await verifyHuman(parsed.data.token);
    const d = parsed.data;
    const { error } = await database()
      .from("identified_visitors")
      .insert({
        name: d.name,
        email: d.email || null,
        company: d.company || null,
        role: d.role || null,
        linkedin: d.linkedin || null,
        message: d.message || null,
        consent: true,
        link_consent: d.linkSession,
        session_id: d.linkSession ? d.sessionId || null : null,
      });
    if (error)
      throw new ApiError(
        "Your visit could not be saved. Please try later.",
        503,
      );
    return Response.json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}
