import { newInboxSecret } from "@/lib/conversations";
import { contactSchema } from "@/lib/validation";
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
    const parsed = contactSchema.safeParse(await readBody(req));
    if (!parsed.success)
      throw new ApiError(
        "Check your name, email, message (10–3000 characters) and consent.",
      );
    if (!configured())
      throw new ApiError(
        "The message form is not connected yet. Please email hanamaraddikanakannavar@gmail.com.",
        503,
      );
    await rateLimit(req, "contact", 5);
    await verifyHuman(parsed.data.token);
    const { name, email, message } = parsed.data;
    const inbox = newInboxSecret();
    const { data, error } = await database()
      .from("contact_submissions")
      .insert({ name, email, message, consent: true, inbox_hash: inbox.hash })
      .select("id")
      .single();
    if (error)
      throw new ApiError(
        "Your message could not be saved. Please use email or try again.",
        503,
      );
    return Response.json(
      { ok: true, inboxAccess: data.id + "." + inbox.secret },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return failure(e);
  }
}
