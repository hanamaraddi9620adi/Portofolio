import test from "node:test";
import assert from "node:assert/strict";
import { isAllowedOwner } from "../src/lib/owner-access";
const user = {
  id: "owner-id",
  email: "owner@example.com",
  email_confirmed_at: "2026-10-23T10:00:00Z",
};
test("owner access requires a verified exact ID and email pair", () => {
  assert.equal(isAllowedOwner(user, "owner-id", "OWNER@example.com"), true);
  for (const candidate of [
    null,
    { ...user, id: "another-id" },
    { ...user, email: "other@example.com" },
    { ...user, email_confirmed_at: null },
  ])
    assert.equal(
      isAllowedOwner(candidate, "owner-id", "owner@example.com"),
      false,
    );
  assert.equal(isAllowedOwner(user, undefined, "owner@example.com"), false);
  assert.equal(isAllowedOwner(user, "owner-id", undefined), false);
});
