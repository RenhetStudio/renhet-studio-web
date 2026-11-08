<script lang="ts">
  import { page } from "$app/state";
  import SiteHeader from "$lib/components/SiteHeader.svelte";
  import SiteFooter from "$lib/components/SiteFooter.svelte";
  import ErrorContent from "$lib/components/error/ErrorContent.svelte";

  const status = $derived(page.status || 404);
  const isNotFound = $derived(status === 404);
</script>

<svelte:head>
  <title>
    {isNotFound
      ? "404 — Lost between builds | Renhet Studio"
      : `${status} — Something went sideways | Renhet Studio`}
  </title>
  <meta name="robots" content="noindex,nofollow" />
</svelte:head>

<main
  class="flex min-h-screen w-full max-w-full flex-col justify-between overflow-x-hidden bg-[#f6f1e8] text-[#4f5f70]"
>
  <!-- Floating Site Header (renders solid immediately on non-hero pages) -->
  <SiteHeader />

  <!-- Error Content Component -->
  <ErrorContent {status} />

  <!-- Global Footer with organic wave divider -->
  <SiteFooter />
</main>

