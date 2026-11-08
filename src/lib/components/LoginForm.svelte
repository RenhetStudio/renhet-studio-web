<script lang="ts">
  import { onMount } from "svelte";
  import { createClient } from "$lib/supabase/client";
  import { safeReturnPath } from "$lib/supabase/redirect";
  import IconGoogle from "$lib/components/icons/IconGoogle.svelte";
  import IconReload from "$lib/components/icons/IconReload.svelte";
  import OrganicDivider from "$lib/components/OrganicDivider.svelte";

  let {
    nextPath,
    initialError = null,
    commentsEnabled = true,
  }: {
    nextPath: string;
    initialError?: string | null;
    commentsEnabled?: boolean;
  } = $props();

  let email = $state("");
  let message = $state("");
  let isError = $state(false);
  let pendingAction = $state<"google" | "email" | null>(null);

  $effect(() => {
    if (initialError === "auth" && !message) {
      message = "Authentication could not be completed. Please try again.";
      isError = true;
    } else if (initialError === "restricted" && !message) {
      message =
        "Public registrations and reader sign-ins are currently closed. Only studio authors and admins may sign in.";
      isError = true;
    }
  });

  onMount(() => {
    // Reset pending state when navigating back (bfcache) or regaining focus
    const handleRestore = () => {
      pendingAction = null;
    };

    window.addEventListener("pageshow", handleRestore);
    window.addEventListener("focus", handleRestore);

    return () => {
      window.removeEventListener("pageshow", handleRestore);
      window.removeEventListener("focus", handleRestore);
    };
  });

  const next = $derived(safeReturnPath(nextPath));

  async function magicLink(event: SubmitEvent) {
    event.preventDefault();
    pendingAction = "email";
    message = "";
    isError = false;

    try {
      const callback = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
      const { error } = await createClient().auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: callback,
          shouldCreateUser: commentsEnabled,
        },
      });

      if (error) {
        message = error.message;
        isError = true;
      } else {
        message = "We sent a secure sign-in link to your email.";
        isError = false;
      }
    } catch (error) {
      message =
        error instanceof Error ? error.message : "Could not start sign-in";
      isError = true;
    } finally {
      pendingAction = null;
    }
  }

  async function googleLogin() {
    pendingAction = "google";
    message = "";
    isError = false;

    try {
      const callback = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
      const { error } = await createClient().auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callback,
        },
      });

      if (error) {
        message = error.message;
        isError = true;
        pendingAction = null;
      }
    } catch (error) {
      message =
        error instanceof Error ? error.message : "Could not start sign-in";
      isError = true;
      pendingAction = null;
    }
  }
</script>

<div class="w-full">
  <!-- Google OAuth CTA -->
  <button
    type="button"
    onclick={googleLogin}
    disabled={pendingAction !== null}
    class="inline-flex h-12 sm:h-13 w-full items-center justify-center gap-2.5 rounded-full border-2 border-[#d6d5ca] bg-[#fffdf3] px-6 text-sm sm:text-base font-bold text-[#344253] shadow-xs transition-all duration-200 hover:border-[#344253]/35 hover:bg-white active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
  >
    {#if pendingAction === "google"}
      <IconReload size={16} strokeWidth={2.4} class="animate-spin text-[#344253]" />
      <span>Connecting to Google</span>
    {:else}
      <IconGoogle size={18} />
      <span>Continue with Google</span>
    {/if}
  </button>

  <!-- Organic Divider without background obstruction -->
  <div class="my-6 flex items-center gap-3">
    <div class="flex-1">
      <OrganicDivider
        orientation="horizontal"
        seed="login-divider-left"
        color="#4f5f70"
        opacity={0.25}
        class="my-0"
      />
    </div>
    <span
      class="shrink-0 text-xs font-bold uppercase tracking-wider text-[#718191]"
    >
      or email link
    </span>
    <div class="flex-1">
      <OrganicDivider
        orientation="horizontal"
        seed="login-divider-right"
        color="#4f5f70"
        opacity={0.25}
        class="my-0"
      />
    </div>
  </div>

  <!-- Magic Link Form -->
  <form onsubmit={magicLink} class="flex flex-col">
    <div class="flex flex-col text-left">
      <label
        for="email"
        class="mb-2 text-xs font-bold uppercase tracking-wider text-[#4f5f70]"
      >
        Email address
      </label>
      <input
        id="email"
        type="email"
        bind:value={email}
        disabled={pendingAction !== null}
        autocomplete="email"
        placeholder="you@example.com"
        required
        class="h-12 sm:h-13 w-full rounded-full border-2 border-[#d6d5ca] bg-[#fffdf3] px-5 text-sm sm:text-base font-medium text-[#344253] placeholder:text-[#9aa5b1] transition-all focus:border-[#8fb8d8] focus:ring-4 focus:ring-[#8fb8d8]/20 focus:outline-none disabled:opacity-50"
      />
    </div>

    <button
      type="submit"
      disabled={pendingAction !== null}
      class="mt-3.5 inline-flex h-12 sm:h-13 w-full items-center justify-center gap-2.5 rounded-full bg-[#344253] px-6 text-sm sm:text-base font-bold tracking-tight text-[#fffdf3] shadow-xs transition-all duration-200 hover:bg-[#435467] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {#if pendingAction === "email"}
        <IconReload size={16} strokeWidth={2.4} class="animate-spin text-[#fffdf3]" />
        <span>Sending sign-in link</span>
      {:else}
        <span>Email me a sign-in link</span>
      {/if}
    </button>
  </form>

  <!-- Feedback Banner -->
  {#if message}
    <div
      role="status"
      class="mt-4 rounded-2xl p-4 text-center text-sm font-semibold transition-all {isError
        ? 'border border-[#e5a8a8] bg-[#fbf0f0] text-[#8b3438]'
        : 'border border-[#b5dbbe] bg-[#edf7f0] text-[#246139]'}"
    >
      {message}
    </div>
  {/if}

  <!-- Privacy / Security note -->
  <p class="mt-5 text-center text-xs leading-relaxed text-[#718191]">
    No password required. We'll send a secure one-time link to sign in.
  </p>
</div>
