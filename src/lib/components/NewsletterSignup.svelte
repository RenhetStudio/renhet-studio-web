<script lang="ts">
  import { onDestroy } from "svelte";
  import { showToast } from "$lib/toast.svelte";
  import IconMail from "$lib/components/icons/IconMail.svelte";
  import IconArrowUpRight from "$lib/components/icons/IconArrowUpRight.svelte";
  import IconReload from "$lib/components/icons/IconReload.svelte";

  let email = $state("");
  let website = $state("");
  let submitting = $state(false);
  let controller: AbortController | undefined;
  onDestroy(() => controller?.abort());

  async function subscribe(event: SubmitEvent) {
    event.preventDefault();
    if (submitting) return;
    submitting = true;
    controller = new AbortController();
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
        signal: AbortSignal.any([controller.signal, AbortSignal.timeout(12000)]),
      });
      const result = await response.json();
      showToast(result.message, response.ok);
      if (response.ok) email = "";
    } catch {
      if (!controller.signal.aborted) showToast("We couldn't subscribe you. Please try again.", false);
    } finally {
      submitting = false;
    }
  }
</script>

<section class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8" aria-labelledby="newsletter-title">
  <div class="flex flex-col items-center justify-center gap-x-5 gap-y-2 text-center lg:flex-row lg:flex-wrap lg:justify-start lg:text-left">
    <h2 id="newsletter-title" class="text-base font-black">Newsletter</h2>
    <span class="hidden h-6 w-px bg-[#fffdf3]/25 lg:block" aria-hidden="true"></span>
    <p class="text-sm font-semibold text-[#fffdf3]/90">A glimpse of what's to come.</p>
  </div>
  <form method="POST" action="/api/newsletter" onsubmit={subscribe} aria-label="Subscribe to the newsletter" aria-busy={submitting} class="w-full lg:max-w-[560px] lg:flex-1">
    <label for="newsletter-email" class="sr-only">Your email address</label>
    <div class="flex min-w-0 items-center gap-2 rounded-full border border-[#fffdf3]/45 bg-[#fffdf3]/5 py-1 pr-1 pl-4 focus-within:ring-2 focus-within:ring-[#b8d4f0]">
      <IconMail size={18} class="shrink-0 text-[#fffdf3]/85" />
      <input id="newsletter-email" name="email" type="email" autocomplete="email" required maxlength="254" bind:value={email} disabled={submitting} placeholder="your@email.com" class="min-w-0 flex-1 border-0 bg-transparent px-1 py-2.5 text-sm leading-relaxed font-bold text-[#fffdf3] outline-none placeholder:font-bold placeholder:text-[#fffdf3]/75 disabled:opacity-60" />
      <button type="submit" disabled={submitting} class="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#fffdf3] px-4 text-xs font-black text-[#344253] transition-colors hover:bg-[#b8d4f0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fffdf3] disabled:cursor-wait disabled:opacity-70 sm:px-5 sm:text-sm">
        {submitting ? "Subscribing..." : "Subscribe"}
        {#if submitting}<IconReload size={13} class="animate-spin" />{:else}<IconArrowUpRight size={13} />{/if}
      </button>
    </div>
    <div class="newsletter-honeypot" aria-hidden="true">
      <label for="newsletter-website">Leave this field empty</label>
      <input id="newsletter-website" name="website" tabindex="-1" autocomplete="off" bind:value={website} />
    </div>
    <noscript><p class="mt-2 text-xs font-bold">Enable JavaScript to subscribe.</p></noscript>
  </form>
</section>

<style>
  .newsletter-honeypot { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
</style>
