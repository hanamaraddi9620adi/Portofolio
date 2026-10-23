import { z } from "zod";
import {
  ownerReplySchema,
  conversationStatusSchema,
} from "@/lib/conversation-validation";
import {
  getConversation,
  conversationPayload,
  appendMessage,
} from "@/lib/conversations";
import {
  ApiError,
  database,
  failure,
  originGuard,
  owner,
  rateLimit,
  readBody,
} from "@/lib/server";
type Context = { params: Promise<{ id: string }> };
async function authorizedId(ctx: Context) {
  if (!(await owner())) throw new ApiError("Unauthorized", 401);
  const { id } = await ctx.params;
  if (!z.uuid().safeParse(id).success)
    throw new ApiError("Invalid conversation.", 400);
  return id;
}
export async function GET(_req: Request, ctx: Context) {
  try {
    const id = await authorizedId(ctx);
    return Response.json(
      await conversationPayload(await getConversation(id), true),
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (e) {
    return failure(e);
  }
}
export async function POST(req: Request, ctx: Context) {
  try {
    const id = await authorizedId(ctx);
    originGuard(req);
    const p = ownerReplySchema.safeParse(await readBody(req));
    if (!p.success) throw new ApiError("Reply must contain 1–3000 characters.");
    await rateLimit(req, "owner-reply", 120);
    const contact = await getConversation(id);
    if (!contact.inbox_hash)
      throw new ApiError(
        "This older submission has no private inbox. Reply using its email address.",
        409,
      );
    await appendMessage(id, "owner", p.data.message, p.data.requestId);
    return Response.json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}
export async function PATCH(req: Request, ctx: Context) {
  try {
    const id = await authorizedId(ctx);
    originGuard(req);
    const p = conversationStatusSchema.safeParse(await readBody(req));
    if (!p.success) throw new ApiError("Invalid conversation status.");
    const { data, error } = await database()
      .from("contact_submissions")
      .update({ status: p.data.status })
      .eq("id", id)
      .select("id")
      .maybeSingle();
    if (error) throw new ApiError("The status could not be updated.", 503);
    if (!data) throw new ApiError("Conversation not found.", 404);
    return Response.json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}
