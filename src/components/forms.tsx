"use client";
import Script from "next/script";
import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: Record<string, unknown>) => string;
      reset: (id: string) => void;
    };
  }
}
export function PublicForm({
  kind = "contact",
}: {
  kind?: "contact" | "visit";
}) {
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [ok, setOk] = useState(false);
  const [inboxLink, setInboxLink] = useState("");
  const widget = useRef<HTMLDivElement>(null),
    widgetId = useRef<string | undefined>(undefined);
  const key = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  function renderWidget() {
    if (key && widget.current && window.turnstile && !widgetId.current)
      widgetId.current = window.turnstile.render(widget.current, {
        sitekey: key,
        theme: "dark",
      });
  }
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    const form = e.currentTarget;
    const fields = Object.fromEntries(new FormData(form));
    try {
      const payload = {
        ...fields,
        consent: fields.consent === "on",
        linkSession: fields.linkSession === "on",
        sessionId:
          fields.linkSession === "on" &&
          localStorage.getItem("analytics-consent") === "yes"
            ? sessionStorage.getItem("portfolio-session")
            : undefined,
        token: fields["cf-turnstile-response"] || "",
      };
      const response = await fetch(`/api/${kind}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      setOk(response.ok);
      setMessage(
        response.ok
          ? kind === "contact"
            ? "Your message has been saved. Thank you for reaching out."
            : "Your professional visit has been saved privately. Thank you."
          : result.error || "Unable to save. Please try email.",
      );
      if (response.ok) {
        form.reset();
        if (kind === "contact" && result.inboxAccess)
          setInboxLink(
            window.location.origin + "/messages#" + result.inboxAccess,
          );
      }
    } catch {
      setOk(false);
      setMessage("Connection interrupted. Please try again or use email.");
    } finally {
      setBusy(false);
      if (widgetId.current) window.turnstile?.reset(widgetId.current);
    }
  }
  return (
    <form onSubmit={submit} className="public-form">
      <div className="form-row">
        <label>
          Your name
          <input
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
            placeholder="Alex Morgan"
          />
        </label>
        <label>
          {kind === "contact" ? "Email address" : "Email (optional)"}
          <input
            name="email"
            type="email"
            autoComplete="email"
            required={kind === "contact"}
            maxLength={254}
            placeholder="you@company.com"
          />
        </label>
      </div>
      {kind === "visit" && (
        <>
          <div className="form-row">
            <label>
              Company / institution
              <input name="company" maxLength={120} />
            </label>
            <label>
              Professional role
              <input name="role" maxLength={120} />
            </label>
          </div>
          <label>
            LinkedIn URL (optional)
            <input
              name="linkedin"
              type="url"
              placeholder="https://www.linkedin.com/in/…"
              maxLength={300}
            />
          </label>
        </>
      )}
      <label>
        {kind === "contact"
          ? "What would you like to build?"
          : "Message (optional)"}
        <textarea
          name="message"
          required={kind === "contact"}
          minLength={kind === "contact" ? 10 : undefined}
          maxLength={3000}
          rows={4}
          placeholder="Tell me a little about your idea or opportunity…"
        />
      </label>
      <div className="honeypot" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="check">
        <input name="consent" type="checkbox" required />{" "}
        <span>
          I agree to privately store these details{" "}
          {kind === "contact"
            ? "so you can respond"
            : "as a professional visit"}
          . <Link href="/privacy">Privacy notice</Link>
        </span>
      </label>
      {kind === "visit" && (
        <label className="check">
          <input name="linkSession" type="checkbox" />
          <span>
            Also link this visit to my consented analytics session (optional).
          </span>
        </label>
      )}
      {key && (
        <>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            onReady={renderWidget}
          />
          <div ref={widget} />
        </>
      )}
      <button className="button primary" disabled={busy}>
        {busy
          ? "Saving…"
          : kind === "contact"
            ? "Send message"
            : "Leave a professional visit"}
        <ArrowUpRight size={17} />
      </button>
      <p role="status" className={ok ? "form-success" : "form-status"}>
        {message}
      </p>
      {inboxLink && (
        <div className="inbox-receipt">
          <strong>Keep the conversation going.</strong>
          <p>
            Your private link lets you read my replies and respond. Save it now;
            it cannot be recovered from this browser after you leave. Anyone
            with the link can read this conversation. No email notification is
            sent.
          </p>
          <a className="button primary" href={inboxLink}>
            Open your private conversation ↗
          </a>
          <label>
            Save this private link
            <input
              readOnly
              aria-label="Private conversation link"
              value={inboxLink}
              onFocus={(e) => e.currentTarget.select()}
            />
          </label>
        </div>
      )}
    </form>
  );
}
