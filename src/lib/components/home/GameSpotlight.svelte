<script lang="ts">
  import { onMount } from "svelte";
  import IconItch from "$lib/components/icons/IconItch.svelte";
  import IconExternal from "$lib/components/icons/IconExternal.svelte";
  import IconArrow from "$lib/components/icons/IconArrow.svelte";

  let activeSlide = $state(0);
  let isReducedMotion = $state(false);

  const slides = [
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
      alt: "Dialogue scene with underworld regulars in Beelze Pub",
    },
    {
      title: "The tavern after dark",
      description: "Survive the weekend rush behind the counter of Beelze Pub.",
      avif: "/optimized/beelze-pub-keyart-800.avif",
      webp: "/optimized/beelze-pub-keyart-800.webp",
      fallback: "/beelze-pub/beelze-pub-keyart.png",
      alt: "Beelze Pub key artwork showing tavern atmosphere",
    },
  ];

  const nextSlide = () => {
    activeSlide = (activeSlide + 1) % slides.length;
  };

  const prevSlide = () => {
    activeSlide = (activeSlide - 1 + slides.length) % slides.length;
  };

  const setSlide = (index: number) => {
    activeSlide = index;
  };

  onMount(() => {
    isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
</script>

<section id="game" class="px-5 py-20 sm:px-8 md:py-28 lg:px-12" aria-labelledby="game-title">
  <div class="mx-auto max-w-6xl">
    <!-- Title row with direct Itch.io link -->
    <div class="mb-8 flex items-baseline justify-between gap-6 sm:mb-10">
      <h2 id="game-title" class="text-3xl font-black tracking-tight text-[#344253] sm:text-4xl md:text-5xl">
        Beelze Pub
      </h2>

      <a
        href="https://renhetstudio.itch.io/beelze-pub"
        target="_blank"
        rel="noreferrer"
        class="group inline-flex shrink-0 items-center gap-2 text-sm font-black text-[#4f5f70] underline-offset-4 hover:underline sm:text-base"
      >
        <IconItch size={18} />
        <span>Play free on Itch.io</span>
        <IconExternal size={13} class="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </a>
    </div>

    <!-- Carousel Container -->
    <div class="carousel-root relative">
      <!-- Main Visual Viewport -->
      <div class="relative aspect-video w-full overflow-hidden rounded-2xl bg-[#344253] shadow-sm">
        {#each slides as slide, i}
          <div
            class="absolute inset-0 transition-opacity duration-500 ease-in-out {activeSlide === i
              ? 'opacity-100 z-10'
              : 'opacity-0 z-0 pointer-events-none'}"
          >
            <picture class="block h-full w-full">
              <source type="image/avif" srcset={slide.avif} />
              <source type="image/webp" srcset={slide.webp} />
              <img
                src={slide.fallback}
                alt={slide.alt}
                class="h-full w-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
              />
            </picture>
          </div>
        {/each}

        <!-- Prev / Next Navigation Controls -->
        <div class="absolute inset-y-0 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
          <button
            type="button"
            class="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#344253]/60 text-[#fffdf3] backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-[#344253]/90 sm:h-12 sm:w-12"
            onclick={prevSlide}
            aria-label="Previous screenshot"
          >
            <IconArrow direction="left" size={18} />
          </button>

          <button
            type="button"
            class="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#344253]/60 text-[#fffdf3] backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-[#344253]/90 sm:h-12 sm:w-12"
            onclick={nextSlide}
            aria-label="Next screenshot"
          >
            <IconArrow direction="right" size={18} />
          </button>
        </div>
      </div>

      <!-- Carousel Progress Tabs -->
      <div
        class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3"
        role="tablist"
        aria-label="Game screenshot carousel tabs"
      >
        {#each slides as slide, i}
          <button
            type="button"
            role="tab"
            aria-selected={activeSlide === i}
            class="group flex flex-col text-left transition-opacity {activeSlide === i
              ? 'opacity-100'
              : 'opacity-70 hover:opacity-90'}"
            onclick={() => setSlide(i)}
          >
            <!-- Progress Bar Track -->
            <div class="h-1.5 w-full overflow-hidden rounded-full bg-[#d6d5ca]/70">
              {#if activeSlide === i}
                {#key activeSlide}
                  <div
                    class="h-full rounded-full bg-[#4f5f70] {isReducedMotion
                      ? 'w-full'
                      : 'progress-bar-fill'}"
                    onanimationend={nextSlide}
                  ></div>
                {/key}
              {:else}
                <div class="h-full w-0 bg-transparent"></div>
              {/if}
            </div>

            <!-- Tab Title and Subtitle -->
            <div class="mt-3">
              <span class="block text-sm font-black text-[#344253] sm:text-base">
                {slide.title}
              </span>
              <span class="mt-0.5 block text-xs font-semibold leading-relaxed text-[#627383]">
                {slide.description}
              </span>
            </div>
          </button>
        {/each}
      </div>
    </div>

    <!-- Minimal premise copy -->
    <p class="mt-8 max-w-lg text-base font-semibold leading-relaxed text-[#627383]">
      Play as Skelly, a laid-back skeletender filling in for the weekend. Mix cursed cocktails, balance orders, and survive the underworld rush.
    </p>
  </div>
</section>

<style>
  @keyframes fill-progress {
    from {
      width: 0%;
    }
    to {
      width: 100%;
    }
  }

  .progress-bar-fill {
    animation: fill-progress 5s linear forwards;
  }

  .carousel-root:hover .progress-bar-fill {
    animation-play-state: paused;
  }

  @media (prefers-reduced-motion: reduce) {
    .progress-bar-fill {
      animation: none !important;
      width: 100% !important;
    }
  }
</style>
