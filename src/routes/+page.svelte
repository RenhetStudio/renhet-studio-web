<script lang="ts">
  import SiteHeader from "$lib/components/SiteHeader.svelte";
  import SiteFooter from "$lib/components/SiteFooter.svelte";
  import HeroSplit from "$lib/components/home/HeroSplit.svelte";
  import GameSpotlight from "$lib/components/home/GameSpotlight.svelte";
  import TheCrew from "$lib/components/home/TheCrew.svelte";
</script>

<svelte:head>
  <title>Renhet Studio</title>
  <meta
    name="description"
    content="Renhet Studio is an independent international game studio making warm, handmade things. Play our debut game, Beelze Pub, free on Itch.io."
  />
  <link rel="canonical" href="https://www.renhetstudio.com/" />
  <meta property="og:title" content="Renhet Studio" />
  <meta
    property="og:description"
    content="An independent international game studio making warm, handmade things. Play our debut game, Beelze Pub, free on Itch.io."
  />
  <meta property="og:url" content="https://www.renhetstudio.com" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://www.renhetstudio.com/renhet-logo-dark.png" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<main
  class="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f6f1e8] text-[#4f5f70]"
  itemscope
  itemtype="https://schema.org/Organization"
>
  <meta itemprop="name" content="Renhet Studio" />
  <meta itemprop="url" content="https://www.renhetstudio.com" />
  <meta itemprop="logo" content="https://www.renhetstudio.com/renhet-logo-dark.png" />
  <meta itemprop="description" content="An independent international game studio making warm, handmade games." />
  <link itemprop="sameAs" href="https://x.com/renhetstudio" />
  <link itemprop="sameAs" href="https://www.instagram.com/renhet.studio/" />
  <link itemprop="sameAs" href="https://www.reddit.com/user/RenhetStudio/" />
  <link itemprop="sameAs" href="https://www.tiktok.com/@renhetstudio" />
  <link itemprop="sameAs" href="https://renhetstudio.itch.io/" />

  <!-- Floating Navigation Bar -->
  <SiteHeader />

  <!-- Interactive Split Hero (includes integrated bottom wave transition to paper) -->
  <HeroSplit />

  <!-- The Crew -->
  <TheCrew />

  <!-- Beelze Pub Showcase -->
  <GameSpotlight />

  <!-- Community & Footer (includes integrated inverted wave transition from paper) -->
  <SiteFooter />
</main>
