<script lang="ts">
  import { onMount } from "svelte";
  import WaveDivider from "$lib/components/home/WaveDivider.svelte";

  let activePanel = $state<"studio" | "game" | null>(null);
  let isReducedMotion = $state(false);

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
      ? 'lg:grid-cols-[1.36fr_0.64fr]'
      : activePanel === 'game'
        ? 'lg:grid-cols-[0.64fr_1.36fr]'
        : 'lg:grid-cols-[1fr_1fr]'}"
  >
    <!-- LEFT PANEL: The Studio — entire panel links to #crew -->
    <a
      href="#crew"
      class="panel-studio group relative flex flex-col justify-center bg-[#8fb8d8] px-6 py-28 text-[#fffdf3] no-underline transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-10 md:py-36 lg:px-16 {activePanel ===
      'game'
        ? 'opacity-60 scale-[0.99]'
        : activePanel === 'studio'
          ? 'opacity-100 scale-[1.005]'
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
          class="w-[85%] max-w-lg object-contain opacity-25 filter drop-shadow-[0_8px_32px_rgba(255,253,243,0.18)]"
        />
        <div class="absolute -left-12 top-24 h-64 w-64 rounded-full bg-[#b8d4f0]/20 blur-3xl"></div>
        <div class="absolute bottom-20 right-10 h-44 w-44 rounded-full bg-[#fffdf3]/10 blur-xl"></div>
      </div>

      <!-- Desktop Organic Seam Separator (Vertical fluid wave along the boundary) -->
      <div
        class="pointer-events-none absolute -right-5 top-0 bottom-0 z-20 hidden w-10 overflow-hidden lg:block transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] {activePanel ===
        'studio'
          ? 'scale-x-125'
          : activePanel === 'game'
            ? 'scale-x-75'
            : 'scale-x-100'}"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 40 1000"
          preserveAspectRatio="none"
          class="seam-wave h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 0,0 C 35,160 10,320 28,480 C 46,640 12,800 30,920 C 38,970 32,1000 0,1000 Z"
            fill="#8fb8d8"
          />
          <path
            d="M 0,0 C 35,160 10,320 28,480 C 46,640 12,800 30,920 C 38,970 32,1000 0,1000"
            fill="none"
            stroke="#b8d4f0"
            stroke-width="1.5"
            stroke-opacity="0.45"
          />
        </svg>
      </div>

      <!-- Mobile Horizontal Seam Separator -->
      <div
        class="pointer-events-none absolute -bottom-4 left-0 right-0 z-20 block h-8 w-full overflow-hidden lg:hidden"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 600 32"
          preserveAspectRatio="none"
          class="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 0,0 C 150,28 300,12 450,24 C 520,29 580,26 600,0 L 600,0 L 0,0 Z"
            fill="#8fb8d8"
          />
        </svg>
      </div>

      <!-- Studio Content Block (Synchronized layout & rhythm with Beelze Pub) -->
      <div
        bind:this={studioCopyEl}
        class="relative z-20 mx-auto w-full max-w-xl transition-all duration-500 ease-out {activePanel ===
        'studio'
          ? 'scale-[1.02]'
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
      class="panel-game group relative flex flex-col justify-center overflow-hidden bg-[#344253] px-6 py-28 text-[#fffdf3] no-underline transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-10 md:py-36 lg:px-16 {activePanel ===
      'studio'
        ? 'opacity-60 scale-[0.99]'
        : activePanel === 'game'
          ? 'opacity-100 scale-[1.005]'
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
          class="w-[85%] max-w-lg object-contain opacity-25 filter drop-shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
        />
        <div class="absolute right-0 top-1/4 h-80 w-80 rounded-full bg-[#8fb8d8]/15 blur-3xl"></div>
      </div>

      <!-- Skelly GIF — firmly anchored to the true bottom edge, submerged into wave base so cut is never visible -->
      <div
        class="pointer-events-none absolute -bottom-5 right-2 z-20 sm:-bottom-7 sm:right-6 md:right-10 lg:-bottom-9 lg:right-14"
        aria-hidden="true"
      >
        <img
          src="/beelze-pub/skelly-anim.gif"
          alt="Skelly serving drinks in Beelze Pub"
          width="706"
          height="211"
          class="block h-[260px] w-auto max-w-none object-contain object-bottom align-bottom drop-shadow-[0_-14px_36px_rgba(143,184,216,0.35)] sm:h-[340px] md:h-[400px] lg:h-[460px]"
          loading="eager"
        />
      </div>

      <!-- Beelze Pub Content Block (Synchronized layout & rhythm with Studio) -->
      <div
        bind:this={gameCopyEl}
        class="relative z-20 mx-auto w-full max-w-xl transition-all duration-500 ease-out {activePanel ===
        'game'
          ? 'scale-[1.02]'
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

  .seam-wave {
    animation: seam-breathe 7s ease-in-out infinite alternate;
    transform-origin: center;
  }

  @keyframes seam-breathe {
    0% {
      transform: scaleY(0.98) skewY(-0.6deg);
    }
    100% {
      transform: scaleY(1.02) skewY(0.6deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-split-container,
    .panel-studio,
    .panel-game,
    .seam-wave {
      transition: none !important;
      animation: none !important;
    }
  }
</style>
