import test from "node:test";
import assert from "node:assert/strict";
import {
  issueFormToken,
  validFormToken,
  formTokenBucket,
} from "../src/lib/form-protection";
const secret = "a-test-only-secret-longer-than-thirty-two-characters";
const now = 1793280000000;
test("signed form verification rejects forgery, expiry and future tokens", () => {
  const token = issueFormToken(secret, now);
  assert.equal(validFormToken(token, secret, now + 1000), true);
  assert.equal(validFormToken(token, secret, now + 16 * 60 * 1000), false);
  assert.equal(validFormToken(token, secret, now - 10000), false);
  assert.equal(validFormToken(token, secret + "changed", now), false);
  assert.equal(validFormToken(token + "extra", secret, now), false);
  assert.equal(validFormToken("", secret, now), false);
});
test("each signed form gets an independent replay-prevention bucket", () => {
  const a = issueFormToken(secret, now),
    b = issueFormToken(secret, now);
  assert.notEqual(a, b);
  assert.match(formTokenBucket(a), /^[a-f0-9]{64}$/);
  assert.notEqual(formTokenBucket(a), formTokenBucket(b));
});
