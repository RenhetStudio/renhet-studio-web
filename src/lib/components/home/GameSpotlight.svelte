<script lang="ts">
  import { sound } from "$lib/audio/soundEffects";
  import IconItch from "$lib/components/icons/IconItch.svelte";
  import IconExternal from "$lib/components/icons/IconExternal.svelte";
  import IconSparkle from "$lib/components/icons/IconSparkle.svelte";

  let activeScreenshot = $state<0 | 1>(0);

  const screenshots = [
    {
      title: "Mix drinks & recipes",
      description: "Shake, stir, and blend cursed ingredients to order.",
      avif: "/optimized/screen-cocktails-800.avif",
      webp: "/optimized/screen-cocktails-800.webp",
      fallback: "/beelze-pub/screen-cocktails.jpg",
      alt: "Drink mixing gameplay in Beelze Pub",
    },
    {
      title: "Underworld patrons",
      description: "Chat with demons, imps, and lost souls at the bar counter.",
      avif: "/optimized/screen-dialogue-800.avif",
      webp: "/optimized/screen-dialogue-800.webp",
      fallback: "/beelze-pub/screen-dialogue.jpg",
      alt: "Dialogue scene with patrons in Beelze Pub",
    },
  ];
</script>

<section id="game" class="relative px-5 py-20 sm:px-8 md:py-28 lg:px-12" aria-labelledby="game-title">
  <div class="mx-auto max-w-6xl">
    <!-- Header with game identity -->
    <div class="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div>
        <div class="inline-flex items-center gap-2 rounded-full border border-[#d6d5ca] bg-[#fffdf3] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#4f5f70]">
          <IconSparkle size={13} class="text-[#8fb8d8]" />
          <span>Debut Release</span>
        </div>
        <h2 id="game-title" class="mt-3 text-3xl font-black tracking-tight text-[#344253] sm:text-4xl md:text-5xl">
          Beelze Pub
        </h2>
      </div>

      <div class="flex items-center gap-3">
        <a
          href="https://renhetstudio.itch.io/beelze-pub"
          target="_blank"
          rel="noreferrer"
          class="group inline-flex items-center gap-2.5 rounded-full bg-[#4f5f70] px-6 py-3.5 text-base font-black text-[#fffdf3] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#344253]"
          onmouseenter={() => sound.playHover(540)}
          onclick={() => sound.playDing()}
        >
          <IconItch size={18} />
          <span>Play on Itch.io</span>
          <IconExternal size={14} class="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </div>

    <!-- Main Game Showcase Card (Compact & Art-forward) -->
    <div class="grid gap-8 overflow-hidden rounded-3xl border-2 border-[#d6d5ca] bg-[#fffdf3] p-6 shadow-sm md:grid-cols-[1.1fr_0.9fr] md:p-8 lg:gap-12">
      <!-- Left: Interactive Gallery -->
      <div class="flex flex-col justify-between gap-4">
        <div class="relative aspect-video w-full overflow-hidden rounded-2xl border border-[#d6d5ca] bg-[#344253]">
          <picture class="h-full w-full">
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

        <!-- Screenshot selection tabs -->
        <div class="grid grid-cols-2 gap-3" role="tablist" aria-label="Game screenshot selector">
          {#each screenshots as shot, i}
            <button
              type="button"
              role="tab"
              aria-selected={activeScreenshot === i}
              class="flex flex-col rounded-xl border p-3 text-left transition-all duration-200 {activeScreenshot === i
                ? 'border-[#4f5f70] bg-[#4f5f70] text-[#fffdf3] shadow-sm'
                : 'border-[#d6d5ca] bg-[#f6f1e8] text-[#4f5f70] hover:border-[#4f5f70]/50'}"
              onclick={() => {
                activeScreenshot = i as 0 | 1;
                sound.playPop(500 + i * 80);
              }}
              onmouseenter={() => sound.playHover(420)}
            >
              <span class="text-xs font-black uppercase tracking-wider">{shot.title}</span>
              <span class="mt-1 text-xs opacity-85 leading-snug">{shot.description}</span>
            </button>
          {/each}
        </div>
      </div>

      <!-- Right: Game details & Craft notes -->
      <div class="flex flex-col justify-between">
        <div class="space-y-5">
          <div class="flex items-center gap-4">
            <img
              src="/beelze-pub/skelly-anim.gif"
              alt="Skelly"
              width="64"
              height="64"
              class="h-16 w-16 rounded-xl bg-[#8fb8d8]/20 object-contain p-1"
            />
            <div>
              <p class="text-sm font-black uppercase tracking-wider text-[#718191]">The Premise</p>
              <h3 class="text-xl font-black text-[#344253]">A weekend behind the underworld bar</h3>
            </div>
          </div>

          <p class="text-base font-semibold leading-relaxed text-[#627383]">
            You play as Skelly, filling in for the weekend at Beelze Pub. Mix drink recipes, balance chaotic orders, and keep the clientele happy before your shift runs out.
          </p>

          <div class="space-y-3 pt-2">
            <div class="flex items-start gap-3 rounded-xl bg-[#f6f1e8] p-3.5 text-sm">
              <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#8fb8d8] text-xs font-black text-[#344253]">1</span>
              <div>
                <strong class="font-bold text-[#344253]">Cozy Cocktail Sim:</strong>
                <span class="text-[#627383]"> Pure beverage crafting with quirky ingredients and satisfying audio.</span>
              </div>
            </div>

            <div class="flex items-start gap-3 rounded-xl bg-[#f6f1e8] p-3.5 text-sm">
              <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#8fb8d8] text-xs font-black text-[#344253]">2</span>
              <div>
                <strong class="font-bold text-[#344253]">Short &amp; Sweet:</strong>
                <span class="text-[#627383]"> A complete narrative micro-experience made with care by an international team.</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick specs bar -->
        <div class="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#d6d5ca] pt-5 text-xs font-bold text-[#718191]">
          <span>Platform: Web &amp; PC</span>
          <span>Status: Released &bull; Free</span>
          <span>Studio: Renhet</span>
        </div>
      </div>
    </div>
  </div>
</section>
