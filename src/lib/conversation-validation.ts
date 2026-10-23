import { z } from "zod";
export const inboxAccessSchema = z
  .string()
  .regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.[A-Za-z0-9_-]{43}$/i,
  );
export const messageText = z.string().trim().min(1).max(3000);
export const inboxReadSchema = z.object({ access: inboxAccessSchema });
export const visitorReplySchema = z.object({
  access: inboxAccessSchema,
  message: messageText,
  requestId: z.uuid(),
});
export const ownerReplySchema = z.object({
  message: messageText,
  requestId: z.uuid(),
});
export const conversationStatusSchema = z.object({
  status: z.enum(["new", "replied", "closed"]),
});
