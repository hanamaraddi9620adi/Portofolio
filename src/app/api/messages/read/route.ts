import { inboxReadSchema } from "@/lib/conversation-validation";
import {
  getConversation,
  hashInboxSecret,
  conversationPayload,
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
    const p = inboxReadSchema.safeParse(await readBody(req));
    if (!p.success)
      throw new ApiError("Use the complete private conversation link.", 400);
    if (!configured())
      throw new ApiError(
        "The inbox is not connected yet. Please use email.",
        503,
      );
    await rateLimit(req, "inbox-read", 300);
    const [id, secret] = p.data.access.split(".");
    const contact = await getConversation(id, hashInboxSecret(secret));
    return Response.json(await conversationPayload(contact), {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (e) {
    return failure(e);
  }
}
