"use client";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

export function RecoveryRedirect() {
  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    if (
      window.location.pathname !== "/admin/reset-password" &&
      fragment.get("type") === "recovery"
    )
      window.location.replace("/admin/reset-password" + window.location.hash);
  }, []);
  return null;
}

export function PasswordRecovery() {
  const [tokens, setTokens] = useState<{
    accessToken: string;
    refreshToken: string;
  } | null>();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      const fragment = new URLSearchParams(window.location.hash.slice(1));
      const accessToken = fragment.get("access_token");
      const refreshToken = fragment.get("refresh_token");
      // Credentials remain in memory only and are removed from the address bar.
      window.history.replaceState(null, "", window.location.pathname);
      setTokens(
        fragment.get("type") === "recovery" && accessToken && refreshToken
          ? { accessToken, refreshToken }
          : null,
      );
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!tokens) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    if (fields.get("password") !== fields.get("confirm")) {
      setMessage("The passwords do not match.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...tokens, password: fields.get("password") }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "The password could not be updated.");
      form.reset();
      setTokens(null);
      setDone(true);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Connection interrupted. Please retry.",
      );
    } finally {
      setBusy(false);
    }
  }
  if (tokens === undefined) return <p>Opening your recovery link…</p>;
  if (done)
    return (
      <div role="status">
        <p>Your password has been updated. Sign in with your new password.</p>
        <Link className="button primary" href="/admin/login">
          Go to owner sign-in →
        </Link>
      </div>
    );
  if (!tokens)
    return (
      <div role="alert">
        <p>
          Open the latest recovery link sent to your email. If it has expired or
          this page was refreshed, request a new one.
        </p>
        <Link className="button" href="/admin/login">
          Request a recovery email →
        </Link>
      </div>
    );
  return (
    <form className="login-form" onSubmit={submit}>
      <label>
        New password
        <input
          name="password"
          type="password"
          required
          minLength={12}
          maxLength={128}
          autoComplete="new-password"
        />
      </label>
      <label>
        Confirm new password
        <input
          name="confirm"
          type="password"
          required
          minLength={12}
          maxLength={128}
          autoComplete="new-password"
        />
      </label>
      <p>
        Choose 12–128 characters. This changes your portfolio owner password.
      </p>
      <button className="button primary" disabled={busy}>
        {busy ? "Updating password…" : "Save new password →"}
      </button>
      <p role="alert" className="form-status">
        {message}
      </p>
    </form>
  );
}
