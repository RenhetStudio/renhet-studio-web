<script lang="ts">
  import SiteHeader from "$lib/components/SiteHeader.svelte";
  import SiteFooter from "$lib/components/SiteFooter.svelte";
  import WaveDivider from "$lib/components/home/WaveDivider.svelte";
  import IconItch from "$lib/components/icons/IconItch.svelte";
  import IconExternal from "$lib/components/icons/IconExternal.svelte";
  import IconArrow from "$lib/components/icons/IconArrow.svelte";

  const gallerySlides = [
    {
      src: "/beelze-pub/screen-cocktails.jpg",
      avif480: "/optimized/screen-cocktails-480.avif",
      avif800: "/optimized/screen-cocktails-800.avif",
      webp480: "/optimized/screen-cocktails-480.webp",
      webp800: "/optimized/screen-cocktails-800.webp",
      alt: "Drink mixing gameplay in Beelze Pub",
      title: "Drink mixing",
    },
    {
      src: "/beelze-pub/screen-customers.jpg",
      avif480: "/optimized/screen-customers-480.avif",
      avif800: "/optimized/screen-customers-800.avif",
      webp480: "/optimized/screen-customers-480.webp",
      webp800: "/optimized/screen-customers-800.webp",
      alt: "Serving drinks to regular customers at the beach bar",
      title: "Regular customers",
    },
    {
      src: "/beelze-pub/screen-dialogue.jpg",
      avif480: "/optimized/screen-dialogue-480.avif",
      avif800: "/optimized/screen-dialogue-800.avif",
      webp480: "/optimized/screen-dialogue-480.webp",
      webp800: "/optimized/screen-dialogue-800.webp",
      alt: "Beach-hut atmosphere and character dialogue in Beelze Pub",
      title: "Dialogue & atmosphere",
    },
  ];

  let currentSlide = $state(0);

  const prevSlide = () => {
    currentSlide = (currentSlide - 1 + gallerySlides.length) % gallerySlides.length;
  };

  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % gallerySlides.length;
  };

  const goToSlide = (index: number) => {
    currentSlide = index;
  };

  let touchStartX = 0;
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  };

  let isCarouselHovered = $state(false);

  const AUTOPLAY_INTERVAL_MS = 5000;

  $effect(() => {
    if (typeof window === "undefined") return;
    if (isCarouselHovered) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Track currentSlide so the countdown restarts fresh whenever the user navigates
    void currentSlide;

    const timer = setInterval(() => {
      if (document.hidden) return;
      nextSlide();
    }, AUTOPLAY_INTERVAL_MS);

    return () => clearInterval(timer);
  });

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isCarouselHovered) return;
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
  };
</script>

<svelte:window onkeydown={handleKeyDown} />

<svelte:head>
  <title>Beelze Pub | Renhet Studio</title>
  <meta
    name="description"
    content="Play Beelze Pub free on Itch.io. Mix drinks, balance customer emotions, and keep the beach-hut bar running as Skelly in Renhet Studio's debut cocktail sim."
  />
  <link rel="canonical" href="https://www.renhetstudio.com/games/beelze-pub" />
  <meta property="og:title" content="Beelze Pub | Renhet Studio" />
  <meta
    property="og:description"
    content="The boss is away for the weekend. Mix drinks, serve customers, and survive the rush as Skelly in Beelze Pub."
  />
  <meta property="og:url" content="https://www.renhetstudio.com/games/beelze-pub" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://www.renhetstudio.com/beelze-pub/beelze-pub-keyart.png" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<main class="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f6f1e8] text-[#4f5f70]">
  <!-- Floating Site Header -->
  <SiteHeader />

  <!-- Panoramic Hero Section — Entire hero is a clickable destination leading to Itch.io -->
  <header id="hero" class="game-hero relative w-full overflow-hidden bg-[#f6f1e8] min-h-[520px] lg:min-h-[600px]" data-hero>
    <a
      href="https://renhetstudio.itch.io/beelze-pub"
      target="_blank"
      rel="noreferrer"
      class="group block relative w-full h-full cursor-pointer no-underline text-inherit select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#344253] focus-visible:ring-inset"
      aria-label="Play Beelze Pub free on itch.io (opens in new tab)"
    >
      <!-- Desktop Extended Backdrop Layer (Elongates tavern atmosphere & warm counter to the left) -->
      <div class="hero-extended-bg pointer-events-none absolute inset-0 hidden lg:block overflow-hidden" aria-hidden="true">
        <img
          src="/beelze-pub/beelze-pub-keyart.png"
          alt=""
          class="absolute -inset-8 h-[calc(100%+64px)] w-[calc(100%+64px)] object-cover object-[left_center] opacity-60"
        />
      </div>

      <!-- Desktop Sharp Keyart with Left Edge Mask Fade (Preserves sandwich & title with zero hard cut) -->
      <div
        class="hero-sharp-keyart pointer-events-none absolute inset-y-0 right-0 hidden lg:block overflow-hidden"
        aria-hidden="true"
      >
        <img
          src="/beelze-pub/beelze-pub-keyart.png"
          alt="Beelze Pub"
          class="h-full w-auto max-w-none object-contain transition-transform duration-700 ease-out group-hover:scale-[1.015]"
        />
      </div>

      <!-- Desktop Horizontal Readability Gradient (Paper Canvas Wash on Left) -->
      <div
        class="hero-paper-gradient pointer-events-none absolute inset-0 hidden lg:block"
        aria-hidden="true"
      ></div>

      <!-- Mobile & Tablet Banner Zone (< 1024px: full-bleed to top behind floating nav) -->
      <div class="relative w-full lg:hidden overflow-hidden">
        <div class="relative w-full h-[360px] sm:h-[420px] md:h-[480px] overflow-hidden">
          <img
            src="/beelze-pub/beelze-pub-keyart.png"
            alt="Beelze Pub"
            class="h-full w-full object-cover object-[49.5%_center] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
          <!-- Mobile Bottom Soft Fade into solid cream background -->
          <div
            class="hero-mobile-fade pointer-events-none absolute bottom-0 left-0 right-0 h-14 sm:h-16"
            aria-hidden="true"
          ></div>
        </div>
      </div>

      <!-- Hero Content Container (Vertically centered) -->
      <div class="relative z-10 mx-auto flex w-full max-w-[1288px] items-center px-6 sm:px-10 py-8 sm:py-12 lg:min-h-[600px] lg:py-0 lg:pt-6">
        <div class="max-w-[490px] lg:max-w-[510px] mx-auto text-center lg:mx-0 lg:text-left">
          <h1 class="text-3xl font-black tracking-[-0.035em] text-[#4f5f70] sm:text-4xl md:text-5xl lg:text-[54px] leading-[1.02] transition-colors duration-200 group-hover:text-[#344253]">
            The boss is away<br class="hidden sm:inline" /> for the weekend.
          </h1>
          <p class="mt-3 text-base font-bold text-[#627383] sm:text-lg md:text-xl lg:text-[21px] leading-snug">
            Unfortunately, that means you're in charge.
          </p>
        </div>
      </div>
    </a>

    <!-- Integrated Bottom Wave Divider: transitions hero directly into paper body -->
    <div class="pointer-events-none absolute bottom-0 left-0 right-0 z-20">
      <WaveDivider fillColor="#f6f1e8" />
    </div>
  </header>

  <!-- Main Features Section -->
  <section class="mt-8 px-6 sm:px-10 lg:mt-12 lg:px-20" aria-labelledby="features-title">
    <div class="mx-auto max-w-[1288px]">
      <!-- Skelly Intro Block: animated skeleton avatar to the left matching text height -->
      <div class="mb-10 lg:mb-14 flex items-start sm:items-center gap-4 sm:gap-5 md:gap-6 max-w-[820px]">
        <!-- Skelly Animated Avatar with Pond Blue Glow & Soft Bottom Fade -->
        <div class="skelly-glow-wrap shrink-0 mt-0.5 sm:mt-0 w-[68px] h-[68px] sm:w-20 sm:h-20 lg:w-[88px] lg:h-[88px]">
          <div class="skelly-mask h-full w-full overflow-hidden flex items-end justify-center">
            <img
              src="/beelze-pub/skelly-anim.gif"
              alt="Skelly"
              width="706"
              height="211"
              class="h-full w-auto max-w-none object-cover object-center block"
              loading="lazy"
            />
          </div>
        </div>

        <p class="text-base font-semibold leading-[1.5] text-[#556677] sm:text-lg lg:text-[19px]">
          You are <strong class="text-[#344253]">Skelly</strong>, a laid-back skeletender filling in behind the bar at <strong class="text-[#344253]">Beelze Pub</strong> for the weekend. Your job is simple: mix drinks, serve customers, and keep the business running until the boss gets back.
        </p>
      </div>

      <!-- Row 1: Header & Upper Description -->
      <div class="grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-[52px]">
        <!-- Left: Main Title (FEATURES tag removed) -->
        <div>
          <h2
            id="features-title"
            class="text-3xl font-black tracking-[-0.035em] text-[#4f5f70] sm:text-4xl lg:text-[50px] leading-[1.05]"
          >
            The catch? You don’t know<br />what they want.
          </h2>
        </div>

        <!-- Right: Upper Description with vertical divider -->
        <div class="lg:border-l lg:border-[#d6d5ca] lg:pl-12 lg:pt-2">
          <p class="max-w-[480px] text-base font-semibold leading-[1.46] text-[#627383] sm:text-lg lg:text-[20px]">
            Your customers won’t give you a handy checklist of their deepest needs. Instead, you'll need to experiment, listen to their reactions, and piece together their tastes.
          </p>
        </div>
      </div>

      <!-- Row 2: Gameplay Discreet Carousel & Lower Text -->
      <div class="mt-8 grid items-center gap-10 md:mt-10 lg:mt-12 lg:grid-cols-[1.1fr_1fr] lg:gap-[60px]">
        <!-- Left: Discreet Gameplay Carousel -->
        <div class="relative">
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            class="gameplay-image group relative select-none"
            aria-roledescription="carousel"
            aria-label="Beelze Pub gameplay gallery"
            onmouseenter={() => (isCarouselHovered = true)}
            onmouseleave={() => (isCarouselHovered = false)}
            onfocusin={() => (isCarouselHovered = true)}
            onfocusout={() => (isCarouselHovered = false)}
            ontouchstart={handleTouchStart}
            ontouchend={handleTouchEnd}
          >
            <!-- Slides Track (Smooth horizontal sliding via CSS translateX) -->
            <div class="carousel-track" data-slide={currentSlide}>
              {#each gallerySlides as slide, i}
                <div class="carousel-slide h-full w-full shrink-0 grow-0 overflow-hidden" aria-hidden={i !== currentSlide}>
                  <picture class="block h-full w-full">
                    <source
                      type="image/avif"
                      srcset="{slide.avif480} 480w, {slide.avif800} 800w"
                      sizes="(max-width: 768px) 100vw, 604px"
                    />
                    <source
                      type="image/webp"
                      srcset="{slide.webp480} 480w, {slide.webp800} 800w"
                      sizes="(max-width: 768px) 100vw, 604px"
                    />
                    <img
                      src={slide.src}
                      width="1000"
                      height="563"
                      alt={slide.alt}
                      loading={i === 0 ? "eager" : "lazy"}
                      class="block h-full w-full object-cover"
                    />
                  </picture>
                </div>
              {/each}
            </div>

            <!-- Discreet Floating Arrow Buttons (fade in on hover or visible on mobile) -->
            <button
              type="button"
              onclick={prevSlide}
              aria-label="Previous screenshot"
              class="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#1e2632]/50 text-[#fffdf3] backdrop-blur-md opacity-75 transition-all duration-200 hover:scale-105 hover:bg-[#1e2632]/80 focus:opacity-100 active:scale-95 sm:h-10 sm:w-10 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <IconArrow direction="left" size={16} />
            </button>

            <button
              type="button"
              onclick={nextSlide}
              aria-label="Next screenshot"
              class="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#1e2632]/50 text-[#fffdf3] backdrop-blur-md opacity-75 transition-all duration-200 hover:scale-105 hover:bg-[#1e2632]/80 focus:opacity-100 active:scale-95 sm:h-10 sm:w-10 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <IconArrow direction="right" size={16} />
            </button>

            <!-- Discreet Bottom Capsule Dots -->
            <div class="pointer-events-none absolute bottom-3.5 inset-x-0 flex justify-center">
              <div class="pointer-events-auto flex items-center gap-1.5 rounded-full bg-[#1e2632]/50 px-2.5 py-1 backdrop-blur-md">
                {#each gallerySlides as slide, i}
                  <button
                    type="button"
                    onclick={() => goToSlide(i)}
                    aria-label={`Go to slide ${i + 1}: ${slide.title}`}
                    class="h-1.5 rounded-full transition-all duration-300 {i === currentSlide
                      ? 'w-5 bg-[#fffdf3]'
                      : 'w-1.5 bg-[#fffdf3]/40 hover:bg-[#fffdf3]/75'}"
                  ></button>
                {/each}
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Lower Title & Lower Description -->
        <div class="lg:pl-2">
          <h3 class="max-w-[530px] text-2xl font-black tracking-[-0.03em] text-[#4f5f70] sm:text-3xl lg:text-[44px] leading-[1.05]">
            The boss has specifically told you not to chat to customers.
          </h3>
          <p class="mt-5 max-w-[510px] text-base font-semibold leading-[1.48] text-[#627383] sm:text-lg lg:text-[20px]">
            Yet, after a few drinks people tend to reveal more than they realise. And whether you mean to or not, the drinks you serve will influence how they see their lives.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Bottom Centered CTA Button (Replaced 3 highlight columns) -->
  <section class="py-16 text-center sm:py-20 lg:py-24 px-6 sm:px-10 lg:px-20" aria-label="Play on itch.io">
    <div class="mx-auto max-w-[1288px] flex justify-center">
      <a
        href="https://renhetstudio.itch.io/beelze-pub"
        target="_blank"
        rel="noreferrer"
        class="group inline-flex items-center gap-2.5 rounded-full bg-[#344253] px-8 py-4 text-base font-black text-[#fffdf3] shadow-[0_4px_16px_rgba(52,66,83,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4f5f70] hover:shadow-[0_8px_24px_rgba(52,66,83,0.32)] active:translate-y-0 active:scale-[0.98]"
      >
        <IconItch size={20} class="transition-transform duration-200 group-hover:scale-110" />
        <span>Play free on itch.io</span>
        <IconExternal size={15} class="opacity-80 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
      </a>
    </div>
  </section>

  <!-- Global Site Footer -->
  <SiteFooter />
</main>

<style>
  .hero-extended-bg img {
    filter: blur(28px) saturate(1.1);
  }

  .hero-sharp-keyart {
    -webkit-mask-image: linear-gradient(
      to right,
      transparent 0%,
      rgba(0, 0, 0, 0.2) 6%,
      rgba(0, 0, 0, 0.7) 14%,
      black 24%
    );
    mask-image: linear-gradient(
      to right,
      transparent 0%,
      rgba(0, 0, 0, 0.2) 6%,
      rgba(0, 0, 0, 0.7) 14%,
      black 24%
    );
  }

  .hero-paper-gradient {
    background: linear-gradient(
      90deg,
      rgba(246, 241, 232, 1) 0%,
      rgba(246, 241, 232, 0.96) 24%,
      rgba(246, 241, 232, 0.82) 38%,
      rgba(246, 241, 232, 0.3) 54%,
      rgba(246, 241, 232, 0) 70%
    );
  }

  .hero-mobile-fade {
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(246, 241, 232, 0.08) 20%,
      rgba(246, 241, 232, 0.35) 45%,
      rgba(246, 241, 232, 0.75) 70%,
      rgba(246, 241, 232, 0.95) 88%,
      #f6f1e8 100%
    );
  }

  .gameplay-image {
    width: 100%;
    aspect-ratio: 1000 / 563;
    overflow: hidden;
    isolation: isolate;
    border-radius:
      37px 48px 44px 42px /
      43px 40px 35px 44px;
  }

  .carousel-track {
    display: flex;
    width: 100%;
    height: 100%;
    transition: transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .carousel-track[data-slide="0"] {
    transform: translateX(0%);
  }

  .carousel-track[data-slide="1"] {
    transform: translateX(-100%);
  }

  .carousel-track[data-slide="2"] {
    transform: translateX(-200%);
  }

  .carousel-slide {
    contain: paint;
  }

  .gameplay-image img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .skelly-glow-wrap {
    filter: drop-shadow(0 6px 18px rgba(143, 184, 216, 0.55));
  }

  .skelly-mask {
    -webkit-mask-image: linear-gradient(
      to bottom,
      black 0%,
      black 65%,
      transparent 96%
    );
    mask-image: linear-gradient(
      to bottom,
      black 0%,
      black 65%,
      transparent 96%
    );
  }

  @media (prefers-reduced-motion: reduce) {
    .carousel-track {
      transition: none !important;
      transform: none !important;
    }
  }
</style>