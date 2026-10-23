import test from "node:test";
import assert from "node:assert/strict";
const base = process.env.TEST_CONFIGURED_BASE_URL;
test(
  "configured private routes reject unauthenticated requests and incomplete links",
  { skip: !base },
  async () => {
    const id = "3fa85f64-5717-4562-b3fc-2c963f66afa6";
    for (const path of [
      "/admin/analytics",
      "/admin/messages",
      "/admin/messages/" + id,
    ]) {
      const r = await fetch(base + path, { redirect: "manual" });
      assert.equal(r.status, 307);
      assert.equal(
        new URL(r.headers.get("location")!, base).pathname,
        "/admin/login",
      );
    }
    for (const method of ["GET", "POST", "PATCH"])
      assert.equal(
        (await fetch(base + "/api/admin/messages/" + id, { method })).status,
        401,
      );
    assert.equal((await fetch(base + "/api/admin/export")).status, 401);
    assert.equal((await fetch(base + "/api/messages/read")).status, 405);
    assert.equal((await fetch(base + "/api/messages/reply")).status, 405);
    const bad = await fetch(base + "/api/messages/read", {
      method: "POST",
      headers: { Origin: base!, "Content-Type": "application/json" },
      body: JSON.stringify({ access: "invalid" }),
    });
    assert.equal(bad.status, 400);
    const cross = await fetch(base + "/api/messages/read", {
      method: "POST",
      headers: {
        Origin: "https://other.example",
        "Content-Type": "application/json",
      },
      body: "{}",
    });
    assert.equal(cross.status, 403);
    assert.equal((await fetch(base + "/messages")).status, 200);
  },
);
