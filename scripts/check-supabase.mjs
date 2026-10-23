import fs from "node:fs";
const env = Object.fromEntries(
  fs
    .readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => /^[A-Z_]+=/.test(l))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i), l.slice(i + 1)];
    }),
);
const required = [
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "SUPABASE_BRIDGE_SECRET",
  "OWNER_USER_ID",
  "OWNER_EMAIL",
  "RATE_LIMIT_SECRET",
];
const missing = required.filter((k) => !env[k]);
if (missing.length) {
  console.log("Missing configuration: " + missing.join(", "));
  process.exit(2);
}
const key = env.SUPABASE_ANON_KEY,
  base = env.SUPABASE_URL;
for (const table of [
  "page_views",
  "analytics_events",
  "identified_visitors",
  "contact_submissions",
  "conversation_messages",
]) {
  const publicRead = await fetch(
    base + "/rest/v1/" + table + "?select=id&limit=1",
    { headers: { apikey: key, Authorization: "Bearer " + key } },
  );
  if (publicRead.status !== 401 && publicRead.status !== 403) {
    console.error(
      "FAIL: public read boundary " + table + " " + publicRead.status,
    );
    process.exitCode = 1;
  } else console.log("PASS: public reads blocked for " + table);
  const response = await fetch(base + "/functions/v1/portfolio-data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + env.SUPABASE_BRIDGE_SECRET,
    },
    body: JSON.stringify({
      path: table + "?select=id&limit=0",
      method: "GET",
      headers: { accept: "application/json" },
    }),
  });
  if (!response.ok) {
    console.error("FAIL: server storage " + table + " " + response.status);
    process.exitCode = 1;
  } else console.log("PASS: private server storage " + table);
}
for (const operation of [
  { path: "auth/users", method: "GET" },
  { path: "portfolio_server_credentials?select=*", method: "GET" },
]) {
  const r = await fetch(base + "/functions/v1/portfolio-data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + env.SUPABASE_BRIDGE_SECRET,
    },
    body: JSON.stringify(operation),
  });
  console.log(
    (r.status === 403 ? "PASS" : "FAIL") +
      ": bridge rejects unrelated resource " +
      r.status,
  );
  if (r.status !== 403) process.exitCode = 1;
}
const unauth = await fetch(base + "/functions/v1/portfolio-data", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: "{}",
});
console.log(
  (unauth.status === 401 ? "PASS" : "FAIL") +
    ": bridge rejects missing server credential",
);
if (unauth.status !== 401) process.exitCode = 1;
