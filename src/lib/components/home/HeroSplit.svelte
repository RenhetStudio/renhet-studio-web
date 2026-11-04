<script lang="ts">
  import { onMount } from "svelte";
  import WaveDivider from "$lib/components/home/WaveDivider.svelte";

  let activePanel = $state<"studio" | "game" | null>(null);
  let isReducedMotion = $state(false);

  // Unified full-bleed morphing wave divider (viewBox 0 0 1000 1000)
  // Perfectly centered at 50% in neutral (500).
  // Dynamic displacement: the entire wave divider bodily moves and compresses the small section!
  // In studio active: spine moves to 640 (compressing Beelze Pub to 36%), surging long crests to 710 (sub to 730).
  // In game active: spine moves to 360 (compressing Studio to 36%), surging long crests to 290 (sub to 270).
  // Consistent multi-layered borders in all states (+16-20px sub-surface transparent accent rim).
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
        : sNeutral
  );
  let activeStudioSubContour = $derived(
    activePanel === "studio"
      ? sSubActive
      : activePanel === "game"
        ? sSubGameActive
        : sSubNeutral
  );

  let studioBgEl = $state<HTMLDivElement | null>(null);
  let gameBgEl = $state<HTMLDivElement | null>(null);

  let mouseX = 0;
  let mouseY = 0;
  let scrollY = 0;

  const updateTransforms = () => {
    if (isReducedMotion) return;
    if (studioBgEl) {
      studioBgEl.style.transform = `translate3d(${mouseX * -0.5}px, ${(mouseY - scrollY * 0.15) * -0.5}px, 0)`;
    }
    if (gameBgEl) {
      gameBgEl.style.transform = `translate3d(${mouseX * -0.5}px, ${(mouseY - scrollY * 0.12) * -0.5}px, 0)`;
    }
  };

  onMount(() => {
    isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (typeof window !== "undefined") {
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
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).has("panel")) {
      return;
    }
    activePanel = null;
  };
</script>

<section
  id="hero"
  class="relative isolate w-full overflow-hidden bg-[#344253]"
  aria-label="Welcome to Renhet Studio"
  onmousemove={onMouseMove}
>
  <!-- Base Full-Bleed Desktop Wave Background: z-0 sets the landscape (Pond blue on left, dark pub on right) -->
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
      <!-- Layer 1: Sub-surface accent wave (sky blue) -->
      <path
        d="{activeStudioSubContour} L -40,1000 L -40,0 Z"
        fill="#b8d4f0"
        opacity="0.4"
        class="wave-path-seam"
      />

      <!-- Layer 2: Main Studio pond wave (#8fb8d8) -->
      <path
        d="{activeStudioContour} L -40,1000 L -40,0 Z"
        fill="#8fb8d8"
        class="wave-path-seam"
      />
    </svg>
  </div>

  <!-- Dynamic Wave Cover & Highlight Stroke: z-20 sits on top of the shrinking panel to cleanly mask and cover any overflowing text/graphics -->
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
      <!-- When Studio is active: pond wave extends right over Beelze Pub with leading transparent accent tip -->
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

      <!-- When Beelze Pub is active: tavern wave extends left over Studio with leading transparent accent tip -->
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

      <!-- Sub-surface accent rim stroke -->
      <path
        d={activeStudioSubContour}
        fill="none"
        stroke="#fffdf3"
        stroke-width="1.2"
        stroke-opacity="0.2"
        stroke-linecap="round"
        class="wave-path-seam"
      />

      <!-- Tactile artisan crest highlight stroke: always visible at z-20 slicing above the inactive panel -->
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
    class="hero-split-container grid min-h-[94vh] w-full grid-cols-1 xl:grid-cols-2 {activePanel ===
    'studio'
      ? 'xl:grid-cols-[1.28fr_0.72fr]'
      : activePanel === 'game'
        ? 'xl:grid-cols-[0.72fr_1.28fr]'
        : 'xl:grid-cols-[1fr_1fr]'}"
  >
    <!-- LEFT PANEL: The Studio — entire panel links to #crew -->
    <a
      href="#crew"
      class="panel-studio group relative flex flex-col items-center justify-start bg-[#8fb8d8] xl:bg-transparent px-6 pt-24 pb-14 sm:px-10 sm:pt-28 sm:pb-16 xl:px-10 xl:pt-36 2xl:px-16 2xl:pt-40 {activePanel ===
      'studio'
        ? 'z-30'
        : 'z-10'}"
      onmouseenter={() => handlePanelEnter("studio")}
      onmouseleave={handlePanelLeave}
    >
      <!-- Studio Ambient Background Accents -->
      <div
        bind:this={studioBgEl}
        class="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
      >
        <div class="absolute -left-12 top-24 h-72 w-72 rounded-full bg-[#b8d4f0]/25 blur-3xl"></div>
        <div class="absolute bottom-20 right-10 h-64 w-64 rounded-full bg-[#fffdf3]/15 blur-2xl"></div>
      </div>

      <!-- Mobile Horizontal Seam Separator -->
      <div
        class="pointer-events-none absolute -bottom-5 left-0 right-0 z-20 block h-10 w-full overflow-hidden xl:hidden"
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

      <!-- Studio Content Block (Centered, matching Beelze Pub vertical alignment, logo on top + large text below) -->
      <div
        class="hero-text-block relative z-30 mx-auto flex w-full max-w-sm flex-col items-center text-center sm:max-w-md xl:w-max xl:max-w-none {activePanel ===
        'studio'
          ? 'is-active'
          : activePanel === 'game'
            ? 'is-inactive'
            : ''}"
      >
        <!-- Large Renhet Studio Brand Logo inline on top -->
        <div class="mb-5 sm:mb-7 flex w-full items-center justify-center">
          <img
            src="/renhet-logo-white.png"
            width="1024"
            height="516"
            alt="Renhet Studio"
            class="w-[68%] max-w-xs sm:max-w-sm xl:max-w-md object-contain drop-shadow-[0_8px_32px_rgba(255,253,243,0.22)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />
        </div>

        <h1
          class="text-shadow-studio text-center text-2xl font-black leading-[1.08] tracking-tight text-[#fffdf3] sm:text-3xl md:text-4xl xl:text-[2.5rem] 2xl:text-[3rem]"
        >
          <span class="inline-block xl:whitespace-nowrap">Friendly detailed worlds</span>
          <br class="hidden sm:inline" />
          <span class="inline-block xl:whitespace-nowrap">filled with passion.</span>
        </h1>

        <p class="text-shadow-studio-subtle mt-3 sm:mt-4 mx-auto text-center text-sm font-semibold leading-relaxed text-[#fffdf3]/90 sm:text-base xl:text-lg">
          <span class="inline-block xl:whitespace-nowrap">A tiny indie game studio</span>
          <br class="hidden sm:inline" />
          <span class="inline-block xl:whitespace-nowrap">making warm, handmade things.</span>
        </p>
      </div>
    </a>

    <!-- RIGHT PANEL: Beelze Pub — entire panel links to #game -->
    <!-- Solid full-bleed 100% height, zero vertical gaps -->
    <a
      href="#game"
      class="panel-game group relative flex flex-col items-center justify-start bg-transparent px-6 pt-20 pb-72 text-[#fffdf3] no-underline sm:px-10 sm:pt-24 sm:pb-80 xl:px-10 xl:pt-36 xl:pb-16 2xl:px-16 2xl:pt-40 {activePanel ===
      'game'
        ? 'z-30'
        : 'z-10'}"
      onmouseenter={() => handlePanelEnter("game")}
      onmouseleave={handlePanelLeave}
    >

      <!-- Beelze Pub Watermark Background — atmospheric backdrop framing the tavern -->
      <div
        bind:this={gameBgEl}
        class="pointer-events-none absolute inset-0 z-0 flex items-center justify-center pt-16 sm:pt-24"
        aria-hidden="true"
      >
        <img
          src="/beelze-pub/logo.png"
          alt=""
          width="520"
          height="260"
          class="w-[80%] max-w-md object-contain transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] {activePanel ===
          'game'
            ? 'opacity-30 scale-105'
            : activePanel === 'studio'
              ? 'opacity-10 scale-90'
              : 'opacity-22 scale-100'} filter drop-shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
        />
        <div class="absolute right-0 top-1/4 h-80 w-80 rounded-full bg-[#8fb8d8]/15 blur-3xl"></div>
      </div>

      <!-- Skelly GIF — anchored to the bottom and centered horizontally in ITS section -->
      <!-- Defringed 141-frame asset with crisp lineart and tavern illumination glow -->
      <div
        class="pointer-events-none absolute -bottom-5 left-1/2 z-25 -translate-x-1/2 sm:-bottom-7 xl:-bottom-9 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] {activePanel ===
        'game'
          ? 'scale-105 opacity-100'
          : activePanel === 'studio'
            ? 'scale-90 opacity-65'
            : 'scale-100 opacity-100'}"
        aria-hidden="true"
      >
        <img
          src="/beelze-pub/skelly-anim.gif"
          alt="Skelly serving drinks in Beelze Pub"
          width="706"
          height="211"
          class="block h-[220px] w-auto max-w-none object-contain object-bottom align-bottom transition-all duration-500 {activePanel ===
          'game'
            ? 'drop-shadow-[0_-18px_44px_rgba(143,184,216,0.5)]'
            : 'drop-shadow-[0_-14px_36px_rgba(143,184,216,0.35)]'} sm:h-[280px] md:h-[340px] xl:h-[390px] 2xl:h-[450px]"
          loading="eager"
        />
      </div>

      <!-- Beelze Pub Content Block (Centered, locked measure so text NEVER wraps, camera depth-of-field focus) -->
      <div
        class="hero-text-block relative z-30 mx-auto flex w-full max-w-sm flex-col items-center text-center sm:max-w-md xl:w-max xl:max-w-none {activePanel ===
        'game'
          ? 'is-active'
          : activePanel === 'studio'
            ? 'is-inactive'
            : ''}"
      >
        <!-- Mobile contrast backdrop: atmospheric tavern vignette ensuring crisp text readability over Skelly on mobile -->
        <div
          class="pointer-events-none absolute -inset-x-8 -inset-y-6 -z-10 rounded-full bg-[#1e2632]/85 blur-2xl xl:hidden"
          aria-hidden="true"
        ></div>

        <h2
          class="text-shadow-pub text-center text-3xl font-black leading-[0.95] tracking-tight text-[#fffdf3] sm:text-4xl md:text-5xl xl:text-5xl 2xl:text-6xl"
        >
          <span class="inline-block xl:whitespace-nowrap">Beelze Pub</span>
        </h2>

        <p class="text-shadow-pub-subtle mt-3 sm:mt-4 mx-auto text-center text-sm font-semibold leading-relaxed text-[#f3f1e7] sm:text-base xl:text-lg">
          <span class="inline-block xl:whitespace-nowrap">Mix drinks. Serve the underworld.</span>
          <br class="hidden sm:inline" />
          <span class="inline-block xl:whitespace-nowrap">Survive the weekend.</span>
        </p>
      </div>
    </a>
  </div>

  <!-- Integrated Bottom Wave Divider: transitions hero pond/pub directly into paper body -->
  <div class="pointer-events-none absolute bottom-0 left-0 right-0 z-40">
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

  .hero-text-block {
    scale: 1;
    opacity: 1;
    filter: blur(0);
    transform-origin: center top;
    transition:
      scale 750ms cubic-bezier(0.16, 1, 0.3, 1),
      transform 750ms cubic-bezier(0.16, 1, 0.3, 1),
      opacity 650ms cubic-bezier(0.16, 1, 0.3, 1),
      filter 650ms cubic-bezier(0.16, 1, 0.3, 1);
    will-change: scale, transform, opacity, filter;
  }

  @media (min-width: 1280px) {
    .hero-text-block.is-active {
      scale: 1.04;
      opacity: 1;
      filter: blur(0);
    }

    .hero-text-block.is-inactive {
      scale: 0.76;
      opacity: 0.65;
      filter: blur(0.2px);
    }
  }

  .text-shadow-studio {
    text-shadow:
      0 2px 14px rgba(35, 52, 70, 0.35),
      0 1px 3px rgba(35, 52, 70, 0.22);
  }

  .text-shadow-studio-subtle {
    text-shadow: 0 1px 8px rgba(35, 52, 70, 0.25);
  }

  .text-shadow-pub {
    text-shadow:
      0 3px 20px rgba(10, 15, 22, 0.95),
      0 1px 4px rgba(10, 15, 22, 0.85),
      0 0 2px rgba(10, 15, 22, 0.95);
  }

  .text-shadow-pub-subtle {
    text-shadow:
      0 2px 14px rgba(10, 15, 22, 0.9),
      0 1px 4px rgba(10, 15, 22, 0.8),
      0 0 1px rgba(10, 15, 22, 0.85);
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-split-container,
    .wave-path-seam,
    .hero-text-block {
      transition: none !important;
      animation: none !important;
    }
  }
</style>
