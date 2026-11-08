<script lang="ts">
  import { onMount } from "svelte";
  import WaveDivider from "$lib/components/home/WaveDivider.svelte";

  let activePanel = $state<"studio" | "game" | null>(null);
  let isReducedMotion = $state(false);

  // Unified full-bleed morphing wave divider (viewBox 0 0 1000 1000) — INTACTO
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
  class="relative isolate w-full overflow-hidden bg-[#344253]"
  aria-label="Welcome to Renhet Studio"
  onmousemove={onMouseMove}
>
  <!-- Base Full-Bleed Desktop Wave Background: z-0 -->
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

  <!-- Dynamic Wave Cover & Highlight Stroke: z-20 -->
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
    class="hero-split-container grid min-h-[94vh] w-full grid-cols-1 xl:grid-cols-2 {activePanel ===
    'studio'
      ? 'xl:grid-cols-[1.28fr_0.72fr]'
      : activePanel === 'game'
        ? 'xl:grid-cols-[0.72fr_1.28fr]'
        : 'xl:grid-cols-[1fr_1fr]'}"
  >
    <!-- ==========================================
         LEFT PANEL: The Studio (#crew)
         Composición superpuesta con relieve 3D
         ========================================== -->
    <a
      href="#crew"
      aria-label="Meet the Renhet Studio crew"
      class="panel-studio group relative flex min-h-[540px] flex-col items-center justify-end bg-[#8fb8d8] px-6 pt-24 pb-20 no-underline sm:min-h-[600px] sm:px-10 xl:min-h-0 xl:bg-transparent xl:pb-24 {activePanel ===
      'studio'
        ? 'z-30'
        : 'z-10'}"
      onmouseenter={() => handlePanelEnter("studio")}
      onmouseleave={handlePanelLeave}
    >
      <!-- CAPA 1 (z-0): Marca de agua gigante del Sol de Renhet + Halo atmosférico -->
      <!-- Hace de espejo con la marca de agua de Beelze Pub y ancla la base de la ola -->
      <div
        bind:this={studioBgEl}
        class="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-visible"
        aria-hidden="true"
      >
        <!-- Halo central cálido detrás del tótem -->
        <div
          class="absolute top-1/2 left-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fffdf3]/25 blur-3xl"
        ></div>
        <!-- Sombra ambiental suave en la esquina superior izquierda para dar viñeta -->
        <div
          class="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[#344253]/15 blur-3xl"
        ></div>

        <!-- Marca de agua de Renhet Symbol en el fondo -->
        <picture class="flex items-center justify-center">
          <source
            type="image/avif"
            srcset="/optimized/renhet-symbol-white-240.avif 240w, /optimized/renhet-symbol-white-480.avif 480w"
            sizes="(max-width: 640px) 280px, (max-width: 1280px) 440px, 520px"
          />
          <source
            type="image/webp"
            srcset="/optimized/renhet-symbol-white-240.webp 240w, /optimized/renhet-symbol-white-480.webp 480w"
            sizes="(max-width: 640px) 280px, (max-width: 1280px) 440px, 520px"
          />
          <img
            src="/renhet-symbol-white.png"
            alt=""
            width="475"
            height="475"
            class="h-auto w-[82%] max-w-[420px] sm:max-w-[500px] xl:max-w-[580px] 2xl:max-w-[640px] object-contain transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] {activePanel ===
            'studio'
              ? 'opacity-30 scale-[1.12] rotate-3'
              : activePanel === 'game'
                ? 'opacity-10 scale-90 -rotate-2'
                : 'opacity-20 scale-100 rotate-0'} filter drop-shadow-[0_8px_32px_rgba(255,253,243,0.2)]"
          />
        </picture>
      </div>

      <!-- CAPA 2 (z-25): Tótem central superpuesto (Logo grande con extrusión + Eslogan pisando el logo) -->
      <div
        class="pointer-events-none relative z-25 my-auto flex w-full flex-col items-center justify-center pt-10 pb-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] {activePanel ===
        'studio'
          ? 'scale-105 opacity-100'
          : activePanel === 'game'
            ? 'scale-90 opacity-45'
            : 'scale-100 opacity-100'}"
      >
        <!-- Logo de Renhet Studio a gran escala con sombra dura 3D (#344253) como el arte de Beelze Pub -->
        <img
          src="/renhet-logo-white.png"
          alt="Renhet Studio"
          width="1024"
          height="516"
          class="studio-logo-extrusion relative z-10 w-[84%] max-w-[360px] sm:max-w-[430px] xl:max-w-[490px] 2xl:max-w-[540px] -rotate-1 object-contain transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-2 group-hover:scale-[1.03]"
        />

        <!-- Eslogan: tipografía limpia en Paperlogy acorde a la identidad de la web -->
        <div
          class="relative z-20 -mt-2 sm:-mt-3 flex flex-col items-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        >
          <h1
            class="studio-slogan-extrusion text-center font-brand tracking-normal text-[#fffdf3]"
          >
            <span
              class="block text-2xl sm:text-3xl xl:text-[2.4rem] 2xl:text-[2.75rem] leading-[1.08] tracking-wide"
            >
              Friendly detailed worlds
            </span>
          </h1>
        </div>
      </div>

      <!-- CAPA 3 (z-30): Pill CTA -->
      <div
        class="hero-cta-pill relative z-30 flex items-center gap-2.5 rounded-full border border-[#fffdf3]/45 bg-[#344253]/90 px-6 py-3 text-sm font-bold tracking-tight text-[#fffdf3] shadow-lg backdrop-blur-md transition-all duration-500 group-hover:scale-105 group-hover:border-[#fffdf3] group-hover:bg-[#fffdf3] group-hover:text-[#344253] {activePanel ===
        'game'
          ? 'opacity-40 scale-90'
          : 'opacity-100'}"
      >
        <span>Meet the crew</span>
        <span
          class="transition-transform duration-300 group-hover:translate-y-0.5"
          aria-hidden="true">↓</span
        >
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

    <!-- ==========================================
         RIGHT PANEL: Beelze Pub (#game) — INTACTO
         ========================================== -->
    <a
      href="#game"
      aria-label="Explore Beelze Pub"
      class="panel-game group relative flex min-h-[540px] flex-col items-center justify-end bg-transparent px-6 pt-20 pb-20 text-[#fffdf3] no-underline sm:min-h-[600px] sm:px-10 xl:min-h-0 xl:pb-24 {activePanel ===
      'game'
        ? 'z-30'
        : 'z-10'}"
      onmouseenter={() => handlePanelEnter("game")}
      onmouseleave={handlePanelLeave}
    >
      <!-- CAPA 1: Logo de Beelze Pub de fondo -->
      <div
        bind:this={gameBgEl}
        class="pointer-events-none absolute inset-0 z-0 flex items-center justify-center pb-24 sm:pb-32 xl:pb-28"
        aria-hidden="true"
      >
        <div
          class="absolute right-0 top-1/4 h-80 w-80 rounded-full bg-[#8fb8d8]/15 blur-3xl"
        ></div>

        <img
          src="/beelze-pub/logo.png"
          alt=""
          width="520"
          height="260"
          class="w-[80%] max-w-md object-contain transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] {activePanel ===
          'game'
            ? 'opacity-85 scale-105'
            : activePanel === 'studio'
              ? 'opacity-15 scale-90'
              : 'opacity-50 scale-100'} filter drop-shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
        />
      </div>

      <!-- CAPA 2: Skelly GIF anclado abajo en primer plano -->
      <div
        class="pointer-events-none absolute -bottom-5 left-1/2 z-25 -translate-x-1/2 sm:-bottom-7 xl:-bottom-9 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] {activePanel ===
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
          class="block h-[220px] w-auto max-w-none object-contain object-bottom align-bottom transition-all duration-500 {activePanel ===
          'game'
            ? 'drop-shadow-[0_-18px_44px_rgba(143,184,216,0.5)]'
            : 'drop-shadow-[0_-14px_36px_rgba(143,184,216,0.35)]'} sm:h-[280px] md:h-[340px] xl:h-[390px] 2xl:h-[450px]"
          loading="eager"
        />
      </div>

      <!-- CAPA 3: Pill CTA -->
      <div
        class="hero-cta-pill relative z-30 flex items-center gap-2.5 rounded-full border border-[#fffdf3]/35 bg-[#1e2632]/75 px-6 py-3 text-sm font-bold tracking-tight text-[#fffdf3] shadow-lg backdrop-blur-md transition-all duration-500 group-hover:scale-105 group-hover:border-[#fffdf3] group-hover:bg-[#fffdf3] group-hover:text-[#344253] {activePanel ===
        'studio'
          ? 'opacity-40 scale-90'
          : 'opacity-100'}"
      >
        <span>Explore Beelze Pub</span>
        <span
          class="transition-transform duration-300 group-hover:translate-y-0.5"
          aria-hidden="true">↓</span
        >
      </div>
    </a>
  </div>

  <!-- Integrated Bottom Wave Divider: INTACTO -->
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
    filter: drop-shadow(0 1px 0 #34425320) drop-shadow(0 -1px 0 #34425320)
      drop-shadow(1.5px 0 0 #34425320) drop-shadow(-1.5px 0 0 #34425320)
      drop-shadow(0 5px 10px rgba(30, 38, 50, 0.25));
  }

  .hero-split-container {
    transition: grid-template-columns 750ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .wave-path-seam {
    transition: d 750ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-split-container,
    .wave-path-seam,
    .hero-cta-pill {
      transition: none !important;
      animation: none !important;
    }
  }
</style>
