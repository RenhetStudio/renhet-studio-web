<script lang="ts">
  import "@fontsource-variable/outfit";
  import "../app/globals.css";
  import type { Snippet } from "svelte";
  let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
  <link rel="icon" href="/renhet-symbol-dark.png" />
  <meta name="application-name" content="Renhet Studio" />
  <meta name="author" content="Renhet Studio" />
  <meta name="keywords" content="indie game studio, independent games, Beelze Pub, cozy games, game development" />
</svelte:head>

{@render children()}
