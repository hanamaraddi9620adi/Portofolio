import test from "node:test";
import assert from "node:assert/strict";
import {
  contactSchema,
  visitSchema,
  eventSchema,
  csvCell,
  dateRange,
} from "../src/lib/validation";
const contact = {
  name: "Test visitor",
  email: "visitor@example.com",
  message: "A genuine opportunity to discuss.",
  consent: true,
  website: "",
};
test("contact requires explicit consent and rejects spam field", () => {
  assert.equal(contactSchema.safeParse(contact).success, true);
  assert.equal(
    contactSchema.safeParse({ ...contact, consent: false }).success,
    false,
  );
  assert.equal(
    contactSchema.safeParse({ ...contact, website: "spam" }).success,
    false,
  );
  assert.equal(
    contactSchema.safeParse({ ...contact, email: "bad" }).success,
    false,
  );
  assert.equal(
    contactSchema.safeParse({ ...contact, message: "x".repeat(3001) }).success,
    false,
  );
});
test("professional visit accepts optional fields and validates LinkedIn host", () => {
  assert.equal(
    visitSchema.safeParse({ name: "Visitor", consent: true }).success,
    true,
  );
  assert.equal(
    visitSchema.safeParse({
      name: "Visitor",
      consent: true,
      linkedin: "https://linkedin.com.evil.example/in/person",
    }).success,
    false,
  );
  assert.equal(
    visitSchema.safeParse({
      name: "Visitor",
      consent: true,
      linkedin: "https://www.linkedin.com/in/person",
    }).success,
    true,
  );
});
test("analytics refuses no-consent, private paths, query strings and full referrers", () => {
  const event = {
    type: "page_view",
    path: "/",
    sessionId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    consent: true,
    referrer: "linkedin.com",
  };
  assert.equal(eventSchema.safeParse(event).success, true);
  for (const patch of [
    { consent: false },
    { path: "/admin/analytics" },
    { path: "/?email=test@example.com" },
    { referrer: "https://example.com/private?x=1" },
    { sessionId: "fake" },
  ])
    assert.equal(eventSchema.safeParse({ ...event, ...patch }).success, false);
});
test("CSV cells prevent spreadsheet formula execution and escape quotes", () => {
  assert.equal(csvCell("=CMD()"), '"\'=CMD()"');
  assert.equal(csvCell('a"b'), '"a""b"');
  assert.equal(csvCell("@SUM(1)"), '"\'@SUM(1)"');
});
test("date intervals reject invalid, reversed and excessive ranges", () => {
  assert.throws(() => dateRange(new URLSearchParams("from=nope")));
  assert.throws(() =>
    dateRange(new URLSearchParams("from=2026-10-22&to=2026-01-01")),
  );
  assert.throws(() =>
    dateRange(new URLSearchParams("from=2020-01-01&to=2026-01-01")),
  );
  assert.equal(
    dateRange(new URLSearchParams("from=2026-10-01&to=2026-10-02")).start,
    "2026-10-01T00:00:00.000Z",
  );
});
