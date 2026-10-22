"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
export function AnalyticsConsent() {
  const path = usePathname();
  const [choice, setChoice] = useState<string | null>("loading");
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setChoice(localStorage.getItem("analytics-consent"));
      } catch {
        setChoice("no");
      }
    }, 0);
    function syncConsent(event: StorageEvent) {
      if (event.key === "analytics-consent") {
        setChoice(event.newValue);
        if (event.newValue !== "yes") {
          try {
            sessionStorage.removeItem("portfolio-session");
          } catch {}
        }
      }
    }
    window.addEventListener("storage", syncConsent);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("storage", syncConsent);
    };
  }, []);
  useEffect(() => {
    if (
      choice !== "yes" ||
      path.startsWith("/admin") ||
      process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "true"
    )
      return;
    let session: string;
    try {
      if (localStorage.getItem("portfolio-exclude") === "true") return;
      session =
        sessionStorage.getItem("portfolio-session") || crypto.randomUUID();
      sessionStorage.setItem("portfolio-session", session);
    } catch {
      return;
    }
    function track(type: string) {
      let referrer = "";
      try {
        referrer = document.referrer ? new URL(document.referrer).hostname : "";
      } catch {}
      void fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          path,
          sessionId: session,
          referrer,
          consent: true,
        }),
        keepalive: true,
      }).catch(() => {});
    }
    track("page_view");
    function click(e: MouseEvent) {
      const target = (e.target as Element).closest<HTMLElement>("[data-event]");
      if (target?.dataset.event) track(target.dataset.event);
    }
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, [choice, path]);
  function choose(value: string) {
    try {
      localStorage.setItem("analytics-consent", value);
      if (value === "no") sessionStorage.removeItem("portfolio-session");
    } catch {}
    setChoice(value);
  }
  if (path.startsWith("/admin")) return null;
  return (
    <>
      {choice === null && (
        <aside className="consent" aria-label="Analytics preference">
          <div>
            <strong>A little insight. Only with your permission.</strong>
            <p>
              Allow anonymous page and click counts? No fingerprints or IP
              storage. <Link href="/privacy">Details</Link>
            </p>
          </div>
          <div className="consent-actions">
            <button onClick={() => choose("no")}>Decline</button>
            <button className="button small" onClick={() => choose("yes")}>
              Allow analytics
            </button>
          </div>
        </aside>
      )}
      <button className="privacy-control" onClick={() => setChoice(null)}>
        Privacy settings
      </button>
    </>
  );
}
