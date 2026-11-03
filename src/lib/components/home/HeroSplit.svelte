<script lang="ts">
  import { onMount } from "svelte";
  import { sound } from "$lib/audio/soundEffects";
  import IconArrow from "$lib/components/icons/IconArrow.svelte";
  import IconItch from "$lib/components/icons/IconItch.svelte";
  import IconExternal from "$lib/components/icons/IconExternal.svelte";
  import IconSparkle from "$lib/components/icons/IconSparkle.svelte";

  let activePanel = $state<"studio" | "game" | null>(null);
  let mouseX = $state(0);
  let mouseY = $state(0);
  let scrollY = $state(0);
  let isReducedMotion = $state(false);

  onMount(() => {
    isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onScroll = () => {
      scrollY = window.scrollY;
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
    mouseX = x * 18;
    mouseY = y * 18;
  };

  const handlePanelEnter = (panel: "studio" | "game") => {
    if (activePanel !== panel) {
      activePanel = panel;
      sound.playHover(panel === "studio" ? 480 : 540);
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
    class="hero-split-container grid min-h-[92vh] w-full grid-cols-1 lg:grid-cols-2 {activePanel ===
    'studio'
      ? 'lg:grid-cols-[1.24fr_0.76fr]'
      : activePanel === 'game'
        ? 'lg:grid-cols-[0.76fr_1.24fr]'
        : 'lg:grid-cols-[1fr_1fr]'}"
  >
    <!-- LEFT PANEL: The Studio -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="panel-studio relative flex flex-col justify-center bg-[#8fb8d8] px-6 py-28 text-[#fffdf3] sm:px-10 md:py-36 lg:px-16 {activePanel ===
      'game'
        ? 'opacity-85'
        : 'opacity-100'}"
      onmouseenter={() => handlePanelEnter("studio")}
      onmouseleave={handlePanelLeave}
    >
      <!-- Parallax ambient bubble accents -->
      <div
        class="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
        style={!isReducedMotion
          ? `transform: translate3d(${mouseX * -0.6}px, ${(mouseY - scrollY * 0.15) * -0.6}px, 0);`
          : ""}
      >
        <div
          class="absolute -left-12 top-24 h-56 w-56 rounded-full bg-[#b8d4f0]/25 blur-2xl"
        ></div>
        <div
          class="absolute bottom-16 right-10 h-40 w-40 rounded-full bg-[#fffdf3]/15 blur-xl"
        ></div>
      </div>

      <div
        class="relative z-10 mx-auto w-full max-w-xl transition-transform duration-500 ease-out"
        style={!isReducedMotion
          ? `transform: translate3d(${mouseX * 0.4}px, ${(mouseY - scrollY * 0.1) * 0.4}px, 0);`
          : ""}
      >
        <div class="mb-4 inline-flex items-center gap-2 rounded-full bg-[#fffdf3]/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#fffdf3]">
          <IconSparkle size={13} class="text-[#fffdf3]" />
          <span>Independent Game Studio</span>
        </div>

        <h1
          class="text-balance text-4xl font-black leading-[0.92] tracking-tight text-[#fffdf3] sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Friendly detailed worlds filled with passion.
        </h1>

        <p class="mt-6 max-w-lg text-lg font-semibold leading-relaxed text-[#fffdf3]/95 sm:text-xl">
          A tiny indie game studio making warm, handmade things.
        </p>

        <div class="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#crew"
            class="group inline-flex items-center gap-2 rounded-full bg-[#fffdf3] px-6 py-3.5 text-base font-black text-[#4f5f70] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#b8d4f0] hover:text-[#344253]"
            onmouseenter={() => sound.playHover(520)}
            onclick={() => sound.playPop(620)}
          >
            <span>The crew</span>
            <IconArrow direction="down" size={16} class="transition-transform group-hover:translate-y-0.5" />
          </a>

          <a
            href="#craft"
            class="inline-flex items-center gap-2 rounded-full border-2 border-[#fffdf3]/50 px-5 py-3 text-sm font-bold text-[#fffdf3] transition-all duration-200 hover:border-[#fffdf3] hover:bg-[#fffdf3]/10"
            onmouseenter={() => sound.playHover(460)}
          >
            <span>How we work</span>
          </a>
        </div>
      </div>
    </div>

    <!-- RIGHT PANEL: The Game (Beelze Pub) -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="panel-game relative flex flex-col justify-center bg-[#344253] px-6 py-28 text-[#fffdf3] sm:px-10 md:py-36 lg:px-16 {activePanel ===
      'studio'
        ? 'opacity-85'
        : 'opacity-100'}"
      onmouseenter={() => handlePanelEnter("game")}
      onmouseleave={handlePanelLeave}
    >
      <!-- Parallax ambient cocktail glow -->
      <div
        class="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
        style={!isReducedMotion
          ? `transform: translate3d(${mouseX * -0.5}px, ${(mouseY - scrollY * 0.12) * -0.5}px, 0);`
          : ""}
      >
        <div
          class="absolute right-0 top-1/4 h-72 w-72 rounded-full bg-[#8fb8d8]/20 blur-3xl"
        ></div>
        <div
          class="absolute bottom-10 left-10 h-36 w-36 rounded-full bg-[#b8d4f0]/10 blur-xl"
        ></div>
      </div>

      <div
        class="relative z-10 mx-auto w-full max-w-xl transition-transform duration-500 ease-out"
        style={!isReducedMotion
          ? `transform: translate3d(${mouseX * 0.3}px, ${(mouseY - scrollY * 0.08) * 0.3}px, 0);`
          : ""}
      >
        <div class="mb-4 inline-flex items-center gap-2 rounded-full bg-[#8fb8d8]/25 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#b8d4f0]">
          <span class="inline-block h-2 w-2 rounded-full bg-[#b8d4f0]"></span>
          <span>Debut Game &bull; Out Now</span>
        </div>

        <div class="flex items-center gap-6">
          <div class="flex-1">
            <h2
              class="text-balance text-3xl font-black leading-[0.95] tracking-tight text-[#fffdf3] sm:text-4xl md:text-5xl"
            >
              Beelze Pub
            </h2>

            <p class="mt-4 text-base font-medium leading-relaxed text-[#d6d5ca] sm:text-lg">
              Mix drinks, serve underworld regulars, and survive the weekend as Skelly, a laid-back skeletender filling in at the tavern.
            </p>
          </div>

          <!-- Animated Skelly Character Highlight -->
          <div class="relative shrink-0">
            <div
              class="relative flex h-28 w-28 items-center justify-center rounded-2xl bg-[#4f5f70]/60 p-2 shadow-lg backdrop-blur-sm sm:h-36 sm:w-36"
            >
              <img
                src="/beelze-pub/skelly-anim.gif"
                alt="Skelly serving drinks in Beelze Pub"
                width="128"
                height="128"
                class="h-full w-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.3)]"
                loading="eager"
              />
            </div>
            <div class="absolute -bottom-2 -right-2 rounded-full bg-[#8fb8d8] px-2 py-0.5 text-[10px] font-black uppercase text-[#344253]">
              Playable
            </div>
          </div>
        </div>

        <div class="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="https://renhetstudio.itch.io/beelze-pub"
            target="_blank"
            rel="noreferrer"
            class="group inline-flex items-center gap-2.5 rounded-full bg-[#8fb8d8] px-6 py-3.5 text-base font-black text-[#344253] shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#b8d4f0]"
            onmouseenter={() => sound.playHover(560)}
            onclick={() => sound.playDing()}
          >
            <IconItch size={18} />
            <span>Play on Itch.io</span>
            <IconExternal size={14} class="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          <a
            href="#game"
            class="inline-flex items-center gap-2 rounded-full border border-[#d6d5ca]/40 px-5 py-3 text-sm font-bold text-[#fffdf3] transition-all duration-200 hover:border-[#d6d5ca] hover:bg-[#fffdf3]/10"
            onmouseenter={() => sound.playHover(460)}
            onclick={() => sound.playPop(520)}
          >
            <span>Screenshots &amp; lore</span>
            <IconArrow direction="down" size={14} />
          </a>
        </div>
      </div>
    </div>
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

  @media (prefers-reduced-motion: reduce) {
    .hero-split-container,
    .panel-studio,
    .panel-game {
      transition: none !important;
    }
  }
</style>
