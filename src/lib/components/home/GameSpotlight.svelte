<script lang="ts">
  import { sound } from "$lib/audio/soundEffects";
  import IconItch from "$lib/components/icons/IconItch.svelte";
  import IconExternal from "$lib/components/icons/IconExternal.svelte";

  let activeScreenshot = $state<0 | 1>(0);

  const screenshots = [
    {
      label: "Mix drinks",
      avif: "/optimized/screen-cocktails-800.avif",
      webp: "/optimized/screen-cocktails-800.webp",
      fallback: "/beelze-pub/screen-cocktails.jpg",
      alt: "Drink mixing gameplay in Beelze Pub",
    },
    {
      label: "Underworld patrons",
      avif: "/optimized/screen-dialogue-800.avif",
      webp: "/optimized/screen-dialogue-800.webp",
      fallback: "/beelze-pub/screen-dialogue.jpg",
      alt: "Dialogue scene with underworld patrons in Beelze Pub",
    },
  ];
</script>

<section id="game" class="px-5 py-20 sm:px-8 md:py-28 lg:px-12" aria-labelledby="game-title">
  <div class="mx-auto max-w-6xl">

    <!-- Title row -->
    <div class="mb-10 flex items-baseline justify-between gap-6">
      <h2 id="game-title" class="text-3xl font-black tracking-tight text-[#344253] sm:text-4xl md:text-5xl">
        Beelze Pub
      </h2>
      <a
        href="https://renhetstudio.itch.io/beelze-pub"
        target="_blank"
        rel="noreferrer"
        class="group inline-flex shrink-0 items-center gap-2 text-sm font-black text-[#4f5f70] underline-offset-4 hover:underline"
        onmouseenter={() => sound.playHover(540)}
        onclick={() => sound.playDing()}
      >
        <IconItch size={16} />
        <span>Play free on Itch.io</span>
        <IconExternal size={12} class="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </a>
    </div>

    <!-- Full-bleed screenshot -->
    <div class="relative w-full overflow-hidden rounded-xl bg-[#344253]">
      <picture class="block aspect-video w-full">
        <source type="image/avif" srcset={screenshots[activeScreenshot].avif} />
        <source type="image/webp" srcset={screenshots[activeScreenshot].webp} />
        <img
          src={screenshots[activeScreenshot].fallback}
          alt={screenshots[activeScreenshot].alt}
          class="h-full w-full object-cover transition-opacity duration-300"
          loading="lazy"
        />
      </picture>
    </div>

    <!-- Screenshot tabs — minimal underline style -->
    <div class="mt-4 flex gap-6 border-b border-[#d6d5ca]" role="tablist" aria-label="Game screenshots">
      {#each screenshots as shot, i}
        <button
          type="button"
          role="tab"
          aria-selected={activeScreenshot === i}
          class="pb-3 text-sm font-bold transition-colors duration-150 {activeScreenshot === i
            ? 'border-b-2 border-[#4f5f70] text-[#344253]'
            : 'text-[#627383] hover:text-[#4f5f70]'}"
          onclick={() => {
            activeScreenshot = i as 0 | 1;
            sound.playPop(500 + i * 80);
          }}
          onmouseenter={() => sound.playHover(420)}
        >
          {shot.label}
        </button>
      {/each}
    </div>

    <!-- One-liner description -->
    <p class="mt-8 max-w-lg text-base font-semibold leading-relaxed text-[#627383]">
      Play as Skelly, a laid-back skeletender filling in for the weekend. Mix cursed cocktails, keep the underworld clientele happy.
    </p>

  </div>
</section>
