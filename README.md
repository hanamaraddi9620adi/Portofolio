# Hanamaraddi Kanakannavar — Portfolio

A custom Next.js App Router + TypeScript portfolio, built in `E:\Portofolio\Portofolio_codex`. Graphite backgrounds, vermilion typography, original Three.js terrain, responsive project case studies, consent-aware analytics and a private owner dashboard. No ThreeUI source or imagery is used.

## Run locally

Double-click `START-PORTFOLIO.cmd`, then open **http://localhost:3100**. Dependencies are already installed. The launcher intentionally uses 3100 because another application occupied 3000 during development.

Alternatively, in PowerShell:

```powershell
cd E:\Portofolio\Portofolio_codex
npm.cmd ci
Copy-Item .env.example .env.local
# Edit .env.local with provider values. The public site runs without them.
npm.cmd run dev
```

The normal dev script uses http://localhost:3000. `NEXT_PUBLIC_SITE_URL` must exactly match the origin visitors use, including port, for form CSRF checks. Do not use `127.0.0.1` when the configured origin is `localhost`. The launcher sets this value to 3100 for its session.

## Architecture and editing

```text
src/
  app/                 App Router pages, metadata, API endpoints
    projects/[slug]/   Six reusable, data-driven case studies
    admin/             Owner sign-in and analytics dashboard
    api/               Validated writes, authentication, protected CSV export
  components/          Header, Three.js scene, forms, consent, charts
  content/             profile.ts and projects.ts: edit portfolio facts here
  lib/                 Validation, server-only Supabase/auth, aggregation
  proxy.ts             Early anonymous dashboard redirect
supabase/migrations/   Tables, RLS, atomic rate limits, retention job
public/resume/         Add your real PDF here
tests/                 Input validation and HTTP boundary checks
docs/                  Verification evidence and launch checklist
```

Styling and tokens are in `src/app/globals.css`. Fonts are self-hosted through Fontsource; no Google Fonts request is needed. Three.js loads lazily, limits device-pixel ratio, pauses offscreen/in background tabs and has a static SVG fallback. Recharts is used only by the private dashboard. React server components serve the public content. CSS provides responsive behavior, focus states and reduced-motion support.

## Routes

| Route                                       | Behavior                                                                      |
| ------------------------------------------- | ----------------------------------------------------------------------------- |
| `/`                                         | Work, about, toolkit, education, achievements, hackathons, contact            |
| `/projects/[slug]`                          | Six project case studies, architecture, results and limitations               |
| `/resume`                                   | Actual PDF preview/download when provided; honest unavailable state otherwise |
| `/privacy`                                  | Collection, consent, retention and provider disclosure                        |
| `/guestbook`                                | Optional private professional introduction                                    |
| `/admin/login`                              | Supabase password login for a verified allowlisted owner                      |
| `/admin/analytics`                          | Server-protected metrics, charts, tables and date filters                     |
| `/api/admin/export`                         | Owner-only event CSV without visitor identity fields                          |
| `/api/contact`, `/api/visit`, `/api/events` | Write-only validated endpoints; GET is rejected                               |

## Supabase setup

1. Create a Supabase project. Keep the service-role key private.
2. Run `supabase/migrations/001_portfolio.sql` in the SQL Editor once. All five tables have RLS enabled and all privileges revoked from `anon` and `authenticated`. There are deliberately no public policies. Only server-side service-role operations can access records.
3. Enable **pg_cron** under Database → Extensions. Run `002_retention.sql` once. Confirm the `portfolio-daily-retention` job is active and inspect `cron.job_run_details` after it runs. Without this step, automatic retention is not active.
4. Disable public signups in Supabase Auth. Create the owner's email/password account, complete email verification, and copy its user UUID. Use a unique strong password; do not put it in the repository or environment file.
5. Fill the environment variables below. The application requires BOTH an exact user ID and a verified matching email for every private read/export.
6. Create a Cloudflare Turnstile widget restricted to your production hostname and local development hostname if desired. Configure both keys. Production contact/visit forms fail closed without Turnstile. Tokens are verified server-side, including hostname.
7. Rebuild/restart after changing configuration, especially `NEXT_PUBLIC_*` variables.

### Environment variables

| Variable                         | Purpose                                                                     |
| -------------------------------- | --------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`           | Canonical origin, e.g. `https://your-project.vercel.app`, no trailing slash |
| `SUPABASE_URL`                   | Project URL from Supabase                                                   |
| `SUPABASE_ANON_KEY`              | Public anon/publishable key, used server-side for Supabase authentication   |
| `SUPABASE_SERVICE_ROLE_KEY`      | Secret service-role key, **server only**; never prefix with NEXT_PUBLIC     |
| `OWNER_EMAIL`                    | Verified owner email; initial value supplied in `.env.example`              |
| `OWNER_USER_ID`                  | Exact UUID of that Supabase Auth user                                       |
| `RATE_LIMIT_SECRET`              | Random secret of at least 32 characters                                     |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Public Cloudflare widget key                                                |
| `TURNSTILE_SECRET_KEY`           | Private Cloudflare verification secret                                      |
| `NEXT_PUBLIC_ANALYTICS_ENABLED`  | `true` in configured production; `false` for local/test deployments         |

Generate a rate-limit secret locally using `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`; paste it into `.env.local` and Vercel, never into a commit or chat.

## Analytics behavior and limitations

- Tracking starts only after opt-in. It records allowlisted public paths, timestamps, referring **domains**, random per-tab session IDs and approved event types. No query strings, raw IP addresses, full user agents or fingerprints are stored in analytics.
- Anonymous visits cannot reveal real identities. Sessions are not unique people. Identified-visitor metrics count self-submitted visit records, not verified individuals. Resume downloads count clicks, not successful transfers.
- Identity records live separately. Only the visit form's additional linking checkbox attaches a consented browser session; this is self-reported, not authentication.
- Contact messages are stored in the private database; **no email sending provider is installed**. Success means the database accepted a message. Email fallback is always visible.
- Public endpoints validate origin, JSON content type, streamed body size, schema and consent. Forms have a honeypot, persistent atomic rate limits, and production Turnstile verification.
- Abuse prevention transiently reads the platform-forwarded network address and stores only an hourly rotating HMAC bucket for at most the cleanup window. It is not attached to analytics. Trust the hosting platform's forwarded headers; custom reverse proxies must overwrite them.
- Anonymous event ingestion cannot guarantee bot-free statistics. Shared networks can share a rate-limit bucket. Hosting providers may keep separate infrastructure logs.
- Dashboard queries paginate real records, reject intervals over 366 days and fail visibly when more than 100,000 records per table would be loaded. They never silently truncate summary counts. Recent identity/contact tables show the latest 100 matching submissions. CSV omits identities and session identifiers and protects against spreadsheet-formula injection.
- Retention: 90 days for analytics; 180 days for contact/identity submissions; rate-limit hashes cleaned after two hours on writes and daily by cron. Backup retention is provider-managed.

### Owner authentication

Visit `/admin/login`. Supabase verifies the password. The access token stays in an HttpOnly, SameSite=Strict cookie (Secure in production); it is never returned to client JavaScript. Each dashboard/export request calls Supabase `getUser` and checks the verified email and user ID. The proxy only provides an early redirect; it is not the authorization boundary. Sessions expire with the Supabase access token, generally around one hour; sign in again. No long-lived refresh token is persisted. Sign-out clears the browser cookie; already issued tokens remain subject to Supabase expiry/revocation behavior.

Authenticated owner events are excluded server-side. Owner login also sets local `portfolio-exclude=true`, which remains after logout to exclude your development browser. Remove this localStorage key through browser developer tools when you intentionally want to test normal visitor behavior. Keep analytics disabled in local environments, or use a separate staging database. Never seed fake traffic into production.

## Assets you still need to supply

- Actual resume PDF: `public/resume/hanamaraddi-kanakannavar.pdf`, then rebuild. No resume was fabricated. Until then the resume page offers an email request.
- Personal portraits are now included. Edit the curated selection in `src/content/photos.ts`. Optional project screenshots can still be supplied.
- Verified repositories/notebooks for house-price prediction, employee management, Crypto Profit Calculator and PhishShield AI, plus any genuine live-demo URLs. Do not add unverified scores or demos.

## Deploy to Vercel

1. Complete the Supabase and Turnstile setup above. Add the resume if ready.
2. Create a GitHub repository, then commit this project and push it. `.gitignore` excludes `.env.local`, dependencies, build output and scratch files. Review the staged diff before pushing. No repository was created or pushed for you.
3. In Vercel, choose **Add New → Project**, import that repository and select the Next.js preset. Keep the repository root as the project root. Use `npm run build`, automatic output directory, and a supported Node.js version (22 or 24).
4. Add all variables from the table in Vercel → Project Settings → Environment Variables. Never expose the service-role key to the client. Set the canonical production origin and `NEXT_PUBLIC_ANALYTICS_ENABLED=true` only after the schema is ready. Keep Preview analytics disabled or use an isolated staging database.
5. Deploy. If the final Vercel domain was unknown, set `NEXT_PUBLIC_SITE_URL` to the assigned URL, update Turnstile's allowed hostname, and redeploy.
6. Verify every public route and the resume. In an incognito browser, `/admin/analytics` must redirect and `/api/admin/export` must return 401. An ordinary authenticated Supabase user must also be rejected.
7. Reject analytics and confirm no event writes; opt in and inspect a real page-view row; change settings to decline and confirm new writes stop. Submit one test contact/visit in a staging database, check real success and owner-only visibility, and verify explicit link consent behavior.
8. Test anon and ordinary authenticated REST queries directly against each Supabase table: no private records may be returned. Confirm Turnstile rejection and rate-limit behavior. Confirm the retention job executes.
9. Sign in at `/admin/login`, inspect real empty/data states and download CSV. Follow `docs/LAUNCH-CHECKLIST.md` before announcing the site.

**Deployment has not been performed.** Supabase, owner authentication, Turnstile and live analytics remain unconfigured because no credentials were supplied. Their real-provider success paths and RLS behavior must be checked after setup.

## Checks

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
# Run the HTTP tests against a separate running, unconfigured local preview:
$env:TEST_BASE_URL='http://localhost:3100'
npm.cmd test
```

The HTTP test intentionally expects missing-provider errors. Do not point it at configured production. With no `TEST_BASE_URL`, only the HTTP suite is skipped; validation tests still run. See `docs/VERIFICATION.md` for actual results and verification limits.

The production dependency audit passed with zero vulnerabilities at implementation time. The full audit reports five dependency-chain advisories arising from `braces` through Next.js ESLint's `fast-glob` dependency (GHSA-vfj7-8cjw-p6xm). Registry latest `braces` was 3.0.3 with no patched release available. Automatic forced remediation would downgrade `eslint-config-next` to 14.x, so it was not applied. This is development lint tooling, not production runtime; review upstream updates before launch.

## Content verification

See `docs/CONTENT-SOURCES.md`. LinkedIn returned HTTP 429, so professional facts use the supplied master prompt. Representative source files and READMEs were inspected for the additional GitHub candidates; the projects themselves were not executed. No employment, skill percentages, performance metrics, live URLs or financial returns were invented.
