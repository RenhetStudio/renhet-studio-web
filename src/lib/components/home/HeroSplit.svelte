<script lang="ts">
  import { onMount } from "svelte";
  import WaveDivider from "$lib/components/home/WaveDivider.svelte";

  let activePanel = $state<"studio" | "game" | null>(null);
  let isReducedMotion = $state(false);

  // 1. Studio wave contours (viewBox 0 0 100 1000, attached to Studio right edge, extends right into Pub)
  const sNeutral =
    "M -2,0 C 26,70 34,160 22,250 C 12,340 36,430 25,520 C 14,610 30,700 18,790 C 8,870 22,940 0,1000";
  const sActive =
    "M -2,0 C 65,70 82,160 62,250 C 42,340 92,430 76,520 C 52,610 78,700 56,790 C 34,870 55,940 0,1000";
  const sRetracted =
    "M -2,0 C 0,70 0,160 0,250 C 0,340 0,430 0,520 C 0,610 0,700 0,790 C 0,870 0,940 0,1000";

  const sSubActive =
    "M -2,0 C 78,70 98,160 76,250 C 54,340 100,430 90,520 C 66,610 92,700 70,790 C 44,870 68,940 0,1000";
  const sSubRetracted =
    "M -2,0 C 0,70 0,160 0,250 C 0,340 0,430 0,520 C 0,610 0,700 0,790 C 0,870 0,940 0,1000";

  // 2. Game wave contours (viewBox 0 0 100 1000, attached to Pub left edge, extends left into Studio)
  // Exact symmetrical mirror: x' = 100 - x
  const gActive =
    "M 102,0 C 35,70 18,160 38,250 C 58,340 8,430 24,520 C 48,610 22,700 44,790 C 66,870 45,940 100,1000";
  const gRetracted =
    "M 102,0 C 100,70 100,160 100,250 C 100,340 100,430 100,520 C 100,610 100,700 100,790 C 100,870 100,940 100,1000";

  const gSubActive =
    "M 102,0 C 22,70 2,160 24,250 C 46,340 0,430 10,520 C 34,610 8,700 30,790 C 56,870 32,940 100,1000";
  const gSubRetracted =
    "M 102,0 C 100,70 100,160 100,250 C 100,340 100,430 100,520 C 100,610 100,700 100,790 C 100,870 100,940 100,1000";

  let activeStudioContour = $derived(
    activePanel === "studio" ? sActive : activePanel === "game" ? sRetracted : sNeutral
  );
  let activeStudioSubContour = $derived(
    activePanel === "studio" ? sSubActive : sSubRetracted
  );

  let activeGameContour = $derived(
    activePanel === "game" ? gActive : gRetracted
  );
  let activeGameSubContour = $derived(
    activePanel === "game" ? gSubActive : gSubRetracted
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
      class="panel-studio group relative flex flex-col justify-center bg-[#8fb8d8] px-6 py-28 text-[#fffdf3] no-underline transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-10 md:py-36 lg:px-16 {activePanel ===
      'game'
        ? 'opacity-55 scale-[0.99] z-10'
        : activePanel === 'studio'
          ? 'opacity-100 scale-[1.008] z-20'
          : 'opacity-100 z-10'}"
      onmouseenter={() => handlePanelEnter("studio")}
      onmouseleave={handlePanelLeave}
    >
      <!-- Studio Watermark Background — coherent with Beelze Pub -->
      <div
        bind:this={studioBgEl}
        class="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
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

      <!-- Studio Wave Separator: extends to the right over Beelze Pub -->
      <!-- Clean organic wave only, ZERO background overlays or cut lines -->
      <div
        class="pointer-events-none absolute top-0 bottom-0 left-[calc(100%-1px)] z-20 hidden w-28 overflow-visible lg:block transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] {activePanel ===
        'game'
          ? 'opacity-0'
          : 'opacity-100'}"
        aria-hidden="true"
      >
        <div class="seam-wave-wrapper h-full w-full">
          <svg
            viewBox="0 0 100 1000"
            preserveAspectRatio="none"
            class="h-full w-full overflow-visible"
            xmlns="http://www.w3.org/2000/svg"
          >
            <!-- Layer 1: Sub-surface accent wave when Studio active (sky blue) -->
            <path
              d="{activeStudioSubContour} L -2,1000 Z"
              fill="#b8d4f0"
              class="transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              opacity={activePanel === "studio" ? 0.42 : 0}
            />

            <!-- Layer 2: Main Studio pond wave (#8fb8d8) -->
            <path
              d="{activeStudioContour} L -2,1000 Z"
              fill="#8fb8d8"
              class="wave-path-seam"
            />

            <!-- Layer 3: Tactile artisan crest highlight -->
            <path
              d={activeStudioContour}
              fill="none"
              stroke="#fffdf3"
              stroke-width="1.8"
              stroke-opacity="0.35"
              stroke-linecap="round"
              class="wave-path-seam"
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
        class="relative z-30 mx-auto w-full max-w-xl transition-all duration-500 ease-out {activePanel ===
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
      class="panel-game group relative flex flex-col justify-center bg-[#344253] px-6 py-28 text-[#fffdf3] no-underline transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-10 md:py-36 lg:px-16 {activePanel ===
      'studio'
        ? 'opacity-55 scale-[0.99] z-10'
        : activePanel === 'game'
          ? 'opacity-100 scale-[1.008] z-20'
          : 'opacity-100 z-10'}"
      onmouseenter={() => handlePanelEnter("game")}
      onmouseleave={handlePanelLeave}
    >
      <!-- Beelze Pub Watermark Background — identical treatment to Studio -->
      <div
        bind:this={gameBgEl}
        class="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
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

      <!-- Beelze Pub Wave Separator: extends to the left over Studio -->
      <!-- Clean organic inverted wave only, ZERO background overlays or cut lines -->
      <div
        class="pointer-events-none absolute top-0 bottom-0 right-[calc(100%-1px)] z-20 hidden w-28 overflow-visible lg:block transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] {activePanel ===
        'game'
          ? 'opacity-100'
          : 'opacity-0'}"
        aria-hidden="true"
      >
        <div class="seam-wave-wrapper h-full w-full">
          <svg
            viewBox="0 0 100 1000"
            preserveAspectRatio="none"
            class="h-full w-full overflow-visible"
            xmlns="http://www.w3.org/2000/svg"
          >
            <!-- Layer 1: Sub-surface accent wave when Game active (tavern slate) -->
            <path
              d="{activeGameSubContour} L 102,1000 Z"
              fill="#4f5f70"
              class="transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              opacity={activePanel === "game" ? 0.45 : 0}
            />

            <!-- Layer 2: Main Beelze Pub dark wave (#344253) -->
            <path
              d="{activeGameContour} L 102,1000 Z"
              fill="#344253"
              class="wave-path-seam"
            />

            <!-- Layer 3: Tactile artisan crest highlight -->
            <path
              d={activeGameContour}
              fill="none"
              stroke="#fffdf3"
              stroke-width="1.8"
              stroke-opacity="0.35"
              stroke-linecap="round"
              class="wave-path-seam"
            />
          </svg>
        </div>
      </div>

      <!-- Skelly GIF — anchored to the bottom and centered horizontally in ITS section -->
      <!-- Defringed 141-frame asset with crisp lineart and tavern illumination glow -->
      <div
        class="pointer-events-none absolute -bottom-5 left-1/2 z-25 -translate-x-1/2 sm:-bottom-7 lg:-bottom-9 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] {activePanel ===
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
          class="block h-[260px] w-auto max-w-none object-contain object-bottom align-bottom transition-all duration-500 {activePanel ===
          'game'
            ? 'drop-shadow-[0_-18px_44px_rgba(143,184,216,0.5)]'
            : 'drop-shadow-[0_-14px_36px_rgba(143,184,216,0.35)]'} sm:h-[340px] md:h-[400px] lg:h-[460px]"
          loading="eager"
        />
      </div>

      <!-- Beelze Pub Content Block (Synchronized layout & rhythm with Studio) -->
      <div
        bind:this={gameCopyEl}
        class="relative z-30 mx-auto w-full max-w-xl transition-all duration-500 ease-out {activePanel ===
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

  .wave-path-seam {
    transition: d 750ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .seam-wave-wrapper {
    animation: seam-float 6s ease-in-out infinite alternate;
    transform-origin: center;
  }

  @keyframes seam-float {
    0% {
      transform: scaleX(1) translateY(0);
    }
    50% {
      transform: scaleX(1.02) translateY(-2px);
    }
    100% {
      transform: scaleX(0.98) translateY(2px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-split-container,
    .panel-studio,
    .panel-game,
    .wave-path-seam,
    .seam-wave-wrapper {
      transition: none !important;
      animation: none !important;
    }
  }
</style>
