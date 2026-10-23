import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { ApiError, database } from "./server";
export function newInboxSecret() {
  const secret = randomBytes(32).toString("base64url");
  return { secret, hash: hashInboxSecret(secret) };
}
export function hashInboxSecret(secret: string) {
  return createHash("sha256").update(secret).digest("hex");
}
export type ConversationMessage = {
  id: string;
  author: "visitor" | "owner";
  body: string;
  created_at: string;
};
export type Conversation = {
  id: string;
  name: string;
  created_at: string;
  message: string;
  status: "new" | "replied" | "closed";
  inbox_hash?: string | null;
  email?: string;
};
export async function getConversation(id: string, hash?: string) {
  let query = database()
    .from("contact_submissions")
    .select("id,name,email,created_at,message,status,inbox_hash")
    .eq("id", id);
  if (hash) query = query.eq("inbox_hash", hash);
  const { data, error } = await query.maybeSingle();
  if (error)
    throw new ApiError(
      "The inbox is temporarily unavailable. Please try later.",
      503,
    );
  if (!data)
    throw new ApiError(
      "This private conversation is unavailable or has expired.",
      404,
    );
  return data as Conversation;
}
export async function conversationPayload(
  contact: Conversation,
  includeEmail = false,
) {
  const { data, error } = await database()
    .from("conversation_messages")
    .select("id,author,body,created_at")
    .eq("contact_id", contact.id)
    .order("created_at")
    .order("id");
  if (error)
    throw new ApiError("Messages could not be loaded. Please try later.", 503);
  return {
    id: contact.id,
    name: contact.name,
    ...(includeEmail ? { email: contact.email } : {}),
    status: contact.status,
    hasInbox: Boolean(contact.inbox_hash),
    messages: [
      {
        id: contact.id,
        author: "visitor",
        body: contact.message,
        created_at: contact.created_at,
      },
      ...data,
    ],
  };
}
export async function appendMessage(
  id: string,
  author: "visitor" | "owner",
  body: string,
  requestId: string,
) {
  const { error } = await database().rpc("append_portfolio_message", {
    thread_id: id,
    message_author: author,
    message_body: body,
    request_id: requestId,
  });
  if (error)
    throw new ApiError(
      "The reply could not be saved. The conversation may be closed or full. Refresh before retrying.",
      409,
    );
}
