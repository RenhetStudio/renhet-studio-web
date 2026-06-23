"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

function safeNext(value: string) {
  return value.startsWith("/") && !value.startsWith("//") ? value : "/blog";
}

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const next = safeNext(nextPath);

  async function magicLink(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    try {
      const supabase = createClient();
      const callback = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: callback, shouldCreateUser: true },
      });
      setMessage(error ? error.message : "Check your email for a secure sign-in link.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not start sign-in");
    } finally {
      setPending(false);
    }
  }

  async function googleLogin() {
    setPending(true);
    setMessage("");
    try {
      const supabase = createClient();
      const callback = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: callback },
      });
      if (error) setMessage(error.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not start sign-in");
      setPending(false);
    }
  }

  return (
    <div className="login-card">
      <button className="google-login" type="button" onClick={googleLogin} disabled={pending}>
        <span aria-hidden="true">G</span> Continue with Google
      </button>
      <div className="login-divider"><span>or</span></div>
      <form onSubmit={magicLink}>
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />
        <button type="submit" disabled={pending}>{pending ? "Sending…" : "Email me a sign-in link"}</button>
      </form>
      {message && <p className="login-message" role="status">{message}</p>}
      <p className="login-privacy">No password to store. Your session uses secure, HTTP-only cookies.</p>
    </div>
  );
}

