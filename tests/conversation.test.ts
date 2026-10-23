import test from "node:test";
import assert from "node:assert/strict";
import {
  inboxAccessSchema,
  visitorReplySchema,
  ownerReplySchema,
  conversationStatusSchema,
} from "../src/lib/conversation-validation";
const access = "3fa85f64-5717-4562-b3fc-2c963f66afa6." + "a".repeat(43);
test("private links require a UUID and full unpredictable token", () => {
  assert.equal(inboxAccessSchema.safeParse(access).success, true);
  for (const value of [
    "",
    "guess",
    access.slice(0, -1),
    "../admin." + "a".repeat(43),
    access + "?email=x",
  ])
    assert.equal(inboxAccessSchema.safeParse(value).success, false);
});
test("replies require private access, bounded text and idempotency UUID", () => {
  const reply = {
    access,
    message: "A follow-up message",
    requestId: crypto.randomUUID(),
  };
  assert.equal(visitorReplySchema.safeParse(reply).success, true);
  assert.equal(
    visitorReplySchema.safeParse({ ...reply, access: "invalid" }).success,
    false,
  );
  assert.equal(
    visitorReplySchema.safeParse({ ...reply, message: "  " }).success,
    false,
  );
  assert.equal(
    visitorReplySchema.safeParse({ ...reply, message: "x".repeat(3001) })
      .success,
    false,
  );
  assert.equal(
    visitorReplySchema.safeParse({ ...reply, requestId: "repeat" }).success,
    false,
  );
  assert.equal(ownerReplySchema.safeParse(reply).success, true);
});
test("conversation states are limited to supported owner actions", () => {
  assert.equal(
    conversationStatusSchema.safeParse({ status: "closed" }).success,
    true,
  );
  assert.equal(
    conversationStatusSchema.safeParse({ status: "public" }).success,
    false,
  );
});
