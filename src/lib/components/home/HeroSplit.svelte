<script lang="ts">
  import { onMount } from "svelte";
  import WaveDivider from "$lib/components/home/WaveDivider.svelte";
  import IconArrow from "$lib/components/icons/IconArrow.svelte";

  let activePanel = $state<"studio" | "game" | null>(null);
  let isReducedMotion = $state(false);
  let canHover = $state(false);

  // Wave divider morphing contour paths (viewBox 0 0 1000 1000)
  const sNeutral =
    "M 500,0 C 510,70 515,160 508,250 C 498,340 486,430 492,520 C 500,610 514,700 508,790 C 500,870 492,940 500,1000";
  const sActive =
    "M 640,0 C 675,70 710,160 685,250 C 655,340 615,430 635,520 C 660,610 705,700 680,790 C 650,870 625,940 640,1000";
  const sGameActive =
    "M 360,0 C 325,70 290,160 315,250 C 345,340 385,430 365,520 C 340,610 295,700 320,790 C 350,870 375,940 360,1000";

  const sSubNeutral =
    "M 514,0 C 524,70 530,160 522,250 C 512,340 500,430 506,520 C 514,610 528,700 522,790 C 514,870 506,940 514,1000";
  const sSubActive =
    "M 656,0 C 692,70 730,160 704,250 C 672,340 630,430 652,520 C 678,610 725,700 698,790 C 668,870 640,940 656,1000";
  const sSubGameActive =
    "M 344,0 C 308,70 270,160 296,250 C 328,340 370,430 348,520 C 322,610 275,700 302,790 C 332,870 360,940 344,1000";

  let activeStudioContour = $derived(
    activePanel === "studio"
      ? sActive
      : activePanel === "game"
        ? sGameActive
        : sNeutral,
  );
  let activeStudioSubContour = $derived(
    activePanel === "studio"
      ? sSubActive
      : activePanel === "game"
        ? sSubGameActive
        : sSubNeutral,
  );

  let studioBgEl = $state<HTMLDivElement | null>(null);
  let gameBgEl = $state<HTMLDivElement | null>(null);

  let mouseX = 0;
  let mouseY = 0;
  let scrollY = 0;

  const updateTransforms = () => {
    if (isReducedMotion) return;
    if (studioBgEl) {
      studioBgEl.style.transform = `translate3d(${mouseX * -0.5}px, ${(mouseY - scrollY * 0.12) * -0.5}px, 0)`;
    }
    if (gameBgEl) {
      gameBgEl.style.transform = `translate3d(${mouseX * -0.5}px, ${(mouseY - scrollY * 0.12) * -0.5}px, 0)`;
    }
  };

  onMount(() => {
    isReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const hoverMql = window.matchMedia("(hover: hover) and (pointer: fine)");
    canHover = hoverMql.matches;

    const onHoverChange = (e: MediaQueryListEvent) => {
      canHover = e.matches;
      if (!e.matches) {
        activePanel = null;
      }
    };
    hoverMql.addEventListener("change", onHoverChange);

    if (canHover && typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("panel");
      if (p === "game" || p === "studio") {
        activePanel = p;
      }
    }

    const onScroll = () => {
      scrollY = window.scrollY;
      updateTransforms();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      hoverMql.removeEventListener("change", onHoverChange);
    };
  });

  const onMouseMove = (e: MouseEvent) => {
    if (isReducedMotion || !canHover) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX = x * 16;
    mouseY = y * 16;
    updateTransforms();
  };

  const handlePanelEnter = (panel: "studio" | "game") => {
    if (!canHover) return;
    if (activePanel !== panel) {
      activePanel = panel;
    }
  };

  const handlePanelLeave = () => {
    if (!canHover) {
      activePanel = null;
      return;
    }
    if (
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("panel")
    ) {
      return;
    }
    activePanel = null;
  };
</script>

<section
  id="hero"
  data-hero
  class="relative isolate h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-[#344253] xl:h-auto xl:max-h-none"
  aria-label="Welcome to Renhet Studio"
  onmousemove={onMouseMove}
>
  <!-- Background desktop wave contours -->
  <div
    class="pointer-events-none absolute -top-48 -bottom-48 inset-0 z-0 hidden h-[calc(100%+24rem)] w-full overflow-visible xl:block"
    aria-hidden="true"
  >
    <svg
      viewBox="0 0 1000 1000"
      preserveAspectRatio="none"
      class="h-full w-full overflow-visible"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="{activeStudioSubContour} L -40,1000 L -40,0 Z"
        fill="#b8d4f0"
        opacity="0.4"
        class="wave-path-seam"
      />
      <path
        d="{activeStudioContour} L -40,1000 L -40,0 Z"
        fill="#8fb8d8"
        class="wave-path-seam"
      />
    </svg>
  </div>

  <!-- Interactive wave mask and highlight strokes -->
  <div
    class="pointer-events-none absolute -top-48 -bottom-48 inset-0 z-20 hidden h-[calc(100%+24rem)] w-full overflow-visible xl:block"
    aria-hidden="true"
  >
    <svg
      viewBox="0 0 1000 1000"
      preserveAspectRatio="none"
      class="h-full w-full overflow-visible"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="{activeStudioSubContour} L -40,1000 L -40,0 Z"
        fill="#b8d4f0"
        class="wave-path-seam transition-opacity duration-500"
        opacity={activePanel === "studio" ? 0.45 : 0}
      />
      <path
        d="{activeStudioContour} L -40,1000 L -40,0 Z"
        fill="#8fb8d8"
        class="wave-path-seam transition-opacity duration-500"
        opacity={activePanel === "studio" ? 1 : 0}
      />

      <path
        d="{activeStudioSubContour} L 1040,1000 L 1040,0 Z"
        fill="#b8d4f0"
        class="wave-path-seam transition-opacity duration-500"
        opacity={activePanel === "game" ? 0.45 : 0}
      />
      <path
        d="{activeStudioContour} L 1040,1000 L 1040,0 Z"
        fill="#344253"
        class="wave-path-seam transition-opacity duration-500"
        opacity={activePanel === "game" ? 1 : 0}
      />

      <path
        d={activeStudioSubContour}
        fill="none"
        stroke="#fffdf3"
        stroke-width="1.2"
        stroke-opacity="0.2"
        stroke-linecap="round"
        class="wave-path-seam"
      />
      <path
        d={activeStudioContour}
        fill="none"
        stroke="#fffdf3"
        stroke-width="2.2"
        stroke-opacity="0.38"
        stroke-linecap="round"
        class="wave-path-seam"
      />
    </svg>
  </div>

  <div
    class="hero-split-container grid h-[100dvh] max-h-[100dvh] w-full grid-cols-1 grid-rows-2 overflow-hidden xl:h-auto xl:min-h-[94vh] xl:max-h-none xl:grid-cols-2 xl:grid-rows-1 {activePanel ===
    'studio'
      ? 'xl:grid-cols-[1.28fr_0.72fr]'
      : activePanel === 'game'
        ? 'xl:grid-cols-[0.72fr_1.28fr]'
        : 'xl:grid-cols-[1fr_1fr]'}"
  >
    <!-- Studio Panel (#crew) -->
    <a
      href="#crew"
      aria-label="Meet the Renhet Studio crew"
      class="panel-studio group relative flex h-full min-h-0 flex-col items-center justify-between bg-[#8fb8d8] px-4 pt-16 pb-8 no-underline sm:px-8 sm:pt-20 sm:pb-10 xl:min-h-0 xl:bg-transparent xl:justify-end xl:px-10 xl:pt-24 xl:pb-24 {activePanel ===
      'studio'
        ? 'z-30'
        : 'z-10'}"
      onmouseenter={() => handlePanelEnter("studio")}
      onmouseleave={handlePanelLeave}
    >
      <!-- Studio background watermark -->
      <div
        bind:this={studioBgEl}
        class="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-visible"
        aria-hidden="true"
      >
        <div
          class="absolute top-1/2 left-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fffdf3]/25 blur-3xl sm:h-[380px] sm:w-[380px] xl:h-[420px] xl:w-[420px]"
        ></div>
        <div
          class="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#344253]/15 blur-3xl xl:h-96 xl:w-96"
        ></div>

        <picture class="flex items-center justify-center">
          <source
            type="image/avif"
            srcset="/optimized/renhet-symbol-white-240.avif 240w, /optimized/renhet-symbol-white-480.avif 480w"
            sizes="(max-width: 640px) 300px, (max-width: 1280px) 440px, 520px"
          />
          <source
            type="image/webp"
            srcset="/optimized/renhet-symbol-white-240.webp 240w, /optimized/renhet-symbol-white-480.webp 480w"
            sizes="(max-width: 640px) 300px, (max-width: 1280px) 440px, 520px"
          />
          <img
            src="/renhet-symbol-white.png"
            alt=""
            width="475"
            height="475"
            class="h-auto w-[76%] max-w-[300px] sm:max-w-[380px] xl:w-[82%] xl:max-w-[580px] 2xl:max-w-[640px] object-contain transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] {activePanel ===
            'studio'
              ? 'opacity-30 scale-[1.12] rotate-3'
              : activePanel === 'game'
                ? 'opacity-10 scale-90 -rotate-2'
                : 'opacity-20 scale-100 rotate-0'} filter drop-shadow-[0_8px_32px_rgba(255,253,243,0.2)]"
          />
        </picture>
      </div>

      <!-- Studio brand lockup -->
      <div
        class="pointer-events-none relative z-25 my-auto flex w-full flex-col items-center justify-center pt-2 pb-1 sm:pt-4 xl:pt-10 xl:pb-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] {activePanel ===
        'studio'
          ? 'scale-105 opacity-100'
          : activePanel === 'game'
            ? 'scale-90 opacity-45'
            : 'scale-100 opacity-100'}"
      >
        <img
          src="/renhet-logo-white.png"
          alt="Renhet Studio"
          width="1024"
          height="516"
          class="studio-logo-extrusion relative z-10 w-[80%] max-w-[280px] sm:max-w-[340px] md:max-w-[380px] xl:w-[84%] xl:max-w-[490px] 2xl:max-w-[540px] -rotate-1 object-contain transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        />

        <div
          class="studio-slogan-wrap relative z-20 -mt-1 sm:-mt-2 xl:-mt-3 flex flex-col items-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        >
          <h1
            class="studio-slogan-extrusion text-center font-brand tracking-normal text-[#fffdf3]"
          >
            <span
              class="block text-xl sm:text-2xl md:text-3xl xl:text-[2.4rem] 2xl:text-[2.75rem] leading-[1.08] tracking-wide"
            >
              Friendly detailed worlds
            </span>
          </h1>
        </div>
      </div>

      <!-- Studio CTA button -->
      <div
        class="hero-cta-button relative z-30 inline-flex h-8 sm:h-9 xl:h-10 w-[172px] sm:w-[190px] xl:w-[205px] items-center justify-center gap-2 rounded-full border border-[#fffdf3]/20 bg-[#344253]/45 text-xs sm:text-sm font-bold tracking-tight text-[#fffdf3] shadow-sm backdrop-blur-sm transition-all duration-300 {activePanel ===
        'game'
          ? 'opacity-40'
          : 'opacity-100'}"
      >
        <span>Meet the crew</span>
        <IconArrow direction="down" size={13} />
      </div>

      <!-- Mobile horizontal seam separator -->
      <div
        class="pointer-events-none absolute -bottom-3 left-0 right-0 z-20 block h-7 w-full overflow-hidden xl:hidden"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 600 40"
          preserveAspectRatio="none"
          class="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 0,0 C 140,34 260,16 380,30 C 470,40 550,22 600,0 L 600,0 L 0,0 Z"
            fill="#b8d4f0"
            opacity="0.38"
          />
          <path
            d="M 0,0 C 150,26 270,10 390,24 C 480,32 550,16 600,0 L 600,0 L 0,0 Z"
            fill="#8fb8d8"
          />
          <path
            d="M 0,0 C 150,26 270,10 390,24 C 480,32 550,16 600,0"
            fill="none"
            stroke="#fffdf3"
            stroke-width="1.5"
            stroke-opacity="0.35"
          />
        </svg>
      </div>
    </a>

    <!-- Beelze Pub Panel (#game) -->
    <a
      href="#game"
      aria-label="About the game"
      class="panel-game group relative flex h-full min-h-0 flex-col items-center justify-end bg-transparent px-4 pt-3 pb-12 text-[#fffdf3] no-underline sm:px-8 sm:pb-16 xl:min-h-0 xl:pt-20 xl:pb-24 {activePanel ===
      'game'
        ? 'z-30'
        : 'z-10'}"
      onmouseenter={() => handlePanelEnter("game")}
      onmouseleave={handlePanelLeave}
    >
      <!-- Beelze Pub background watermark -->
      <div
        bind:this={gameBgEl}
        class="pointer-events-none absolute inset-0 z-0 flex items-center justify-center pb-20 sm:pb-26 xl:pb-28"
        aria-hidden="true"
      >
        <div
          class="absolute right-0 top-1/4 h-56 w-56 rounded-full bg-[#8fb8d8]/15 blur-3xl xl:h-80 xl:w-80"
        ></div>

        <img
          src="/beelze-pub/logo.png"
          alt=""
          width="520"
          height="260"
          class="w-[75%] max-w-[270px] sm:max-w-[330px] xl:w-[80%] xl:max-w-md object-contain transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] {activePanel ===
          'game'
            ? 'opacity-85 scale-105'
            : activePanel === 'studio'
              ? 'opacity-15 scale-90'
              : 'opacity-50 scale-100'} filter drop-shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
        />
      </div>

      <!-- Skelly foreground character -->
      <div
        class="pointer-events-none absolute bottom-0 left-1/2 z-25 -translate-x-1/2 sm:-bottom-3 xl:-bottom-9 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] {activePanel ===
        'game'
          ? 'scale-105 opacity-100'
          : activePanel === 'studio'
            ? 'scale-90 opacity-60'
            : 'scale-100 opacity-100'}"
        aria-hidden="true"
      >
        <img
          src="/beelze-pub/skelly-anim.gif"
          alt="Skelly serving drinks in Beelze Pub"
          width="706"
          height="211"
          class="block h-[180px] sm:h-[225px] md:h-[275px] xl:h-[390px] 2xl:h-[450px] w-auto max-w-none object-contain object-bottom align-bottom transition-all duration-500 {activePanel ===
          'game'
            ? 'drop-shadow-[0_-18px_44px_rgba(143,184,216,0.5)]'
            : 'drop-shadow-[0_-14px_36px_rgba(143,184,216,0.35)]'}"
          loading="eager"
        />
      </div>

      <!-- Beelze Pub CTA button -->
      <div
        class="hero-cta-button relative z-30 inline-flex h-8 sm:h-9 xl:h-10 w-[172px] sm:w-[190px] xl:w-[205px] items-center justify-center gap-2 rounded-full border border-[#fffdf3]/20 bg-[#1e2632]/50 text-xs sm:text-sm font-bold tracking-tight text-[#fffdf3] shadow-sm backdrop-blur-sm transition-all duration-300 {activePanel ===
        'studio'
          ? 'opacity-40'
          : 'opacity-100'}"
      >
        <span>About the game</span>
        <IconArrow direction="down" size={13} />
      </div>
    </a>
  </div>

  <!-- Bottom wave transition to paper body -->
  <div class="pointer-events-none absolute bottom-0 left-0 right-0 z-40">
    <WaveDivider fillColor="#f6f1e8" />
  </div>
</section>

<style>
  .studio-logo-extrusion {
    filter: drop-shadow(0 3px 0 #34425380) drop-shadow(0 -1px 0 #34425380)
      drop-shadow(1.5px 0 0 #34425380) drop-shadow(-1.5px 0 0 #34425380)
      drop-shadow(0 10px 20px rgba(30, 38, 50, 0.25));
  }

  .studio-slogan-extrusion {
    filter: drop-shadow(0 1.5px 0 #34425355) drop-shadow(0 -0.5px 0 #34425335)
      drop-shadow(1px 0 0 #34425345) drop-shadow(-1px 0 0 #34425345)
      drop-shadow(0 6px 14px rgba(30, 38, 50, 0.2));
  }

  @media (hover: hover) and (pointer: fine) {
    .panel-studio:hover .studio-logo-extrusion {
      transform: rotate(-2deg) scale(1.03);
    }

    .panel-studio:hover .studio-slogan-wrap {
      transform: scale(1.03);
    }

    .panel-studio:hover .hero-cta-button {
      border-color: rgba(255, 253, 243, 0.4);
      background-color: rgba(52, 66, 83, 0.65);
    }

    .panel-game:hover .hero-cta-button {
      border-color: rgba(255, 253, 243, 0.4);
      background-color: rgba(30, 38, 50, 0.7);
    }
  }

  .hero-split-container {
    transition: grid-template-columns 750ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .wave-path-seam {
    transition: d 750ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-split-container,
    .wave-path-seam {
      transition: none !important;
      animation: none !important;
    }
  }
</style>
