<script lang="ts">
  import SocialMeta from "$lib/components/SocialMeta.svelte";
  import SiteHeader from "$lib/components/SiteHeader.svelte";
  import SiteFooter from "$lib/components/SiteFooter.svelte";
  import HeroSplit from "$lib/components/home/HeroSplit.svelte";
  import GameSpotlight from "$lib/components/home/GameSpotlight.svelte";
  import TheCrew from "$lib/components/home/TheCrew.svelte";
</script>

<svelte:head>
  <title>Renhet Studio | Independent Game Studio Meant To Be Felt</title>
</svelte:head>

<SocialMeta
  title="Renhet Studio | Independent Game Studio Meant To Be Felt"
  description="An independent international game studio making games with something to say. Meet the crew and play Beelze Pub, our debut game, free on itch.io."
  path="/"
/>

<main
  class="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f6f1e8] text-[#4f5f70]"
  itemscope
  itemtype="https://schema.org/Organization"
>
  <meta itemprop="name" content="Renhet Studio" />
  <meta itemprop="url" content="https://www.renhetstudio.com" />
  <meta itemprop="logo" content="https://www.renhetstudio.com/renhet-logo-dark.png" />
  <meta itemprop="description" content="An independent international game studio making games with something to say." />
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
