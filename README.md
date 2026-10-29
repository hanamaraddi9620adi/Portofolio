# Hanamaraddi Kanakannavar — Portfolio

Next.js 16 App Router + TypeScript portfolio in E:\Portofolio\Portofolio_codex, with original Three.js terrain, personal photographs, seven project case studies, consented viewer analytics and private two-way conversations.

## Open locally

Double-click **START-PORTFOLIO.cmd**, then open **http://localhost:3100**. The launcher uses port 3100 and sets the matching request origin. Dependencies are installed; a fresh clone needs npm ci first. Keep the server running while you use the website.

## Your connected Supabase project

- Project: **Portofolio**, Mumbai (ap-south-1).
- Dashboard: https://supabase.com/dashboard/project/rorrpbyiyycnbbemjiio
- API URL: https://rorrpbyiyycnbbemjiio.supabase.co
- New-project cost quoted by Supabase at setup: **$0/month**; usage/plan changes are provider-managed.
- Your confirmed owner account is allowlisted by BOTH user UUID and email in the ignored .env.local file.
- Tables and RLS, the portfolio-data Edge Function, rate limiting and daily retention have been installed.
- No private credential or password is committed. .env.local and .vercel are ignored.

## Where you see visitors and messages

1. Sign in at **/admin/login** using your Supabase owner email/password.
2. **/admin/analytics** shows real consented page views, unique browser sessions, project engagement, referral domains, voluntary professional visits and contact submissions. Date filters and private CSV export are included.
3. Choose **Open message inbox** or visit **/admin/messages**. Open a conversation to read and reply; close/reopen it as needed. New visitor replies return the conversation to Awaiting reply.
4. Visitors submit the contact form, then receive a private **/messages#...** link. Saving that link lets them read your reply and write back without an account. Replies refresh every 20 seconds while the tab is visible. There are no email notifications.

Anyone holding a private conversation link can access that thread. The link contains a random 256-bit secret in its URL fragment; only its SHA-256 hash is stored. It is never put in a query string or analytics event. Lost links cannot be recovered automatically. Conversation pages are excluded from indexing and analytics.

## Analytics privacy

Tracking begins only after consent. Records contain timestamps, allowlisted page paths, sanitized referral domains, random per-tab session IDs and approved click types. No raw IP addresses, full user agents or fingerprints are persisted in analytics. Session counts are not unique people. Names are available only from voluntary submissions; this does not identify anonymous visitors.

Owner traffic is excluded server-side and owner login sets portfolio-exclude=true in browser localStorage. Rate limiting uses rotating keyed network hashes separately from analytics. /privacy documents the collection and retention. The daily cron job retains analytics for 90 days and contact/identity records for 180 days; messages cascade-delete with their original contact submission. The conversation retention period runs from its ORIGINAL submission date, not its latest reply.

## Architecture and content

- src/app: public pages, project case studies, private dashboard, inbox and API handlers.
- src/components: navigation, photos, consent, validated forms, charts and conversation UI.
- src/content: profile.ts, projects.ts and photos.ts are the main editing points.
- src/lib: validation, owner authorization, aggregation and server-only data access.
- src/proxy.ts: early anonymous redirects; every private page/API ALSO verifies the owner on the server.
- supabase/migrations: schema, privacy boundaries, atomic message writes and retention.
- supabase/functions/portfolio-data: restricted server data bridge.
- scripts/check-supabase.mjs: live connection/access-boundary checks without printing keys.
- tests: input validation and configured/unconfigured HTTP boundary checks.

Public routes: /, /projects/[slug], /resume, /privacy, /guestbook. Private conversation UI: /messages. Owner routes: /admin/login, /admin/analytics, /admin/messages, /admin/messages/[id].

## Server data access

The current setup uses a scoped **SUPABASE_BRIDGE_SECRET**. Next.js sends authenticated data requests to portfolio-data. The function verifies the secret against a stored hash, restricts resources/methods, and performs the permitted database operation using Supabase's internal service key. The service key never leaves Supabase. The bridge rejects requests without its application credential and forbids access to unrelated tables and credential verifiers.

The function has verify_jwt=false because it implements its own server-key authentication. This does NOT make its data public. No CORS access is provided. Do not expose SUPABASE_BRIDGE_SECRET through NEXT_PUBLIC, a browser bundle, Git or logs.

Direct service-role mode remains supported as an alternative if you deliberately configure SUPABASE_SERVICE_ROLE_KEY. Normal deployments should use the already configured bridge credential and leave the service-role variable empty. Public/publishable keys alone cannot read or write the portfolio tables.

## Vercel deployment — remaining step

The website itself has not been deployed by this chat. The Supabase backend is connected and its Edge Function is deployed. You chose to handle Vercel deployment yourself.

1. Import https://github.com/hanamaraddi9620adi/Portofolio in Vercel with the Next.js preset and repository root.
2. Copy the values from your LOCAL ignored .env.local into Vercel environment settings. Never paste private keys into chat or GitHub.
3. Set NEXT_PUBLIC_SITE_URL to your exact public HTTPS origin (no trailing slash). This must match the hostname used for forms and login. Redirect other domain aliases to that canonical domain.
4. Keep NEXT_PUBLIC_ANALYTICS_ENABLED=true for production; disable it or use a separate database for test previews.
5. Contact/visit forms use signed, expiring, single-use form tokens, a honeypot, same-origin checks and persistent rate limits. Cloudflare Turnstile is optional: configure both NEXT_PUBLIC_TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY together for additional protection. A partially configured integration fails closed.
6. Deploy/redeploy, then test consent, contact receipts, owner login, a private reply, CSV export and anonymous/private data boundaries against the deployed origin.

Required variables:

| Variable                       | Value/source                                                            |
| ------------------------------ | ----------------------------------------------------------------------- |
| NEXT_PUBLIC_SITE_URL           | Exact site origin; localhost:3100 locally, assigned HTTPS URL in Vercel |
| SUPABASE_URL                   | Already configured project API URL                                      |
| SUPABASE_ANON_KEY              | Already configured Supabase publishable key                             |
| SUPABASE_BRIDGE_SECRET         | Already generated and saved privately in .env.local                     |
| OWNER_EMAIL                    | Your confirmed Supabase owner email                                     |
| OWNER_USER_ID                  | Your confirmed Supabase user UUID                                       |
| RATE_LIMIT_SECRET              | Already generated and saved privately in .env.local                     |
| NEXT_PUBLIC_ANALYTICS_ENABLED  | true in configured production                                           |
| NEXT_PUBLIC_TURNSTILE_SITE_KEY | Optional Cloudflare widget public key (requires matching secret)        |
| TURNSTILE_SECRET_KEY           | Optional Cloudflare widget secret                                       |

## Recreating the backend in another project

Inspect existing tables first. For a NEW project apply 001_portfolio.sql, 003_private_conversations.sql, 004_scoped_server_access.sql and 005_rate_limit_hardening.sql, then 002_retention.sql (pg_cron). Do not rerun the initial schema against an existing database.

Deploy the portfolio-data Edge Function; provision a freshly generated application secret and store ONLY its SHA-256 verifier in portfolio_server_credentials. Store the raw secret only in the Next.js server environment. Update supabase/config.toml to the intended project before using the CLI. Alternatively use direct service-role mode and omit the bridge. Never retrieve or expose the platform service key through a public function.

To revoke the bridge, mark its credential row revoked=true in the Supabase SQL Editor. Rotation requires replacing both the verifier and the Next.js environment value. Existing schema/credentials should not be recreated on routine Vercel deployments.

## Verification

Run npm run lint, npm run typecheck, npm test and npm run build. Run **npm run check:supabase** locally to verify real server access, blocked public reads and bridge restrictions. The configured HTTP suite uses TEST_CONFIGURED_BASE_URL=http://localhost:3100. The legacy unconfigured HTTP suite requires TEST_BASE_URL and expects missing-provider errors; do not run it against this connected setup. No test visitor records are intentionally retained.

See docs/VERIFICATION.md and docs/LAUNCH-CHECKLIST.md. The Supabase security advisor reports RLS-without-policy informational notices; these are intentional because all public grants are revoked. Its existing leaked-password-protection setting is disabled; review the provider's account setting: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection.

The runtime dependency audit previously passed. Development lint tooling has an upstream braces dependency advisory; see the verification report. It was not remediated by forcing an incompatible framework downgrade.

## Assets and limitations

- Add your actual PDF at public/resume/hanamaraddi-kanakannavar.pdf and rebuild. Until then the resume page offers an email request.
- Personal photographs are supplied originals. The card tilt is a photo-depth effect, not a reconstructed 3D face.
- Unsupported project scores, unverified live demos and financial returns are not published. See docs/CONTENT-SOURCES.md.
- Owner login expires with the Supabase access token; sign in again after expiry. No long-lived refresh token is persisted. Legacy contact records created before private inboxes must be answered by their supplied email address.
- Message replies are visible through the private link; email notifications and account-based link recovery are not configured.

SwingLens now has a selected-work card and a dedicated /projects/swinglens case study with the confirmed public app link https://swinglens-cyan.vercel.app/ and the supplied 7:26 walkthrough. The optimized video is stored at public/videos/swinglens-walkthrough.mp4 (about 11.3 MiB), uses native playback controls, and loads on demand. The source recording remains at its original user-supplied location.
