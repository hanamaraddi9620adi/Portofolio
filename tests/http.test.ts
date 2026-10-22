import test from "node:test";
import assert from "node:assert/strict";
const base = process.env.TEST_BASE_URL;
test(
  "public pages and private data boundary (running preview required)",
  { skip: !base },
  async () => {
    for (const route of [
      "/",
      "/resume",
      "/privacy",
      "/guestbook",
      "/projects/bangalore-house-prices",
      "/projects/navia",
      "/projects/employee-management",
      "/projects/crypto-profit-calculator",
      "/projects/phishshield-ai",
      "/projects/quantedge-ai",
      "/sitemap.xml",
      "/robots.txt",
    ]) {
      const r = await fetch(base + route);
      assert.equal(r.status, 200, route);
    }
    const admin = await fetch(base + "/admin/analytics", {
      redirect: "manual",
    });
    assert.equal(admin.status, 307);
    assert.equal(
      new URL(admin.headers.get("location")!, base).pathname,
      "/admin/login",
    );
    assert.equal((await fetch(base + "/api/admin/export")).status, 401);
    assert.equal((await fetch(base + "/api/contact")).status, 405);
    assert.equal((await fetch(base + "/api/visit")).status, 405);
    assert.equal((await fetch(base + "/api/events")).status, 405);
    const post = (path: string, data: unknown, origin = base!) =>
      fetch(base + path, {
        method: "POST",
        headers: { origin, "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    assert.equal(
      (await post("/api/contact", {}, "https://evil.example")).status,
      403,
    );
    assert.equal((await post("/api/contact", {})).status, 400);
    assert.equal(
      (
        await post("/api/contact", {
          name: "Testing",
          email: "test@example.com",
          message: "A complete test message.",
          consent: true,
        })
      ).status,
      503,
    );
    assert.equal(
      (await post("/api/visit", { name: "Testing", consent: false })).status,
      400,
    );
    assert.equal(
      (await post("/api/visit", { name: "Testing", consent: true })).status,
      503,
    );
    assert.equal(
      (
        await post("/api/events", {
          type: "page_view",
          path: "/",
          sessionId: crypto.randomUUID(),
          referrer: "",
          consent: false,
        })
      ).status,
      400,
    );
    assert.equal(
      (
        await post("/api/auth/login", {
          email: "test@example.com",
          password: "invalid",
        })
      ).status,
      503,
    );
    assert.equal((await fetch(base + "/projects/not-a-project")).status, 404);
  },
);
