<script lang="ts">
  import { onMount } from "svelte";
  import SiteHeader from "$lib/components/SiteHeader.svelte";
  import SiteFooter from "$lib/components/SiteFooter.svelte";
  import IconItch from "$lib/components/icons/IconItch.svelte";
  import IconExternal from "$lib/components/icons/IconExternal.svelte";
  import IconArrow from "$lib/components/icons/IconArrow.svelte";
  import IconSparkle from "$lib/components/icons/IconSparkle.svelte";

  let activeSlide = $state(0);
  let isReducedMotion = $state(false);

  const slides = [
    {
      title: "Mix drinks & recipes",
      description: "Shake, stir, and blend ingredients to balance emotions.",
      avif: "/optimized/screen-cocktails-800.avif",
      webp: "/optimized/screen-cocktails-800.webp",
      fallback: "/beelze-pub/screen-cocktails.jpg",
      alt: "Drink mixing gameplay in Beelze Pub",
    },
    {
      title: "Underworld patrons",
      description: "Listen, observe, and serve quirky beach-hut regulars.",
      avif: "/optimized/screen-dialogue-800.avif",
      webp: "/optimized/screen-dialogue-800.webp",
      fallback: "/beelze-pub/screen-dialogue.jpg",
      alt: "Dialogue scene with patrons in Beelze Pub",
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

  const features = [
    {
      title: "Play as Skelly",
      desc: "A skeleton bartender who is somehow one of the more stable people on the beach.",
      tag: "Character",
    },
    {
      title: "Emotional Mixology",
      desc: "Mix unique drinks using ingredients that balance different personality and emotional traits.",
      tag: "Mechanic",
    },
    {
      title: "Phone Recipe Book",
      desc: "Discover and unlock new recipes that are saved in your phone's recipe book.",
      tag: "Discovery",
    },
    {
      title: "Observation & Taste",
      desc: "Learn your customers through observation, experimentation, and listening to reactions.",
      tag: "Gameplay",
    },
    {
      title: "Beach-Hut Atmosphere",
      desc: "A relaxing beach-hut setting with a memorable cast of regular characters.",
      tag: "Vibe",
    },
    {
      title: "Multiple Outcomes",
      desc: "Endings and story resolutions shift based on the drinks you serve and beliefs you reinforce.",
      tag: "Narrative",
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

<svelte:head>
  <title>Beelze Pub — Debut Game | Renhet Studio</title>
  <meta
    name="description"
    content="Play Beelze Pub free on Itch.io. Mix drinks, balance customer emotions, and keep the beach-hut bar running as Skelly in Renhet Studio's debut cocktail sim."
  />
  <link rel="canonical" href="https://www.renhetstudio.com/games/beelze-pub" />
  <meta property="og:title" content="Beelze Pub | Renhet Studio" />
  <meta
    property="og:description"
    content="The boss is away for the weekend. Mix drinks, serve customers, and survive the underworld rush as Skelly in Beelze Pub."
  />
  <meta property="og:url" content="https://www.renhetstudio.com/games/beelze-pub" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://www.renhetstudio.com/beelze-pub/beelze-pub-keyart.png" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<main class="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f6f1e8] text-[#4f5f70]">
  <!-- Floating Site Header -->
  <SiteHeader />

  <!-- Hero Section -->
  <header class="relative px-5 pb-16 pt-32 sm:px-8 sm:pt-40 md:pb-24 lg:px-12">
    <div class="mx-auto max-w-6xl">
      <!-- Back Navigation & Eyebrow Badge -->
      <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
        <a
          href="/"
          class="group inline-flex items-center gap-2 rounded-full border border-[#d6d5ca] bg-[#fffdf3] px-4 py-1.5 text-xs font-bold text-[#4f5f70] transition-all duration-200 hover:border-[#4f5f70] hover:bg-[#fffdf3]"
        >
          <span class="transition-transform duration-200 group-hover:-translate-x-0.5">←</span>
          <span>Back to Home</span>
        </a>

        <div class="inline-flex items-center gap-2 rounded-full border border-[#d6d5ca] bg-[#fffdf3] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#627383]">
          <IconSparkle size={13} class="text-[#d88f8f]" />
          <span>Comfy Jam: Summer</span>
        </div>
      </div>

      <!-- Main Game Hero Grid -->
      <div class="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <div>
          <picture class="block w-full max-w-[340px] sm:max-w-[420px]">
            <source
              type="image/avif"
              srcset="/optimized/beelze-pub-logo-420.avif 420w, /optimized/beelze-pub-logo-556.avif 556w"
              sizes="(max-width: 460px) 100vw, 420px"
            />
            <source
              type="image/webp"
              srcset="/optimized/beelze-pub-logo-420.webp 420w, /optimized/beelze-pub-logo-556.webp 556w"
              sizes="(max-width: 460px) 100vw, 420px"
            />
            <img
              src="/beelze-pub/logo.png"
              width="420"
              height="422"
              alt="Beelze Pub logo"
              class="h-auto w-full object-contain drop-shadow-[0_20px_24px_rgba(79,95,112,0.16)]"
            />
          </picture>

          <h1 class="mt-6 text-2xl font-black tracking-tight text-[#344253] sm:text-3xl lg:text-4xl">
            The boss is away for the weekend.<br />
            <span class="text-[#4f5f70]/80 font-bold text-xl sm:text-2xl">Unfortunately, that means you're in charge.</span>
          </h1>

          <p class="mt-5 max-w-xl text-base font-semibold leading-relaxed text-[#627383] sm:text-lg">
            You are <strong class="text-[#344253]">Skelly</strong>, a laid-back skeletender filling in behind the bar at <strong class="text-[#344253]">Beelze Pub</strong> for the weekend. Your job is simple: mix drinks, serve customers, and keep the business running until the boss gets back.
          </p>

          <!-- CTAs & Specs -->
          <div class="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="https://renhetstudio.itch.io/beelze-pub"
              target="_blank"
              rel="noreferrer"
              class="group inline-flex items-center gap-2.5 rounded-full bg-[#344253] px-7 py-3.5 text-base font-black text-[#fffdf3] shadow-[0_4px_16px_rgba(52,66,83,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4f5f70] hover:shadow-[0_8px_24px_rgba(52,66,83,0.28)] active:translate-y-0 active:scale-[0.98]"
            >
              <IconItch size={18} class="transition-transform duration-200 group-hover:scale-110" />
              <span>Play free on Itch.io</span>
              <IconExternal size={14} class="opacity-80 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
            </a>
          </div>

          <!-- Quick Specs List -->
          <div class="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-black uppercase tracking-wider text-[#718191]">
            <span>Platform: <span class="text-[#344253]">Web (HTML5) &amp; PC</span></span>
            <span>&bull;</span>
            <span>Status: <span class="text-[#344253]">Released</span></span>
            <span>&bull;</span>
            <span>Price: <span class="text-[#344253]">Free</span></span>
            <span>&bull;</span>
            <span>Dev: <span class="text-[#344253]">Renhet Studio</span></span>
          </div>
        </div>

        <!-- Right Side: Skelly character frame -->
        <div class="flex items-center justify-center">
          <div class="relative w-full max-w-[420px] rounded-3xl border-2 border-[#d6d5ca] bg-[#fffdf3] p-6 text-center shadow-sm sm:p-8">
            <div class="mx-auto flex h-48 w-full items-center justify-center overflow-hidden rounded-2xl bg-[#627383]/10 p-2">
              <img
                src="/beelze-pub/skelly-anim.gif"
                alt="Skelly checking phone"
                class="h-auto w-auto max-h-40 scale-150 object-contain"
              />
            </div>
            <div class="mt-5">
              <span class="inline-block rounded-full bg-[#8fb8d8]/25 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#344253]">
                Your Character
              </span>
              <h2 class="mt-2 text-2xl font-black text-[#344253]">Skelly</h2>
              <p class="mt-2 text-sm font-semibold leading-relaxed text-[#627383]">
                One of the more stable people on the beach. An alarming amount of responsibility for someone who's technically dead.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Interactive Visual Showcase (Carousel) -->
  <section class="border-y border-[#d6d5ca] bg-[#fffdf3] px-5 py-20 sm:px-8 md:py-28 lg:px-12" aria-labelledby="showcase-title">
    <div class="mx-auto max-w-6xl">
      <div class="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span class="text-xs font-black uppercase tracking-wider text-[#718191]">Gameplay &amp; Atmosphere</span>
          <h2 id="showcase-title" class="mt-1 text-3xl font-black tracking-tight text-[#344253] sm:text-4xl">
            Behind the counter
          </h2>
        </div>
      </div>

      <!-- Carousel Root -->
      <div class="carousel-root relative">
        <!-- Viewport -->
        <div class="relative aspect-video w-full overflow-hidden rounded-3xl border-2 border-[#d6d5ca] bg-[#344253] shadow-sm">
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

          <!-- Prev/Next Buttons -->
          <div class="absolute inset-y-0 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
            <button
              type="button"
              class="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#344253]/70 text-[#fffdf3] backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-[#344253]/95 sm:h-12 sm:w-12"
              onclick={prevSlide}
              aria-label="Previous screenshot"
            >
              <IconArrow direction="left" size={18} />
            </button>

            <button
              type="button"
              class="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#344253]/70 text-[#fffdf3] backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-[#344253]/95 sm:h-12 sm:w-12"
              onclick={nextSlide}
              aria-label="Next screenshot"
            >
              <IconArrow direction="right" size={18} />
            </button>
          </div>
        </div>

        <!-- Progress Tabs -->
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
              <div class="h-1.5 w-full overflow-hidden rounded-full bg-[#d6d5ca]/80">
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
    </div>
  </section>

  <!-- The Premise & Mechanics Details -->
  <section class="px-5 py-20 sm:px-8 md:py-28 lg:px-12" aria-labelledby="premise-title">
    <div class="mx-auto max-w-6xl">
      <div class="mx-auto max-w-3xl text-center">
        <span class="text-xs font-black uppercase tracking-wider text-[#718191]">The Premise</span>
        <h2 id="premise-title" class="mt-2 text-3xl font-black tracking-tight text-[#344253] sm:text-4xl">
          One weekend. Three customers.
        </h2>
        <p class="mt-3 text-lg font-bold text-[#627383]">
          And an alarming amount of responsibility for someone who's technically dead.
        </p>
      </div>

      <div class="mt-12 grid gap-6 md:grid-cols-3">
        <div class="rounded-3xl border-2 border-[#d6d5ca] bg-[#fffdf3] p-6 shadow-sm sm:p-8">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8fb8d8]/30 text-base font-black text-[#344253]">
            1
          </div>
          <h3 class="mt-5 text-xl font-black text-[#344253]">You don't know what they want</h3>
          <p class="mt-3 text-sm font-semibold leading-relaxed text-[#627383]">
            Each evening begins before customers arrive. Use ingredients available behind the bar, unlock strange recipes, and then start service.
          </p>
        </div>

        <div class="rounded-3xl border-2 border-[#d6d5ca] bg-[#fffdf3] p-6 shadow-sm sm:p-8">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8fb8d8]/30 text-base font-black text-[#344253]">
            2
          </div>
          <h3 class="mt-5 text-xl font-black text-[#344253]">Emotions in a glass</h3>
          <p class="mt-3 text-sm font-semibold leading-relaxed text-[#627383]">
            Every ingredient affects different emotions, but your customers won't give you a handy checklist. You'll need to experiment, listen to reactions, and piece together their tastes.
          </p>
        </div>

        <div class="rounded-3xl border-2 border-[#d6d5ca] bg-[#fffdf3] p-6 shadow-sm sm:p-8">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8fb8d8]/30 text-base font-black text-[#344253]">
            3
          </div>
          <h3 class="mt-5 text-xl font-black text-[#344253]">Quiet confessions</h3>
          <p class="mt-3 text-sm font-semibold leading-relaxed text-[#627383]">
            The boss specifically told you not to chat to customers. Yet, after a few drinks people tend to reveal more than they realise. What you serve influences how they see their lives.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Features Grid -->
  <section class="border-t border-[#d6d5ca] bg-[#fffdf3] px-5 py-20 sm:px-8 md:py-28 lg:px-12" aria-labelledby="features-title">
    <div class="mx-auto max-w-6xl">
      <div class="mb-12 text-center">
        <span class="text-xs font-black uppercase tracking-wider text-[#718191]">Everything included</span>
        <h2 id="features-title" class="mt-2 text-3xl font-black tracking-tight text-[#344253] sm:text-4xl">
          Features
        </h2>
      </div>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {#each features as feat}
          <div class="flex flex-col justify-between rounded-3xl border-2 border-[#d6d5ca] bg-[#f6f1e8] p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1">
            <div>
              <span class="inline-block rounded-full bg-[#fffdf3] px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#4f5f70] border border-[#d6d5ca]">
                {feat.tag}
              </span>
              <h3 class="mt-4 text-lg font-black text-[#344253]">
                {feat.title}
              </h3>
              <p class="mt-2 text-sm font-semibold leading-relaxed text-[#627383]">
                {feat.desc}
              </p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Key Art Full Width Banner -->
  <section class="px-5 py-16 sm:px-8 lg:px-12" aria-label="Key Artwork">
    <div class="mx-auto max-w-6xl overflow-hidden rounded-3xl border-2 border-[#d6d5ca] bg-[#344253] shadow-md">
      <picture class="block w-full">
        <source type="image/avif" srcset="/optimized/beelze-pub-keyart-1200.avif 1200w, /optimized/beelze-pub-keyart-800.avif 800w" sizes="(max-width: 1200px) 100vw, 1200px" />
        <source type="image/webp" srcset="/optimized/beelze-pub-keyart-1200.webp 1200w, /optimized/beelze-pub-keyart-800.webp 800w" sizes="(max-width: 1200px) 100vw, 1200px" />
        <img
          src="/beelze-pub/beelze-pub-keyart.png"
          alt="Beelze Pub key artwork"
          width="1200"
          height="675"
          class="h-auto w-full object-cover"
          loading="lazy"
        />
      </picture>
    </div>
  </section>

  <!-- Windows Disclaimer Notice -->
  <section class="px-5 py-10 sm:px-8 lg:px-12" aria-label="Windows installation notes">
    <div class="mx-auto max-w-4xl rounded-3xl border-2 border-[#d6d5ca] bg-[#fffdf3] p-6 shadow-sm sm:p-8">
      <div class="flex items-start gap-4">
        <div class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#8fb8d8]/30 text-sm font-black text-[#344253]">
          ℹ
        </div>
        <div>
          <h3 class="text-base font-black text-[#344253] sm:text-lg">
            A quick note for Windows players
          </h3>
          <p class="mt-2 text-sm font-semibold leading-relaxed text-[#627383]">
            When you run the game, Windows may show a <strong>"Windows protected your PC"</strong> warning. This happens because our executable isn't yet signed with a code-signing certificate, not because of anything malicious in the game itself. This is extremely common for indie titles. We can assure that our game is completely safe (and all mined bitcoins will be used for good deeds only!).
          </p>
          <p class="mt-2 text-xs font-bold text-[#718191]">
            If you see that warning, click <strong>"More Info"</strong> and then <strong>"Run Anyway"</strong> to launch it.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Final Call to Action -->
  <section class="px-5 py-20 text-center sm:px-8 md:py-28 lg:px-12" aria-labelledby="cta-title">
    <div class="mx-auto max-w-3xl">
      <h2 id="cta-title" class="text-3xl font-black tracking-tight text-[#344253] sm:text-4xl md:text-5xl">
        Ready for your shift?
      </h2>
      <p class="mx-auto mt-4 max-w-xl text-base font-semibold leading-relaxed text-[#627383] sm:text-lg">
        Hop behind the bar, experiment with recipes, and see how the weekend turns out.
      </p>

      <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
        <a
          href="https://renhetstudio.itch.io/beelze-pub"
          target="_blank"
          rel="noreferrer"
          class="group inline-flex items-center gap-2.5 rounded-full bg-[#344253] px-8 py-4 text-base font-black text-[#fffdf3] shadow-[0_6px_20px_rgba(52,66,83,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4f5f70] hover:shadow-[0_10px_28px_rgba(52,66,83,0.3)] active:translate-y-0"
        >
          <IconItch size={20} class="transition-transform duration-200 group-hover:scale-110" />
          <span>Play free on Itch.io</span>
          <IconExternal size={15} class="opacity-80 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>

        <a
          href="/"
          class="inline-flex items-center gap-2 rounded-full border-2 border-[#d6d5ca] bg-[#fffdf3] px-6 py-3.5 text-base font-bold text-[#4f5f70] transition-all duration-200 hover:border-[#4f5f70] hover:bg-[#f6f1e8]"
        >
          <span>← Back to Home</span>
        </a>
      </div>
    </div>
  </section>

  <!-- Site Footer -->
  <SiteFooter />
</main>

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
