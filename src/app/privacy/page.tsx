import { profile } from "@/content/profile";
export const metadata = { title: "Privacy" };
export default function Privacy() {
  return (
    <main id="main" className="page-shell prose">
      <p className="eyebrow">YOUR VISIT, YOUR CHOICE</p>
      <h1>
        Privacy, <span className="serif">by intent.</span>
      </h1>
      <p>
        Last updated: 22 October 2026. This portfolio is operated by{" "}
        {profile.name} in Bengaluru, India.
      </p>
      <h2>Optional analytics</h2>
      <p>
        Analytics remain off until you choose “Allow analytics.” If enabled and
        connected, the site records the time, the public page path, referring
        domain (without a query string), a random browser-session identifier,
        and events such as project views, resume-download clicks, and contact or
        social-link clicks. We do not store raw IP addresses, full user-agent
        strings, browsing fingerprints or precise location in analytics.
      </p>
      <p>
        A browser session is not a person. Session counts cannot identify
        anonymous visitors and are not exact counts of real individuals.
        Download events measure clicks, not completed downloads. No
        device-category data is collected.
      </p>
      <h2>Your controls</h2>
      <p>
        Use “Privacy settings” at the bottom of any public page to change your
        choice. Declining stops future analytics and removes the session
        identifier from this tab. Your preference is stored locally in your
        browser. Previously saved records remain until the retention period
        expires or a deletion request can be matched.
      </p>
      <h2>A professional introduction</h2>
      <p>
        The optional visit form saves only the details you submit with explicit
        consent. These are visible only in the owner’s dashboard. A separate
        checkbox permits linking your submitted identity to your consented
        session. This link is browser-supplied and is not proof of identity. No
        LinkedIn authentication or background identification takes place.
      </p>
      <h2>Contact messages</h2>
      <p>
        Messages and reply addresses are saved privately so I can respond.
        Submitting the form does not subscribe you to a mailing list. A success
        message means the submission was saved, not that an email was delivered.
      </p>
      <h2>Security and service providers</h2>
      <p>
        Supabase provides database storage and owner authentication when
        configured. Vercel may host this site. Cloudflare Turnstile protects
        production forms and may process device and network information for
        fraud prevention. Infrastructure providers may retain operational logs
        under their own policies. The application temporarily stores a rotating,
        keyed network hash for rate limiting; it is not used to identify
        visitors or correlate analytics. No raw address is persisted by
        application code.
      </p>
      <h2>Retention</h2>
      <p>
        The supplied retention job deletes analytics after 90 days and voluntary
        visits and contact messages after 180 days. Rate-limit records expire
        after two hours and are cleaned on subsequent writes and by the daily
        job. These periods depend on the operator enabling the documented
        database retention job. Provider backups may follow separate retention
        schedules.
      </p>
      <h2>Access or deletion</h2>
      <p>
        Contact{" "}
        <a className="text-link" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>{" "}
        to request access, correction or deletion of voluntarily submitted
        details. Include enough information to locate your submission. Anonymous
        records may not be attributable to you.
      </p>
    </main>
  );
}
