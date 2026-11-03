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
      studioBgEl.style.transform = `translate3d(${mouseX * -0.6}px, ${(mouseY - scrollY * 0.15) * -0.6}px, 0)`;
    }
    if (studioCopyEl) {
      studioCopyEl.style.transform = `translate3d(${mouseX * 0.4}px, ${(mouseY - scrollY * 0.1) * 0.4}px, 0)`;
    }
    if (gameBgEl) {
      gameBgEl.style.transform = `translate3d(${mouseX * -0.5}px, ${(mouseY - scrollY * 0.12) * -0.5}px, 0)`;
    }
    if (gameCopyEl) {
      gameCopyEl.style.transform = `translate3d(${mouseX * 0.3}px, ${(mouseY - scrollY * 0.08) * 0.3}px, 0)`;
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
    class="hero-split-container grid min-h-[94vh] w-full grid-cols-1 pb-16 lg:grid-cols-2 lg:pb-0 {activePanel ===
    'studio'
      ? 'lg:grid-cols-[1.22fr_0.78fr]'
      : activePanel === 'game'
        ? 'lg:grid-cols-[0.78fr_1.22fr]'
        : 'lg:grid-cols-[1fr_1fr]'}"
  >
    <!-- LEFT PANEL: The Studio — entire panel links to #crew -->
    <a
      href="#crew"
      class="panel-studio group relative flex flex-col justify-center bg-[#8fb8d8] px-6 py-28 text-[#fffdf3] no-underline sm:px-10 md:py-36 lg:px-16 {activePanel ===
      'game'
        ? 'opacity-85'
        : 'opacity-100'}"
      onmouseenter={() => handlePanelEnter("studio")}
      onmouseleave={handlePanelLeave}
    >
      <!-- Parallax ambient layer -->
      <div
        bind:this={studioBgEl}
        class="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          class="absolute -left-12 top-24 h-64 w-64 rounded-full bg-[#b8d4f0]/25 blur-3xl"
        ></div>
        <div
          class="absolute bottom-20 right-10 h-44 w-44 rounded-full bg-[#fffdf3]/15 blur-xl"
        ></div>
      </div>

      <!-- Desktop Vertical Organic Seam Divider -->
      <div
        class="pointer-events-none absolute -right-3.5 top-0 bottom-0 z-20 hidden w-7 overflow-hidden lg:block"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 28 1000"
          preserveAspectRatio="none"
          class="seam-wave h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,0 Q24,125 8,250 T20,500 T8,750 T18,1000 L0,1000 Z"
            fill="#8fb8d8"
          />
        </svg>
      </div>

      <!-- Mobile Horizontal Seam Divider -->
      <div
        class="pointer-events-none absolute -bottom-3 left-0 right-0 z-20 block h-6 w-full overflow-hidden lg:hidden"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 600 24"
          preserveAspectRatio="none"
          class="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,0 Q150,22 300,10 T600,18 L600,0 L0,0 Z"
            fill="#8fb8d8"
          />
        </svg>
      </div>

      <div
        bind:this={studioCopyEl}
        class="relative z-10 mx-auto w-full max-w-xl"
      >
        <!-- Hero Large Brand Logo -->
        <div class="hero-logo-box mb-6 sm:mb-8">
          <picture class="block w-full max-w-[220px] sm:max-w-[270px] md:max-w-[320px]">
            <source
              type="image/avif"
              srcset="/optimized/renhet-logo-white-360.avif 360w, /optimized/renhet-logo-white-720.avif 720w"
              sizes="(max-width: 640px) 220px, 320px"
            />
            <source
              type="image/webp"
              srcset="/optimized/renhet-logo-white-360.webp 360w, /optimized/renhet-logo-white-720.webp 720w"
              sizes="(max-width: 640px) 220px, 320px"
            />
            <img
              src="/renhet-logo-white.png"
              width="320"
              height="161"
              alt="Renhet Studio"
              fetchpriority="high"
              class="h-auto w-full object-contain filter drop-shadow-[0_4px_16px_rgba(50,62,75,0.18)]"
            />
          </picture>
        </div>

        <h1
          class="text-balance text-4xl font-black leading-[0.92] tracking-tight text-[#fffdf3] sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Friendly detailed worlds filled with passion.
        </h1>

        <p class="mt-6 max-w-lg text-lg font-semibold leading-relaxed text-[#fffdf3]/90 sm:text-xl">
          A tiny indie game studio making warm, handmade things.
        </p>
      </div>
    </a>

    <!-- RIGHT PANEL: Beelze Pub — entire panel links to #game -->
    <a
      href="#game"
      class="panel-game group relative flex flex-col justify-center overflow-hidden bg-[#344253] px-6 py-28 text-[#fffdf3] no-underline sm:px-10 md:py-36 lg:px-16 {activePanel ===
      'studio'
        ? 'opacity-85'
        : 'opacity-100'}"
      onmouseenter={() => handlePanelEnter("game")}
      onmouseleave={handlePanelLeave}
    >
      <!-- Beelze Pub logo watermark background with increased visibility -->
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

      <!-- Skelly GIF — anchored flush to the bottom-0, large and prominent -->
      <div
        class="pointer-events-none absolute bottom-0 right-2 z-20 sm:right-6 md:right-10 lg:right-14"
        aria-hidden="true"
      >
        <img
          src="/beelze-pub/skelly-anim.gif"
          alt="Skelly serving drinks in Beelze Pub"
          width="380"
          height="380"
          class="skelly-anim h-[250px] w-auto object-contain drop-shadow-[0_-12px_36px_rgba(143,184,216,0.35)] sm:h-[330px] md:h-[380px] lg:h-[420px]"
          loading="eager"
        />
      </div>

      <div
        bind:this={gameCopyEl}
        class="relative z-20 mx-auto w-full max-w-xl"
      >
        <h2
          class="text-balance text-3xl font-black leading-[0.95] tracking-tight text-[#fffdf3] sm:text-4xl md:text-5xl lg:text-6xl"
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
    transition: grid-template-columns 650ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .panel-studio,
  .panel-game {
    transition:
      opacity 450ms ease,
      padding 650ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .seam-wave {
    animation: seam-undulate 8s ease-in-out infinite alternate;
    transform-origin: center;
  }

  @keyframes seam-undulate {
    0% {
      transform: scaleX(0.9) skewY(-0.8deg);
    }
    100% {
      transform: scaleX(1.15) skewY(0.8deg);
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
