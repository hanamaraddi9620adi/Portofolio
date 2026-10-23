import { visitorReplySchema } from "@/lib/conversation-validation";
import {
  getConversation,
  hashInboxSecret,
  appendMessage,
} from "@/lib/conversations";
import {
  ApiError,
  configured,
  failure,
  originGuard,
  rateLimit,
  readBody,
} from "@/lib/server";
export async function POST(req: Request) {
  try {
    originGuard(req);
    const p = visitorReplySchema.safeParse(await readBody(req));
    if (!p.success)
      throw new ApiError(
        "Check your private link and reply (1–3000 characters).",
      );
    if (!configured())
      throw new ApiError("The inbox is not connected yet.", 503);
    await rateLimit(req, "inbox-reply", 30);
    const [id, secret] = p.data.access.split(".");
    const contact = await getConversation(id, hashInboxSecret(secret));
    if (contact.status === "closed")
      throw new ApiError("This conversation is closed.", 409);
    await appendMessage(id, "visitor", p.data.message, p.data.requestId);
    return Response.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return failure(e);
  }
}
