<script lang="ts">
  import { onMount } from "svelte";
  import WaveDivider from "$lib/components/home/WaveDivider.svelte";

  let activePanel = $state<"studio" | "game" | null>(null);
  let isReducedMotion = $state(false);

  // Centered wave contours (viewBox 0 0 160 1000, seam center at x=80)
  // Perfectly matching cubic-bezier command structure for seamless CSS path interpolation
  // 1. Neutral: weaves symmetrically around x=80 (+25px into Pub, -25px into Studio)
  const contourNeutral =
    "C 105,70 115,180 80,250 C 45,320 55,430 80,500 C 105,570 115,680 80,750 C 45,820 55,930 80,1000";

  // 2. Studio Active: blue wave surges deep to the right into the dark tavern
  const contourStudio =
    "C 128,70 148,170 120,250 C 95,330 155,420 135,500 C 115,580 145,680 120,750 C 95,820 120,920 80,1000";

  // 3. Game Active: exact inverted wave — dark tavern wave surges deep to the left into the studio pond
  const contourGame =
    "C 32,70 12,170 40,250 C 65,330 5,420 25,500 C 45,580 15,680 40,750 C 65,820 40,920 80,1000";

  // Sub-surface waves for rich artisan depth:
  // Studio sub-wave (sky blue #b8d4f0)
  const subContourStudio =
    "C 138,70 158,160 132,250 C 105,340 162,410 146,500 C 122,590 154,670 130,750 C 105,830 130,910 80,1000";
  // Game sub-wave (tavern slate #4f5f70)
  const subContourGame =
    "C 22,70 2,160 28,250 C 55,340 -2,410 14,500 C 38,590 6,670 30,750 C 55,830 30,910 80,1000";

  let activeContour = $derived(
    activePanel === "studio" ? contourStudio : activePanel === "game" ? contourGame : contourNeutral
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

      <!-- Desktop Centered Fluid Seam Separator (Inverted multi-state wave) -->
      <!-- Perfectly centered at the seam boundary (left: calc(100% - 80px), width: 160px) -->
      <div
        class="pointer-events-none absolute top-0 bottom-0 left-[calc(100%-80px)] z-20 hidden w-40 overflow-visible lg:block"
        aria-hidden="true"
      >
        <div class="seam-wave-wrapper h-full w-full">
          <svg
            viewBox="0 0 160 1000"
            preserveAspectRatio="none"
            class="h-full w-full overflow-visible"
            xmlns="http://www.w3.org/2000/svg"
          >
            <!-- Sub-surface accent wave when Studio active (sky blue) -->
            <path
              d="M -2,0 L 80,0 {subContourStudio} L 80,1000 L -2,1000 Z"
              fill="#b8d4f0"
              class="transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              opacity={activePanel === "studio" ? 0.42 : 0}
            />

            <!-- Sub-surface accent wave when Game active (tavern slate) -->
            <path
              d="M 162,0 L 80,0 {subContourGame} L 80,1000 L 162,1000 Z"
              fill="#4f5f70"
              class="transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              opacity={activePanel === "game" ? 0.5 : 0}
            />

            <!-- Left Studio body (#8fb8d8) -->
            <path
              d="M -2,0 L 80,0 {activeContour} L 80,1000 L -2,1000 Z"
              fill="#8fb8d8"
              class="wave-path-seam"
            />

            <!-- Right Beelze Pub body (#344253) -->
            <path
              d="M 162,0 L 80,0 {activeContour} L 80,1000 L 162,1000 Z"
              fill="#344253"
              class="wave-path-seam"
            />

            <!-- Tactile artisan crest highlight tracing the exact shared boundary -->
            <path
              d="M 80,0 {activeContour}"
              fill="none"
              stroke="#fffdf3"
              stroke-width="2"
              stroke-opacity="0.38"
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
      <!-- Defringed 141-frame asset with crisp lineart and tavern illumination glow -->
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
