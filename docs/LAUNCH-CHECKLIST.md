# Launch checklist

- [ ] Add actual resume PDF and rebuild; test viewing and downloading.
- [ ] Confirm portfolio copy and add only verified source/demo links.
- [ ] Configure Supabase URL, anon key and server-only service-role key.
- [ ] Run 001 migration; verify RLS and revoked public grants on all five tables.
- [ ] Create verified owner; disable public signup; set OWNER_EMAIL and OWNER_USER_ID.
- [ ] Set a random RATE_LIMIT_SECRET of at least 32 characters.
- [ ] Configure Turnstile keys/hostname; test valid, invalid and expired token behavior.
- [ ] Enable pg_cron, run 002 migration and confirm successful job execution.
- [ ] Set production canonical URL before building. Check sitemap, OG image and canonical host.
- [ ] Set analytics enabled in production; disable for previews or isolate storage.
- [ ] Run lint, typecheck, tests and build; review development dependency advisory updates.
- [ ] Test anonymous and unauthorized-user dashboard/export rejection with configured auth.
- [ ] Test direct Supabase table reads with anon and ordinary user keys; no records accessible.
- [ ] Verify form writes, no-consent rejection, explicit identity linking and real errors on storage failure.
- [ ] Verify no writes before consent and after withdrawal; verify owner exclusion.
- [ ] Check desktop, tablet and mobile; test keyboard focus and OS reduced-motion setting.
- [ ] Review retention/privacy notice against actual deployment/provider settings.
- [ ] Deploy on Vercel and repeat checks against the production hostname.

## Connected Supabase status — 23 October 2026

Project, database schema, scoped server function, confirmed owner allowlist, access-boundary checks, private replies and retention schedule are complete. Before deploying on Vercel, copy the private values from .env.local into Vercel settings, set the final canonical origin and configure production Turnstile keys. Do not rerun initial migrations on the connected project. See README.md for the current setup; earlier unchecked items above are historical launch prompts.
