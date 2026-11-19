<script lang="ts">
  import { enhance } from "$app/forms";
  import BlogShell from "$lib/components/BlogShell.svelte";
  import IconArrow from "$lib/components/icons/IconArrow.svelte";
  import OrganicDivider from "$lib/components/OrganicDivider.svelte";
  import { setNewsletterSubscription } from "$lib/components/newsletter-preferences.svelte";
  import type { PageProps } from "./$types";

  let { data, form }: PageProps = $props();
  let newsletterPending = $state(false);
  const newsletterFeedback = $derived(form?.newsletter);

  $effect(() => {
    if (newsletterFeedback?.ok) {
      setNewsletterSubscription(newsletterFeedback.subscribed);
    }
  });
</script>

<svelte:head>
  <title>Account | Renhet Studio</title>
  <meta name="robots" content="noindex,nofollow" />
</svelte:head>

<BlogShell profile={data.profile}>
  <div
    class="mx-auto max-w-[680px] px-5 sm:px-8 pt-28 sm:pt-36 md:pt-40 pb-20 sm:pb-28"
  >
    <!-- Back Navigation -->
    <div class="mb-8">
      <a
        href="/blog"
        class="inline-flex items-center gap-2 text-xs sm:text-[13px] font-bold text-[#8a98a5] transition-colors hover:text-[#4f5f70]"
      >
        <IconArrow direction="left" size={13} />
        <span>Return to stories</span>
      </a>
    </div>

    <!-- Editorial Header in Paperlogy-9Black and Slate Ink -->
    <header class="text-left">
      <div class="flex items-center gap-2.5">
        <span
          class="text-xs sm:text-[13px] font-black uppercase tracking-widest text-[#8a98a5]"
        >
          Account
        </span>
        <span
          class="inline-flex items-center rounded-full border border-[#8fb8d8]/70 bg-[#fffdf3] px-2.5 py-0.5 text-[11px] font-black text-[#4f5f70]"
        >
          {data.profile.role === "admin"
            ? "Studio Admin"
            : data.profile.role === "author"
            ? "Studio Author"
            : "Reader"}
        </span>
      </div>

      <h1
        class="mt-2 text-[clamp(2.6rem,6vw,4.5rem)] font-black leading-[0.92] tracking-tight text-[#4f5f70]"
      >
        Your profile.
      </h1>

      <p class="mt-3 text-base font-normal leading-relaxed text-[#627383]">
        Manage your public display name and newsletter subscription.
      </p>
    </header>

    <!-- Profile Form -->
    <div class="mt-10 sm:mt-12 text-left">
      <!-- Display Name Edit Form -->
      <form method="POST" use:enhance class="w-full">
        <label
          for="displayName"
          class="block text-base font-black text-[#4f5f70] mb-3"
        >
          Public display name
        </label>
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            id="displayName"
            name="displayName"
            value={data.profile.display_name}
            minlength="1"
            maxlength="60"
            required
            class="h-[48px] w-full sm:flex-1 rounded-full border border-[#4f5f70]/25 bg-[#fffdf3] px-5 text-sm sm:text-base font-medium text-[#4f5f70] placeholder:text-[#8a98a5] transition-all hover:border-[#8fb8d8] focus:border-[#8fb8d8] focus:bg-[#fffdf3] focus:outline-none focus:ring-2 focus:ring-[#8fb8d8]/25 shadow-xs"
          />
          <button
            type="submit"
            class="inline-flex h-[48px] w-full sm:w-auto shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-[#4f5f70] px-6 text-sm font-black text-[#fffdf3] shadow-[0_4px_16px_rgba(79,95,112,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#344253] active:translate-y-0 cursor-pointer"
          >
            Save name
          </button>
        </div>

        {#if form?.message}
          <p
            class="mt-3 text-sm font-bold {form.ok ? 'text-emerald-700' : 'text-rose-700'}"
            role="status"
          >
            {form.message}
          </p>
        {/if}
      </form>
    </div>

    <OrganicDivider seed="account-newsletter" class="my-8 sm:my-10" />

    <section aria-labelledby="account-newsletter-title">
      <h2 id="account-newsletter-title" class="text-2xl font-black leading-tight text-[#4f5f70]">
        Newsletter
      </h2>

      {#if data.newsletter.status === "ready"}
        <form
          method="POST"
          use:enhance={({ cancel }) => {
            if (newsletterPending) {
              cancel();
              return;
            }
            newsletterPending = true;
            return async ({ update }) => {
              try {
                await update();
              } finally {
                newsletterPending = false;
              }
            };
          }}
          aria-busy={newsletterPending}
          class="mt-3 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="min-w-0 text-sm leading-relaxed text-[#627383]">
            <p class="font-bold">{data.newsletter.subscribed ? "Subscribed" : "Not subscribed"}</p>
            <p class="wrap-anywhere">{data.newsletter.email}</p>
          </div>
          <input type="hidden" name="newsletterPreference" value={data.newsletter.subscribed ? "unsubscribe" : "subscribe"} />
          <button
            type="submit"
            disabled={newsletterPending}
            class="inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full border px-6 text-sm font-black transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f5f70] disabled:cursor-wait disabled:opacity-60 sm:w-auto sm:shrink-0 {data.newsletter.subscribed
              ? 'border-[#4f5f70]/30 bg-[#fffdf3] text-[#4f5f70] hover:border-[#4f5f70]'
              : 'border-transparent bg-[#4f5f70] text-[#fffdf3] hover:bg-[#344253]'}"
          >
            {newsletterPending ? "Updating…" : data.newsletter.subscribed ? "Unsubscribe" : "Subscribe"}
          </button>
        </form>
      {:else}
        <p class="mt-3 text-sm font-semibold text-[#627383]">
          {data.newsletter.status === "unverified"
            ? "Confirm your account email to manage your subscription."
            : "Newsletter settings are temporarily unavailable."}
        </p>
      {/if}

      <div role="status">
        {#if newsletterFeedback}
          <p class="mt-3 text-sm font-bold {newsletterFeedback.ok ? 'text-emerald-700' : 'text-rose-700'}">
            {newsletterFeedback.message}
          </p>
        {/if}
      </div>
    </section>
  </div>
</BlogShell>
