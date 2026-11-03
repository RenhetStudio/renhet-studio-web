<script lang="ts">
  import { onMount } from "svelte";
  import WaveDivider from "$lib/components/home/WaveDivider.svelte";

  let activePanel = $state<"studio" | "game" | null>(null);
  let isReducedMotion = $state(false);

  // Multi-state wave contours (viewBox 0 0 100 1000)
  // Perfectly matching cubic-bezier command structure for seamless CSS path interpolation
  const contourNeutral =
    "M -2,0 C 38,70 52,160 36,250 C 20,340 58,430 42,520 C 24,610 46,700 28,790 C 14,870 34,940 0,1000";
  const contourStudio =
    "M -2,0 C 64,70 82,160 62,250 C 40,340 92,430 76,520 C 52,610 78,700 56,790 C 34,870 55,940 0,1000";
  const contourGame =
    "M -2,0 C 14,70 18,160 12,250 C 6,340 22,430 14,520 C 8,610 18,700 10,790 C 5,870 12,940 0,1000";

  // Sub-surface secondary accent wave (slightly wider swell for artisan depth)
  const subContourNeutral =
    "M -2,0 C 48,70 66,160 46,250 C 28,340 72,430 54,520 C 32,610 58,700 38,790 C 20,870 44,940 0,1000";
  const subContourStudio =
    "M -2,0 C 78,70 98,160 76,250 C 54,340 100,430 90,520 C 66,610 92,700 70,790 C 44,870 68,940 0,1000";
  const subContourGame =
    "M -2,0 C 20,70 26,160 18,250 C 10,340 30,430 20,520 C 12,610 24,700 16,790 C 8,870 18,940 0,1000";

  let activeContour = $derived(
    activePanel === "studio" ? contourStudio : activePanel === "game" ? contourGame : contourNeutral
  );
  let activeSubContour = $derived(
    activePanel === "studio" ? subContourStudio : activePanel === "game" ? subContourGame : subContourNeutral
  );

  let studioBgEl = $state<HTMLDivElement | null>(null);
  let studioCopyEl = $state<HTMLDivElement | null>(null);
  let gameBgEl = $state<HTMLDivElement | null>(null);
  let gameCopyEl = $state<HTMLDivElement | null>(null);

  let mouseX = 0;
  let mouseY = 0;
  let scrollY = 0;

  const updateTransforms = () => {
    if (isReducedMotion) return;
    if (studioBgEl) {
      studioBgEl.style.transform = `translate3d(${mouseX * -0.5}px, ${(mouseY - scrollY * 0.15) * -0.5}px, 0)`;
    }
    if (studioCopyEl) {
      studioCopyEl.style.transform = `translate3d(${mouseX * 0.35}px, ${(mouseY - scrollY * 0.1) * 0.35}px, 0)`;
    }
    if (gameBgEl) {
      gameBgEl.style.transform = `translate3d(${mouseX * -0.5}px, ${(mouseY - scrollY * 0.12) * -0.5}px, 0)`;
    }
    if (gameCopyEl) {
      gameCopyEl.style.transform = `translate3d(${mouseX * 0.35}px, ${(mouseY - scrollY * 0.08) * 0.35}px, 0)`;
    }
  };

  onMount(() => {
    isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onScroll = () => {
      scrollY = window.scrollY;
      updateTransforms();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  });

  const onMouseMove = (e: MouseEvent) => {
    if (isReducedMotion) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX = x * 16;
    mouseY = y * 16;
    updateTransforms();
  };

  const handlePanelEnter = (panel: "studio" | "game") => {
    if (activePanel !== panel) {
      activePanel = panel;
    }
  };

  const handlePanelLeave = () => {
    activePanel = null;
  };
</script>

<section
  id="hero"
  class="relative isolate w-full overflow-hidden"
  aria-label="Welcome to Renhet Studio"
  onmousemove={onMouseMove}
>
  <div
    class="hero-split-container relative grid min-h-[94vh] w-full grid-cols-1 lg:grid-cols-2 {activePanel ===
    'studio'
      ? 'lg:grid-cols-[1.38fr_0.62fr]'
      : activePanel === 'game'
        ? 'lg:grid-cols-[0.62fr_1.38fr]'
        : 'lg:grid-cols-[1fr_1fr]'}"
  >
    <!-- LEFT PANEL: The Studio — entire panel links to #crew -->
    <a
      href="#crew"
      class="panel-studio group relative z-10 flex flex-col justify-center bg-[#8fb8d8] px-6 py-28 text-[#fffdf3] no-underline transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-10 md:py-36 lg:px-16 {activePanel ===
      'game'
        ? 'opacity-55 scale-[0.99]'
        : activePanel === 'studio'
          ? 'opacity-100 scale-[1.008]'
          : 'opacity-100'}"
      onmouseenter={() => handlePanelEnter("studio")}
      onmouseleave={handlePanelLeave}
    >
      <!-- Studio Watermark Background — coherent with Beelze Pub -->
      <div
        bind:this={studioBgEl}
        class="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <img
          src="/renhet-logo-white.png"
          alt=""
          width="520"
          height="260"
          class="w-[85%] max-w-lg object-contain transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] {activePanel ===
          'studio'
            ? 'opacity-35 scale-105'
            : activePanel === 'game'
              ? 'opacity-15 scale-95'
              : 'opacity-25 scale-100'} filter drop-shadow-[0_8px_32px_rgba(255,253,243,0.18)]"
        />
        <div class="absolute -left-12 top-24 h-64 w-64 rounded-full bg-[#b8d4f0]/20 blur-3xl"></div>
        <div class="absolute bottom-20 right-10 h-44 w-44 rounded-full bg-[#fffdf3]/10 blur-xl"></div>
      </div>

      <!-- Desktop Organic Seam Separator (Vertical fluid wave along the boundary) -->
      <div
        class="pointer-events-none absolute top-0 bottom-0 left-[calc(100%-1px)] z-20 hidden w-20 sm:w-24 lg:w-28 overflow-visible lg:block"
        aria-hidden="true"
      >
        <div class="seam-wave-wrapper h-full w-full">
          <svg
            viewBox="0 0 100 1000"
            preserveAspectRatio="none"
            class="h-full w-full overflow-visible"
            xmlns="http://www.w3.org/2000/svg"
          >
            <!-- Layer 1: Sub-surface accent wave -->
            <path
              d="{activeSubContour} L -2,1000 Z"
              fill="#b8d4f0"
              opacity="0.38"
              class="wave-path-sub"
            />
            <!-- Layer 2: Main Studio pond wave -->
            <path
              d="{activeContour} L -2,1000 Z"
              fill="#8fb8d8"
              class="wave-path-main"
            />
            <!-- Layer 3: Tactile artisan crest highlight -->
            <path
              d={activeContour}
              fill="none"
              stroke="#fffdf3"
              stroke-width="1.8"
              stroke-opacity="0.35"
              stroke-linecap="round"
              class="wave-path-highlight"
            />
          </svg>
        </div>
      </div>

      <!-- Mobile Horizontal Seam Separator -->
      <div
        class="pointer-events-none absolute -bottom-5 left-0 right-0 z-20 block h-10 w-full overflow-hidden lg:hidden"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 600 40"
          preserveAspectRatio="none"
          class="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <!-- Secondary accent wave -->
          <path
            d="M 0,0 C 140,34 260,16 380,30 C 470,40 550,22 600,0 L 600,0 L 0,0 Z"
            fill="#b8d4f0"
            opacity="0.38"
          />
          <!-- Main wave -->
          <path
            d="M 0,0 C 150,26 270,10 390,24 C 480,32 550,16 600,0 L 600,0 L 0,0 Z"
            fill="#8fb8d8"
          />
          <!-- Crest highlight line -->
          <path
            d="M 0,0 C 150,26 270,10 390,24 C 480,32 550,16 600,0"
            fill="none"
            stroke="#fffdf3"
            stroke-width="1.5"
            stroke-opacity="0.35"
          />
        </svg>
      </div>

      <!-- Studio Content Block (Synchronized layout & rhythm with Beelze Pub) -->
      <div
        bind:this={studioCopyEl}
        class="relative z-20 mx-auto w-full max-w-xl transition-all duration-500 ease-out {activePanel ===
        'studio'
          ? 'scale-[1.01] translate-x-1'
          : activePanel === 'game'
            ? 'opacity-70 scale-[0.99]'
            : ''}"
      >
        <h1
          class="text-balance text-4xl font-black leading-[0.92] tracking-tight text-[#fffdf3] sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Friendly detailed worlds filled with passion.
        </h1>

        <p class="mt-4 max-w-xs text-base font-semibold leading-relaxed text-[#fffdf3]/90 sm:max-w-sm sm:text-lg">
          A tiny indie game studio making warm, handmade things.
        </p>
      </div>
    </a>

    <!-- RIGHT PANEL: Beelze Pub — entire panel links to #game -->
    <a
      href="#game"
      class="panel-game group relative z-0 flex flex-col justify-center overflow-hidden bg-[#344253] px-6 py-28 text-[#fffdf3] no-underline transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-10 md:py-36 lg:px-16 {activePanel ===
      'studio'
        ? 'opacity-55 scale-[0.99]'
        : activePanel === 'game'
          ? 'opacity-100 scale-[1.008]'
          : 'opacity-100'}"
      onmouseenter={() => handlePanelEnter("game")}
      onmouseleave={handlePanelLeave}
    >
      <!-- Beelze Pub Watermark Background — identical treatment to Studio -->
      <div
        bind:this={gameBgEl}
        class="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <img
          src="/beelze-pub/logo.png"
          alt=""
          width="520"
          height="260"
          class="w-[85%] max-w-lg object-contain transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] {activePanel ===
          'game'
            ? 'opacity-35 scale-105'
            : activePanel === 'studio'
              ? 'opacity-15 scale-95'
              : 'opacity-25 scale-100'} filter drop-shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
        />
        <div class="absolute right-0 top-1/4 h-80 w-80 rounded-full bg-[#8fb8d8]/15 blur-3xl"></div>
      </div>

      <!-- Skelly GIF — anchored to the bottom and centered horizontally in ITS section -->
      <!-- With edge-diffusion filter and reactive atmospheric tavern glow -->
      <div
        class="pointer-events-none absolute -bottom-5 left-1/2 z-20 -translate-x-1/2 sm:-bottom-7 lg:-bottom-9 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] {activePanel ===
        'game'
          ? 'scale-105'
          : activePanel === 'studio'
            ? 'scale-95 opacity-75'
            : 'scale-100'}"
        aria-hidden="true"
      >
        <img
          src="/beelze-pub/skelly-anim.gif"
          alt="Skelly serving drinks in Beelze Pub"
          width="706"
          height="211"
          class="skelly-sprite block h-[260px] w-auto max-w-none object-contain object-bottom align-bottom sm:h-[340px] md:h-[400px] lg:h-[460px] {activePanel ===
          'game'
            ? 'skelly-active'
            : ''}"
          loading="eager"
        />
      </div>

      <!-- Beelze Pub Content Block (Synchronized layout & rhythm with Studio) -->
      <div
        bind:this={gameCopyEl}
        class="relative z-20 mx-auto w-full max-w-xl transition-all duration-500 ease-out {activePanel ===
        'game'
          ? 'scale-[1.01] -translate-x-1'
          : activePanel === 'studio'
            ? 'opacity-70 scale-[0.99]'
            : ''}"
      >
        <h2
          class="text-balance text-4xl font-black leading-[0.92] tracking-tight text-[#fffdf3] sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Beelze Pub
        </h2>

        <p class="mt-4 max-w-xs text-base font-semibold leading-relaxed text-[#d6d5ca] sm:max-w-sm sm:text-lg">
          Mix drinks. Serve the underworld. Survive the weekend.
        </p>
      </div>
    </a>
  </div>

  <!-- Integrated Bottom Wave Divider: transitions hero pond/pub directly into paper body -->
  <div class="pointer-events-none absolute bottom-0 left-0 right-0 z-30">
    <WaveDivider fillColor="#f6f1e8" />
  </div>
</section>

<style>
  .hero-split-container {
    transition: grid-template-columns 750ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .wave-path-main,
  .wave-path-sub,
  .wave-path-highlight {
    transition: d 750ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .seam-wave-wrapper {
    animation: seam-float 6s ease-in-out infinite alternate;
    transform-origin: center left;
  }

  @keyframes seam-float {
    0% {
      transform: scaleX(1) translateY(0);
    }
    50% {
      transform: scaleX(1.03) translateY(-3px);
    }
    100% {
      transform: scaleX(0.97) translateY(3px);
    }
  }

  .skelly-sprite {
    filter: blur(0.38px) drop-shadow(0 0 1px #344253) drop-shadow(0 0 2px rgba(52, 66, 83, 0.85)) drop-shadow(0 -14px 36px rgba(143, 184, 216, 0.35));
    transition: filter 500ms ease;
  }

  .skelly-sprite.skelly-active {
    filter: blur(0.38px) drop-shadow(0 0 1px #344253) drop-shadow(0 0 2px rgba(52, 66, 83, 0.95)) drop-shadow(0 -18px 44px rgba(143, 184, 216, 0.5));
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-split-container,
    .panel-studio,
    .panel-game,
    .wave-path-main,
    .wave-path-sub,
    .wave-path-highlight,
    .seam-wave-wrapper,
    .skelly-sprite {
      transition: none !important;
      animation: none !important;
    }
  }
</style>
