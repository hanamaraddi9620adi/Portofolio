"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
export function Login({ email = "" }: { email?: string }) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const router = useRouter();
  const [recoveryBusy, setRecoveryBusy] = useState(false);
  const [recoveryMessage, setRecoveryMessage] = useState("");
  async function recover() {
    setRecoveryBusy(true);
    setRecoveryMessage("");
    try {
      const response = await fetch("/api/auth/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Unable to send recovery email.");
      setRecoveryMessage(
        "If this is the owner email, a recovery link has been sent. Check your inbox and spam folder, and open the latest email.",
      );
    } catch (error) {
      setRecoveryMessage(
        error instanceof Error
          ? error.message
          : "Connection interrupted. Please try again.",
      );
    } finally {
      setRecoveryBusy(false);
    }
  }
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const fields = Object.fromEntries(new FormData(e.currentTarget));
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const body = await r.json();
      if (!r.ok) setError(body.error);
      else {
        try {
          localStorage.setItem("portfolio-exclude", "true");
        } catch {
          // Server-side owner exclusion still applies when browser storage is blocked.
        }
        router.replace("/admin/analytics");
        router.refresh();
      }
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="login-form" onSubmit={submit}>
      <label>
        Owner email
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          defaultValue={email}
        />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </label>
      <p>Use the password created for this portfolio’s owner account.</p>
      <button className="button primary" disabled={busy}>
        {busy ? "Checking access…" : "Sign in securely →"}
      </button>
      <p role="alert" className="form-status">
        {error}
      </p>
      <button type="button" onClick={recover} disabled={recoveryBusy}>
        {recoveryBusy
          ? "Sending recovery email…"
          : "Forgot password? Send a recovery email"}
      </button>
      <p role="status" className="form-status">
        {recoveryMessage}
      </p>
    </form>
  );
}
export function Logout() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      className="button small"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          const r = await fetch("/api/auth/logout", { method: "POST" });
          if (r.ok) {
            router.replace("/admin/login");
            router.refresh();
          }
        } finally {
          setBusy(false);
        }
      }}
    >
      Sign out
    </button>
  );
}
