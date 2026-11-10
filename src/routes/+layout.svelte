<script lang="ts">
  import "@fontsource-variable/outfit";
  import "../app/globals.css";
  import CustomCursor from "$lib/components/CustomCursor.svelte";
  import SoundProvider from "$lib/components/SoundProvider.svelte";
  import ScrollToTop from "$lib/components/ScrollToTop.svelte";
  import { onNavigate } from "$app/navigation";
  import { tick, type Snippet } from "svelte";
  let { children }: { children: Snippet } = $props();

  onNavigate(async (navigation) => {
    const fromPath = navigation.from?.url.pathname;
    const toPath = navigation.to?.url.pathname;

    if (
      !document.startViewTransition ||
      !fromPath ||
      !toPath ||
      fromPath === toPath ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;

    // Flush menu closures before capturing the outgoing page.
    await tick();
    return new Promise<void>((ready) => {
      document.startViewTransition(async () => {
        ready();
        await navigation.complete;
      });
    });
  });
</script>

<svelte:head>
  <link rel="icon" href="/renhet-symbol-dark.png" />
  <meta name="application-name" content="Renhet Studio" />
  <meta name="author" content="Renhet Studio" />
  <meta name="keywords" content="indie game studio, independent games, Beelze Pub, cozy games, game development" />
</svelte:head>

<SoundProvider />
<CustomCursor />
{@render children()}
<ScrollToTop />
