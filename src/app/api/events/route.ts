import { eventSchema } from "@/lib/validation";
import {
  ApiError,
  configured,
  database,
  failure,
  originGuard,
  owner,
  rateLimit,
  readBody,
} from "@/lib/server";
export async function POST(req: Request) {
  try {
    originGuard(req);
    const parsed = eventSchema.safeParse(await readBody(req));
    if (!parsed.success) throw new ApiError("Invalid analytics event.");
    if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "true")
      return Response.json(
        { recorded: false, reason: "analytics_disabled" },
        { status: 202 },
      );
    if (await owner()) return new Response(null, { status: 204 });
    if (!configured())
      throw new ApiError("Analytics storage is unavailable.", 503);
    await rateLimit(req, "events", 180);
    const d = parsed.data;
    const row = {
      path: d.path,
      session_id: d.sessionId,
      referrer: d.referrer || null,
      consent: true,
    };
    const result =
      d.type === "page_view"
        ? await database().from("page_views").insert(row)
        : await database()
            .from("analytics_events")
            .insert({ ...row, event_type: d.type });
    const { error } = result;
    if (error) throw new ApiError("Analytics event could not be stored.", 503);
    return new Response(null, { status: 204 });
  } catch (e) {
    return failure(e);
  }
}
