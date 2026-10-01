<script lang="ts">
  import { createClient } from "$lib/supabase/client";
  let { nextPath }: { nextPath: string } = $props();
  let email = $state("");
  let message = $state("");
  let pending = $state(false);
  const next = $derived(nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/blog");

  async function magicLink(event: SubmitEvent) {
    event.preventDefault(); pending = true; message = "";
    try {
      const callback = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
      const { error } = await createClient().auth.signInWithOtp({ email, options: { emailRedirectTo: callback, shouldCreateUser: true } });
      message = error ? error.message : "Check your email for a secure sign-in link.";
    } catch (error) { message = error instanceof Error ? error.message : "Could not start sign-in"; }
    finally { pending = false; }
  }

  async function googleLogin() {
    pending = true; message = "";
    try {
      const callback = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
      const { error } = await createClient().auth.signInWithOAuth({ provider: "google", options: { redirectTo: callback } });
      if (error) message = error.message;
    } catch (error) { message = error instanceof Error ? error.message : "Could not start sign-in"; pending = false; }
  }
</script>

<div class="login-card">
  <button class="google-login" type="button" onclick={googleLogin} disabled={pending}><span aria-hidden="true">G</span> Continue with Google</button>
  <div class="login-divider"><span>or</span></div>
  <form onsubmit={magicLink}><label for="email">Email address</label><input id="email" type="email" bind:value={email} autocomplete="email" required /><button type="submit" disabled={pending}>{pending ? "Sending…" : "Email me a sign-in link"}</button></form>
  {#if message}<p class="login-message" role="status">{message}</p>{/if}
  <p class="login-privacy">No password to store. Your session uses secure, HTTP-only cookies.</p>
</div>
