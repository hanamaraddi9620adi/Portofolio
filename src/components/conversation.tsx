"use client";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { inboxAccessSchema } from "@/lib/conversation-validation";
type Thread = {
  id: string;
  name: string;
  email?: string;
  status: "new" | "replied" | "closed";
  hasInbox: boolean;
  messages: {
    id: string;
    author: "owner" | "visitor";
    body: string;
    created_at: string;
  }[];
};
export function Conversation({ ownerId }: { ownerId?: string }) {
  const [sendError, setSendError] = useState(false);
  const [thread, setThread] = useState<Thread | null>(null),
    [access, setAccess] = useState(""),
    [ready, setReady] = useState(false),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [draft, setDraft] = useState(""),
    [feedback, setFeedback] = useState("");
  const attempt = useRef<{ body: string; id: string } | null>(null);
  useEffect(() => {
    function readLink() {
      const value = window.location.hash.slice(1);
      setThread(null);
      setDraft("");
      setAccess(value);
      setReady(true);
    }
    readLink();
    window.addEventListener("hashchange", readLink);
    return () => window.removeEventListener("hashchange", readLink);
  }, []);
  const load = useCallback(async () => {
    if (!ownerId && !inboxAccessSchema.safeParse(access).success) return;
    try {
      const response = await fetch(
        ownerId ? "/api/admin/messages/" + ownerId : "/api/messages/read",
        ownerId
          ? { cache: "no-store" }
          : {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ access }),
              cache: "no-store",
            },
      );
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Unable to open conversation.");
      setThread(result);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Connection interrupted.");
    }
  }, [ownerId, access]);
  useEffect(() => {
    const initial = setTimeout(() => {
      void load();
    }, 0);
    const timer = setInterval(() => {
      if (!document.hidden) void load();
    }, 20000);
    return () => {
      clearTimeout(initial);
      clearInterval(timer);
    };
  }, [load]);
  async function send(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setFeedback("");
    setSendError(false);
    if (!attempt.current || attempt.current.body !== draft)
      attempt.current = { body: draft, id: crypto.randomUUID() };
    try {
      const response = await fetch(
        ownerId ? "/api/admin/messages/" + ownerId : "/api/messages/reply",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access,
            message: draft,
            requestId: attempt.current.id,
          }),
        },
      );
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Reply could not be saved.");
      setDraft("");
      attempt.current = null;
      setFeedback("Reply saved.");
      await load();
    } catch (e) {
      setSendError(true);
      setFeedback(
        e instanceof Error
          ? e.message
          : "Connection interrupted. Retry to check the same reply.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function status() {
    setBusy(true);
    try {
      const response = await fetch("/api/admin/messages/" + ownerId, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: thread?.status === "closed" ? "new" : "closed",
        }),
      });
      if (!response.ok) throw new Error("Status could not be updated.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to update status.");
    } finally {
      setBusy(false);
    }
  }
  if (!ownerId && ready && !inboxAccessSchema.safeParse(access).success)
    return (
      <div className="notice">
        <h2>Your private conversation link is needed</h2>
        <p>
          Open the full link saved after your contact message. It includes a
          private access code after the # sign. No account is needed.
        </p>
        <Link className="button" href="/#contact">
          Start a conversation ↗
        </Link>
      </div>
    );
  return (
    <div className="conversation">
      <div className="conversation-toolbar">
        <span>
          {thread
            ? thread.status === "closed"
              ? "Conversation closed"
              : "Private conversation"
            : "Opening conversation…"}
        </span>
        <button className="button small" onClick={() => void load()}>
          Refresh
        </button>
        {ownerId && thread && (
          <button
            className="button small"
            disabled={busy}
            onClick={() => void status()}
          >
            {thread.status === "closed" ? "Reopen" : "Close conversation"}
          </button>
        )}
      </div>
      {error && (
        <p role="alert" className="form-status">
          {error}
        </p>
      )}
      {ownerId && thread && (
        <p>
          {thread.name} · {thread.email}
        </p>
      )}
      <div className="message-list" aria-label="Conversation messages">
        {thread?.messages.map((m) => (
          <article className={"message-bubble " + m.author} key={m.id}>
            <div className="message-meta">
              <strong>
                {m.author === "owner"
                  ? "Hanamaraddi"
                  : ownerId
                    ? thread.name
                    : "You"}
              </strong>
              <time dateTime={m.created_at}>
                {new Date(m.created_at).toLocaleString()}
              </time>
            </div>
            <p>{m.body}</p>
          </article>
        ))}
      </div>
      {thread?.hasInbox && thread.status !== "closed" && (
        <form className="public-form reply-form" onSubmit={send}>
          <label>
            Your reply
            <textarea
              required
              maxLength={3000}
              rows={4}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
          </label>
          <button className="button primary" disabled={busy}>
            {busy ? "Saving…" : "Send reply ↗"}
          </button>
          <p
            role="status"
            className={sendError ? "form-status" : "form-success"}
          >
            {feedback}
          </p>
        </form>
      )}
      {thread?.status === "closed" && (
        <p>
          This conversation is closed.{" "}
          {ownerId
            ? "Reopen it to reply."
            : "You can start a new conversation from the contact form."}
        </p>
      )}
      {ownerId && thread && !thread.hasInbox && (
        <p>
          This submission predates private inboxes.{" "}
          <a
            className="text-link"
            href={"mailto:" + encodeURIComponent(thread.email || "")}
          >
            Reply by email ↗
          </a>
        </p>
      )}
      <p className="micro">
        MESSAGES REFRESH EVERY 20 SECONDS WHILE THIS TAB IS VISIBLE.
      </p>
    </div>
  );
}
