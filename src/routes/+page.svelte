<script lang="ts">
  import SiteFooter from "$lib/components/SiteFooter.svelte";
  import SiteHeader from "$lib/components/SiteHeader.svelte";

  const team = [
    { name: "Miguel", role: "Team Lead / Programmer", country: "Spain", href: "https://www.bitemdev.com/" },
    { name: "Vaclav", role: "Producer", country: "Czech Republic", href: "https://www.linkedin.com/in/vaclavkorycanek/" },
    { name: "Todd", role: "Game Designer & Narrative Designer", country: "USA", href: "https://nat20.mal.plus/technical-portfolio/" },
    { name: "Maurice", role: "UI/UX Designer", country: "USA", href: "https://www.linkedin.com/in/mauricebirchard/" },
    { name: "Daniël", role: "Music Composer", country: "The Netherlands", href: "https://daniel-otten.bandcamp.com/" },
    { name: "Anton", role: "3D Artist", country: "Finland" },
    { name: "Ole", role: "Concept Artist", country: "The Netherlands" },
    { name: "Freya", role: "Marketer & Writer", country: "UK", href: "https://www.linkedin.com/in/freya-clinton-06383134a/" },
    { name: "Luca", role: "Marketer & Content", country: "Italy", href: "https://drive.google.com/file/d/1heCc9AVpGwAMI5p9Fi_N91vu-Nn-2FFq/view?usp=drivesdk" },
  ];
</script>

<svelte:head>
  <title>Renhet Studio</title>
  <meta name="description" content="Renhet Studio is an independent international game studio. Play our first game, Beelze Pub, free on Itch.io." />
  <link rel="canonical" href="https://www.renhetstudio.com/" />
  <meta property="og:title" content="Renhet Studio" /><meta property="og:description" content="Independent international game studio. Play our first game, Beelze Pub, free on Itch.io." /><meta property="og:url" content="https://www.renhetstudio.com" /><meta property="og:type" content="website" /><meta property="og:image" content="https://www.renhetstudio.com/renhet-logo-dark.png" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<main class="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f6f1e8] text-[#4f5f70]" itemscope itemtype="https://schema.org/Organization">
  <meta itemprop="name" content="Renhet Studio" /><meta itemprop="url" content="https://www.renhetstudio.com" /><meta itemprop="logo" content="https://www.renhetstudio.com/renhet-logo-dark.png" /><meta itemprop="description" content="An independent international game studio making warm, handmade games." />
  <link itemprop="sameAs" href="https://x.com/renhetstudio" /><link itemprop="sameAs" href="https://www.instagram.com/renhet.studio/" /><link itemprop="sameAs" href="https://www.reddit.com/user/RenhetStudio/" /><link itemprop="sameAs" href="https://www.tiktok.com/@renhetstudio" /><link itemprop="sameAs" href="https://renhetstudio.itch.io/" />
  <SiteHeader />
  <section id="top" class="hero-pond relative isolate min-h-screen px-5 pb-24 pt-32 sm:px-8 lg:px-10">
    <div class="mx-auto flex min-h-[78vh] max-w-[1500px] items-center justify-center">
      <div class="text-center">
        <h1 class="hero-enter mx-auto max-w-[1120px] text-[clamp(3rem,7vw,7rem)] font-black leading-[0.88] tracking-normal text-[#fffdf3] drop-shadow-[0_5px_0_rgba(79,95,112,0.22)]">Friendly detailed worlds filled with passion.</h1>
        <p class="hero-enter mx-auto mt-6 max-w-2xl text-xl font-bold leading-8 text-[#fffdf3] sm:text-2xl sm:leading-9">A tiny indie game studio making warm, handmade things.</p>
      </div>
    </div>
  </section>
  <section id="game" class="px-5 py-24 sm:px-8 md:py-32 lg:px-10">
    <div class="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[0.52fr_0.48fr] lg:items-center">
      <div>
        <h2 class="max-w-5xl text-[clamp(2.6rem,6vw,6.2rem)] font-black leading-[0.92] tracking-normal text-[#4f5f70]">Our first game is out now.</h2>
        <p class="mt-6 max-w-xl text-lg font-bold leading-8 text-[#627383] sm:text-xl">Mix drinks, serve customers, and keep the business running as Skelly, a laid-back skeletender filling in at Beelze Pub for the weekend.</p>
        <div class="mt-8 flex max-w-xl justify-center"><a href="https://renhetstudio.itch.io/beelze-pub" target="_blank" rel="noreferrer" class="button-primary">Play free on Itch.io</a></div>
      </div>
      <div class="flex min-h-[420px] items-center justify-center"><picture class="block w-full max-w-[420px]">
        <source type="image/avif" srcset="/optimized/beelze-pub-logo-420.avif 420w, /optimized/beelze-pub-logo-556.avif 556w" sizes="(max-width: 460px) 100vw, 420px" />
        <source type="image/webp" srcset="/optimized/beelze-pub-logo-420.webp 420w, /optimized/beelze-pub-logo-556.webp 556w" sizes="(max-width: 460px) 100vw, 420px" />
        <img src="/beelze-pub/logo.png" width="420" height="422" alt="Beelze Pub" loading="lazy" decoding="async" class="game-logo-float h-auto w-full max-w-[420px] object-contain drop-shadow-[0_24px_28px_rgba(79,95,112,0.18)]" />
      </picture></div>
    </div>
  </section>
  <section id="team" class="px-5 py-24 sm:px-8 md:py-32 lg:px-10">
    <div class="mx-auto max-w-[1500px]">
      <div class="mb-12 grid gap-5 lg:grid-cols-[0.44fr_0.56fr] lg:items-end"><h2 class="text-[clamp(2.8rem,6.2vw,7rem)] font-black leading-[0.9] tracking-normal text-[#4f5f70]">The crew.</h2></div>
      <ul class="team-grid">
        {#each team as member}
          <li>{#if member.href}<a href={member.href} target="_blank" rel="noreferrer" class="team-panel"><h3 class="team-name">{member.name}</h3><p class="team-role">{member.role}</p><p class="team-country">{member.country}</p></a>{:else}<div class="team-panel"><h3 class="team-name">{member.name}</h3><p class="team-role">{member.role}</p><p class="team-country">{member.country}</p></div>{/if}</li>
        {/each}
      </ul>
    </div>
  </section>
  <SiteFooter />
</main>
