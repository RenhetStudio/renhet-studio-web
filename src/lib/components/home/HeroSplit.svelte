<script lang="ts">
  import { onMount } from "svelte";
  import WaveDivider from "$lib/components/home/WaveDivider.svelte";

  let activePanel = $state<"studio" | "game" | null>(null);
  let isReducedMotion = $state(false);

  // 1. Studio wave contours (viewBox 0 0 100 1000, anchored with 8px internal overlap inside Studio)
  // Neutral: prominent flowing wave (~46px crests)
  const sNeutral =
    "M -8,0 C 36,70 46,160 30,250 C 16,340 48,430 34,520 C 18,610 42,700 26,790 C 12,870 30,940 0,1000";
  // Active: deep surge into tavern (~92px crests)
  const sActive =
    "M -8,0 C 72,70 92,160 70,250 C 46,340 98,430 84,520 C 58,610 88,700 66,790 C 40,870 65,940 0,1000";
  // Retracted: pulled flush into Studio border (0px)
  const sRetracted =
    "M -8,0 C 0,70 0,160 0,250 C 0,340 0,430 0,520 C 0,610 0,700 0,790 C 0,870 0,940 0,1000";

  const sSubNeutral =
    "M -8,0 C 46,70 58,160 40,250 C 24,340 60,430 44,520 C 26,610 52,700 34,790 C 16,870 40,940 0,1000";
  const sSubActive =
    "M -8,0 C 85,70 100,160 82,250 C 60,340 100,430 96,520 C 72,610 98,700 78,790 C 50,870 78,940 0,1000";
  const sSubRetracted =
    "M -8,0 C 0,70 0,160 0,250 C 0,340 0,430 0,520 C 0,610 0,700 0,790 C 0,870 0,940 0,1000";

  // 2. Game wave contours (viewBox 0 0 100 1000, anchored with 8px internal overlap inside Pub)
  // Exact symmetrical mirror: x' = 100 - x
  const gActive =
    "M 108,0 C 28,70 8,160 30,250 C 54,340 2,430 16,520 C 42,610 12,700 34,790 C 60,870 35,940 100,1000";
  const gRetracted =
    "M 108,0 C 100,70 100,160 100,250 C 100,340 100,430 100,520 C 100,610 100,700 100,790 C 100,870 100,940 100,1000";

  const gSubActive =
    "M 108,0 C 15,70 0,160 18,250 C 40,340 0,430 4,520 C 28,610 2,700 22,790 C 50,870 22,940 100,1000";
  const gSubRetracted =
    "M 108,0 C 100,70 100,160 100,250 C 100,340 100,430 100,520 C 100,610 100,700 100,790 C 100,870 100,940 100,1000";

  let activeStudioContour = $derived(
    activePanel === "studio" ? sActive : activePanel === "game" ? sRetracted : sNeutral
  );
  let activeStudioSubContour = $derived(
    activePanel === "studio" ? sSubActive : activePanel === "game" ? sSubRetracted : sSubNeutral
  );

  let activeGameContour = $derived(
    activePanel === "game" ? gActive : gRetracted
  );
  let activeGameSubContour = $derived(
    activePanel === "game" ? gSubActive : gSubRetracted
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
  class="relative isolate w-full overflow-hidden bg-[#344253]"
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
    <!-- Solid full-bleed 100% height, zero vertical gaps, -mr-[2px] overlap to prevent subpixel seam crack -->
    <a
      href="#crew"
      class="panel-studio group relative flex flex-col items-center justify-start bg-[#8fb8d8] px-6 pt-28 pb-16 text-[#fffdf3] no-underline sm:px-10 sm:pt-36 lg:px-16 lg:pt-40 -mr-[2px] {activePanel ===
      'game'
        ? 'z-10'
        : 'z-20'}"
      onmouseenter={() => handlePanelEnter("studio")}
      onmouseleave={handlePanelLeave}
    >
      <!-- Studio Ambient Background Accents -->
      <div
        bind:this={studioBgEl}
        class="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        <div class="absolute -left-12 top-24 h-72 w-72 rounded-full bg-[#b8d4f0]/25 blur-3xl"></div>
        <div class="absolute bottom-20 right-10 h-64 w-64 rounded-full bg-[#fffdf3]/15 blur-2xl"></div>
      </div>

      <!-- Studio Wave Separator: extends to the right over Beelze Pub -->
      <!-- Anchored with 4px physical offset and 8px vector overlap to permanently eliminate hairline cracks -->
      <div
        class="pointer-events-none absolute top-0 bottom-0 left-[calc(100%-4px)] z-20 hidden w-28 overflow-visible lg:block"
        aria-hidden="true"
      >
        <div class="h-full w-full">
          <svg
            viewBox="0 0 100 1000"
            preserveAspectRatio="none"
            class="h-full w-full overflow-visible"
            xmlns="http://www.w3.org/2000/svg"
          >
            <!-- Layer 1: Sub-surface accent wave (sky blue) -->
            <path
              d="{activeStudioSubContour} L -8,1000 Z"
              fill="#b8d4f0"
              opacity="0.4"
              class="wave-path-seam"
            />

            <!-- Layer 2: Main Studio pond wave (#8fb8d8) -->
            <path
              d="{activeStudioContour} L -8,1000 Z"
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

      <!-- Studio Content Block (Centered, locked measure so text NEVER wraps, camera depth-of-field focus) -->
      <div
        class="hero-text-block relative z-30 mx-auto flex w-[90%] max-w-sm flex-col items-center text-center sm:max-w-md lg:w-[440px] lg:max-w-none shrink-0 {activePanel ===
        'studio'
          ? 'is-active'
          : activePanel === 'game'
            ? 'is-inactive'
            : ''}"
      >
        <!-- Inline Renhet Studio Brand Logo -->
        <picture class="inline-block transition-transform duration-300 group-hover:scale-105">
          <source
            type="image/avif"
            srcset="/optimized/renhet-logo-white-360.avif 360w, /optimized/renhet-logo-white-720.avif 720w"
            sizes="(min-width: 640px) 260px, 180px"
          />
          <source
            type="image/webp"
            srcset="/optimized/renhet-logo-white-360.webp 360w, /optimized/renhet-logo-white-720.webp 720w"
            sizes="(min-width: 640px) 260px, 180px"
          />
          <img
            src="/renhet-logo-white.png"
            width="360"
            height="181"
            alt="Renhet Studio"
            class="h-16 w-auto object-contain drop-shadow-[0_4px_24px_rgba(255,253,243,0.22)] sm:h-20 lg:h-22"
          />
        </picture>

        <h1
          class="text-shadow-studio mt-6 text-balance text-center text-3xl font-black leading-[1.02] tracking-tight text-[#fffdf3] sm:text-4xl md:text-5xl lg:text-6xl"
        >
          Friendly detailed worlds filled with passion.
        </h1>

        <p class="text-shadow-studio-subtle mt-4 mx-auto max-w-md text-center text-base font-semibold leading-relaxed text-[#fffdf3]/90 sm:text-lg">
          A tiny indie game studio making warm, handmade things.
        </p>
      </div>
    </a>

    <!-- RIGHT PANEL: Beelze Pub — entire panel links to #game -->
    <!-- Solid full-bleed 100% height, zero vertical gaps -->
    <a
      href="#game"
      class="panel-game group relative flex flex-col items-center justify-start bg-[#344253] px-6 pt-28 pb-16 text-[#fffdf3] no-underline sm:px-10 sm:pt-36 lg:px-16 lg:pt-40 {activePanel ===
      'game'
        ? 'z-20'
        : 'z-10'}"
      onmouseenter={() => handlePanelEnter("game")}
      onmouseleave={handlePanelLeave}
    >
      <!-- Beelze Pub Watermark Background — atmospheric backdrop framing the tavern -->
      <div
        bind:this={gameBgEl}
        class="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden pt-16 sm:pt-24"
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
              ? 'opacity-15 scale-95'
              : 'opacity-22 scale-100'} filter drop-shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
        />
        <div class="absolute right-0 top-1/4 h-80 w-80 rounded-full bg-[#8fb8d8]/15 blur-3xl"></div>
      </div>

      <!-- Beelze Pub Wave Separator: extends to the left over Studio -->
      <!-- Anchored with 4px physical offset and 8px vector overlap to permanently eliminate hairline cracks -->
      <div
        class="pointer-events-none absolute top-0 bottom-0 right-[calc(100%-4px)] z-20 hidden w-28 overflow-visible lg:block"
        aria-hidden="true"
      >
        <div class="h-full w-full">
          <svg
            viewBox="0 0 100 1000"
            preserveAspectRatio="none"
            class="h-full w-full overflow-visible"
            xmlns="http://www.w3.org/2000/svg"
          >
            <!-- Layer 1: Sub-surface accent wave when Game active (tavern slate) -->
            <path
              d="{activeGameSubContour} L 108,1000 Z"
              fill="#4f5f70"
              opacity="0.45"
              class="wave-path-seam"
            />

            <!-- Layer 2: Main Beelze Pub dark wave (#344253) -->
            <path
              d="{activeGameContour} L 108,1000 Z"
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
          ? 'scale-105 opacity-100'
          : activePanel === 'studio'
            ? 'scale-95 opacity-75'
            : 'scale-100 opacity-100'}"
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

      <!-- Beelze Pub Content Block (Centered, locked measure so text NEVER wraps, camera depth-of-field focus) -->
      <div
        class="hero-text-block relative z-30 mx-auto flex w-[90%] max-w-sm flex-col items-center text-center sm:max-w-md lg:w-[440px] lg:max-w-none shrink-0 {activePanel ===
        'game'
          ? 'is-active'
          : activePanel === 'studio'
            ? 'is-inactive'
            : ''}"
      >
        <h2
          class="text-shadow-pub text-balance text-center text-4xl font-black leading-[0.92] tracking-tight text-[#fffdf3] sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Beelze Pub
        </h2>

        <p class="text-shadow-pub-subtle mt-4 mx-auto max-w-md text-center text-base font-semibold leading-relaxed text-[#d6d5ca] sm:text-lg">
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

  @media (min-width: 1024px) {
    .hero-text-block.is-active {
      scale: 1.03;
      opacity: 1;
      filter: blur(0);
    }

    .hero-text-block.is-inactive {
      scale: 0.8;
      opacity: 0.45;
      filter: blur(0.8px);
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
      0 3px 18px rgba(10, 15, 22, 0.65),
      0 1px 3px rgba(10, 15, 22, 0.45);
  }

  .text-shadow-pub-subtle {
    text-shadow:
      0 1px 10px rgba(10, 15, 22, 0.55),
      0 1px 2px rgba(10, 15, 22, 0.35);
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
