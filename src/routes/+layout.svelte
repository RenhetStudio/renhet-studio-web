<script lang="ts">
  import "@fontsource-variable/outfit";
  import "../app/globals.css";
  import CustomCursor from "$lib/components/CustomCursor.svelte";
  import SoundProvider from "$lib/components/SoundProvider.svelte";
  import ScrollToTop from "$lib/components/ScrollToTop.svelte";
  import type { Snippet } from "svelte";
  let { children }: { children: Snippet } = $props();
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
