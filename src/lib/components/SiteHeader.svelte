<script lang="ts">
  import { onMount } from "svelte";
  import { fly, fade } from "svelte/transition";
  import { page } from "$app/state";
  import { afterNavigate } from "$app/navigation";
  import type { UserProfile } from "$lib/blog/types";
  import { sound } from "$lib/audio/soundEffects";
  import IconArrow from "$lib/components/icons/IconArrow.svelte";
  import IconChevronDown from "$lib/components/icons/IconChevronDown.svelte";

  let { profile = null }: { profile?: UserProfile | null } = $props();

  let isMuted = $state(false);
  let isHeroInView = $state(
    typeof document !== "undefined" ? Boolean(document.querySelector("[data-hero]")) : true
  );
  let isMobileMenuOpen = $state(false);
  let isUserMenuOpen = $state(false);
  let userMenuRef = $state<HTMLElement | null>(null);

  let heroResizeObserver: ResizeObserver | null = null;
  let currentObservedHero: HTMLElement | null = null;

  const updateHeroExitDistance = (hero: HTMLElement) => {
    const heroTop = hero.getBoundingClientRect().top + window.scrollY;
    const heroBottom = heroTop + hero.offsetHeight;
    // Navbar sits at top: 16px with ~64px height -> bottom edge is ~80px.
    // The exact scroll offset where the hero bottom passes the navbar bottom is: heroBottom - 80px.
    const exitDistance = Math.max(120, Math.round(heroBottom - 80));
    document.documentElement.style.setProperty("--hero-exit-distance", `${exitDistance}px`);
  };

  const checkHeroVisibility = () => {
    // Only elements tagged with `data-hero` activate the hero navbar effect.
    // Any page without `data-hero` (e.g. /account) immediately stays in the solid style.
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    if (!hero) {
      isHeroInView = false;
      document.documentElement.style.removeProperty("--hero-exit-distance");
      heroResizeObserver?.disconnect();
      currentObservedHero = null;
      return;
    }

    if (currentObservedHero !== hero) {
      heroResizeObserver?.disconnect();
      currentObservedHero = hero;
      updateHeroExitDistance(hero);
      if (typeof ResizeObserver !== "undefined") {
        if (!heroResizeObserver) {
          heroResizeObserver = new ResizeObserver(() => {
            if (currentObservedHero) {
              updateHeroExitDistance(currentObservedHero);
              const rect = currentObservedHero.getBoundingClientRect();
              isHeroInView = rect.bottom > 80;
            }
          });
        }
        heroResizeObserver.observe(hero);
      }
    } else {
      updateHeroExitDistance(hero);
    }

    const rect = hero.getBoundingClientRect();
    // Switch to solid style and morph logo exactly when the hero bottom passes under the navbar.
    isHeroInView = rect.bottom > 80;
  };

  const onScroll = () => {
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    if (!hero) {
      if (isHeroInView) isHeroInView = false;
      return;
    }
    const rect = hero.getBoundingClientRect();
    isHeroInView = rect.bottom > 80;
  };

  afterNavigate(() => {
    checkHeroVisibility();
    isUserMenuOpen = false;
    isMobileMenuOpen = false;
  });

  $effect(() => {
    void page.url.pathname;
    checkHeroVisibility();
  });

  onMount(() => {
    const unsub = sound.subscribe((muted) => {
      isMuted = muted;
    });

    const onResize = () => {
      checkHeroVisibility();
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        isMobileMenuOpen = false;
      }
      if (isUserMenuOpen) {
        isUserMenuOpen = false;
      }
    };

    checkHeroVisibility();
    // Allow slotted child components (e.g. BlogShell) to attach [data-hero] to DOM
    const rafId = requestAnimationFrame(() => {
      checkHeroVisibility();
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      unsub();
      cancelAnimationFrame(rafId);
      heroResizeObserver?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  });

  const navigation = [
    { label: "Beelze Pub", href: "/games/beelze-pub" },
    { label: "Renhet Between Builds", href: "/blog" },
    { label: "Careers", href: "/careers" },
  ];

  const canAuthor = $derived(profile ? ["author", "admin"].includes(profile.role) : false);


  const toggleSound = () => {
    sound.toggleMute();
  };

  const toggleMobileMenu = () => {
    isMobileMenuOpen = !isMobileMenuOpen;
  };
</script>

<svelte:window
  onkeydown={(e) => {
    if (e.key === "Escape") {
      if (isUserMenuOpen) isUserMenuOpen = false;
      if (isMobileMenuOpen) isMobileMenuOpen = false;
    }
  }}
  onclick={(e) => {
    if (
      isUserMenuOpen &&
      userMenuRef &&
      !userMenuRef.contains(e.target as Node)
    ) {
      isUserMenuOpen = false;
    }
  }}
/>

{#if isMobileMenuOpen}
  <button
    type="button"
    transition:fade={{ duration: 180 }}
    class="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px] md:hidden"
    aria-label="Close navigation menu"
    onclick={() => (isMobileMenuOpen = false)}
  ></button>
{/if}

<nav class="nav-shell fixed inset-x-0 top-4 z-50 px-4" aria-label="Primary navigation">
  <div
    class="nav-pill-dynamic relative mx-auto flex min-h-16 w-full max-w-5xl items-center justify-between gap-3 rounded-full border-2 px-4 text-[#fffdf3] sm:px-6 {isHeroInView
      ? 'border-[#fffdf3]/35 bg-[#627383]/45 shadow-[0_4px_24px_rgba(0,0,0,0.12)] backdrop-blur-md'
      : 'border-[#fffdf3] bg-[#627383]/92 shadow-[0_12px_40px_rgba(50,62,75,0.22)] ring-1 ring-[#fffdf3]/40 backdrop-blur-xl'}"
  >
    <!-- Logo with smooth morph between compact symbol and full wordmark (space reserved to prevent navbar layout shift) -->
    <a
      href="/"
      onclick={() => (isMobileMenuOpen = false)}
      class="relative inline-grid h-9 w-[72px] shrink-0 grid-cols-1 grid-rows-1 items-center justify-items-start transition-transform duration-200 hover:scale-105 sm:w-[80px]"
      aria-label="Renhet Studio home"
    >
      <!-- Small icon version: shown when hero is in view -->
      <picture
        class="nav-symbol-icon col-start-1 row-start-1 flex items-center justify-start origin-left {isHeroInView
          ? 'opacity-100 scale-100'
          : 'pointer-events-none opacity-0 scale-75 -translate-x-2'}"
      >
        <source
          type="image/avif"
          srcset="/optimized/renhet-symbol-white-36.avif 36w, /optimized/renhet-symbol-white-72.avif 72w"
          sizes="32px"
        />
        <source
          type="image/webp"
          srcset="/optimized/renhet-symbol-white-36.webp 36w, /optimized/renhet-symbol-white-72.webp 72w"
          sizes="32px"
        />
        <img
          src="/renhet-symbol-white.png"
          width="72"
          height="72"
          alt="Renhet Studio"
          class="h-7 w-auto object-contain sm:h-8"
        />
      </picture>

      <!-- Large wordmark version: shown when hero exits view -->
      <picture
        class="nav-wordmark-logo col-start-1 row-start-1 flex items-center justify-start origin-left {!isHeroInView
          ? 'opacity-100 scale-100'
          : 'pointer-events-none opacity-0 scale-90 translate-x-2'}"
      >
        <source
          type="image/avif"
          srcset="/optimized/renhet-logo-white-88.avif 88w, /optimized/renhet-logo-white-176.avif 176w"
          sizes="(min-width: 640px) 88px, 72px"
        />
        <source
          type="image/webp"
          srcset="/optimized/renhet-logo-white-88.webp 88w, /optimized/renhet-logo-white-176.webp 176w"
          sizes="(min-width: 640px) 88px, 72px"
        />
        <img
          src="/renhet-logo-white.png"
          width="176"
          height="89"
          alt="Renhet Studio"
          class="h-8 w-auto object-contain sm:h-9"
        />
      </picture>
    </a>

    <!-- Desktop Navigation Links (Centered mathematically at 50% of the navbar pill) -->
    <div class="hidden items-center gap-1 md:flex md:absolute md:left-1/2 md:-translate-x-1/2">
      {#each navigation as item}
        <a
          class="whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-bold text-[#fffdf3]/90 transition-all duration-200 hover:bg-[#fffdf3]/15 hover:text-[#fffdf3]"
          href={item.href}
        >
          {item.label}
        </a>
      {/each}
    </div>

    <!-- Right Controls: Audio Toggle, Auth & Mobile Menu Hamburger -->
    <div class="flex items-center justify-end gap-2 shrink-0">
      <!-- Mute/Sound Toggle — single SVG with CSS-animated elements (no swap) -->
      <button
        type="button"
        class:is-muted={isMuted}
        class="sound-toggle inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#fffdf3]/30 bg-[#fffdf3]/10 text-[#fffdf3] transition-all duration-200 hover:bg-[#fffdf3]/25 active:scale-95"
        onclick={toggleSound}
        aria-label={isMuted ? "Enable sound effects" : "Mute sound effects"}
        title={isMuted ? "Sound is muted (click to enable)" : "Sound is active (click to mute)"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <!-- Speaker body — solid filled silhouette -->
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />

          <!-- Sound waves — fade + scale in from left when unmuted -->
          <path
            d="M15.54 8.46a5 5 0 0 1 0 7.07"
            class="sound-wave sound-wave-near"
          />
          <path
            d="M19.07 4.93a10 10 0 0 1 0 14.14"
            class="sound-wave sound-wave-far"
          />

          <!-- Mute X lines — rotate in from center when muted -->
          <line
            x1="22" y1="9" x2="16" y2="15"
            class="sound-cross sound-cross-first"
          />
          <line
            x1="16" y1="9" x2="22" y2="15"
            class="sound-cross sound-cross-second"
          />
        </svg>
      </button>

      <!-- Mobile Hamburger / Close Button (CSS span morph: 3 bars → X) -->
      <button
        type="button"
        class="mobile-menu-toggle inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#fffdf3]/30 bg-[#fffdf3]/10 text-[#fffdf3] transition-all duration-200 hover:bg-[#fffdf3]/25 active:scale-95 md:hidden"
        onclick={toggleMobileMenu}
        aria-label={isMobileMenuOpen ? "Close menu" : "Open navigation menu"}
        aria-expanded={isMobileMenuOpen}
      >
        <!-- Container: h-[14px] so center = 6px; bars at 0 / 6px / 12px converge perfectly -->
        <span class="relative block h-[14px] w-[14px]" aria-hidden="true">
          <!-- Top bar → rotates +45° and slides to center -->
          <span
            class="absolute left-0 h-0.5 w-full origin-center rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] {isMobileMenuOpen
              ? 'top-[6px] rotate-45'
              : 'top-0 rotate-0'}"
          ></span>
          <!-- Middle bar → fades + scales out -->
          <span
            class="absolute left-0 top-[6px] h-0.5 w-full origin-center rounded-full bg-current transition-all duration-200 ease-out {isMobileMenuOpen
              ? 'scale-x-0 opacity-0'
              : 'scale-x-100 opacity-100'}"
          ></span>
          <!-- Bottom bar → rotates -45° and slides to center -->
          <span
            class="absolute left-0 h-0.5 w-full origin-center rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] {isMobileMenuOpen
              ? 'top-[6px] -rotate-45'
              : 'top-[12px] rotate-0'}"
          ></span>
        </span>
      </button>

      <!-- Desktop User Account Dropdown (replaces scattered Dashboard/Name/Signout buttons) -->
      {#if profile}
        <div class="relative hidden md:block" bind:this={userMenuRef}>
          <button
            type="button"
            onclick={() => (isUserMenuOpen = !isUserMenuOpen)}
            class="inline-flex h-9 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold transition-all duration-200 active:scale-95 {isUserMenuOpen
              ? 'border-[#fffdf3] bg-[#fffdf3] text-[#344253] shadow-xs'
              : 'border-[#fffdf3]/30 bg-[#fffdf3]/10 text-[#fffdf3] hover:border-[#fffdf3]/50 hover:bg-[#fffdf3]/20'}"
            aria-expanded={isUserMenuOpen}
            aria-haspopup="menu"
            aria-label="User account menu"
          >
            <span class="max-w-[130px] truncate sm:max-w-[160px]">
              {profile.display_name}
            </span>
            <IconChevronDown
              size={13}
              class="transition-transform duration-200 {isUserMenuOpen ? 'rotate-180' : ''}"
            />
          </button>

          {#if isUserMenuOpen}
            <div
              transition:fly={{ y: -6, duration: 180 }}
              class="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border-2 border-[#fffdf3] bg-[#4f5f70]/95 p-1.5 text-[#fffdf3] shadow-[0_16px_40px_rgba(30,40,55,0.35)] ring-1 ring-[#fffdf3]/30 backdrop-blur-xl"
              role="menu"
              aria-label="Account options"
            >
              <!-- User info header -->
              <div class="border-b border-[#fffdf3]/15 px-3 py-2 mb-1">
                <p class="text-[11px] font-bold uppercase tracking-wider text-[#fffdf3]/65">
                  Signed in as
                </p>
                <div class="mt-0.5 flex items-center justify-between gap-1.5">
                  <span class="truncate text-sm font-black text-[#fffdf3]">
                    {profile.display_name}
                  </span>
                  {#if canAuthor}
                    <span
                      class="shrink-0 rounded-full border border-[#8fb8d8]/60 bg-[#8fb8d8]/20 px-2 py-0.5 text-[10px] font-black text-[#fffdf3]"
                    >
                      {profile.role === 'admin' ? 'Admin' : 'Author'}
                    </span>
                  {/if}
                </div>
              </div>

              <!-- Menu Links -->
              <div class="flex flex-col gap-0.5">
                {#if canAuthor}
                  <a
                    href="/blog/dashboard"
                    role="menuitem"
                    onclick={() => (isUserMenuOpen = false)}
                    class="group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-[#fffdf3] transition-colors hover:bg-[#fffdf3]/15"
                  >
                    <span>Author Dashboard</span>
                    <IconArrow
                      direction="right"
                      size={12}
                      class="opacity-60 transition-opacity group-hover:opacity-100"
                    />
                  </a>
                {/if}

                <a
                  href="/account"
                  role="menuitem"
                  onclick={() => (isUserMenuOpen = false)}
                  class="group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-[#fffdf3] transition-colors hover:bg-[#fffdf3]/15"
                >
                  <span>Account Settings</span>
                  <IconArrow
                    direction="right"
                    size={12}
                    class="opacity-60 transition-opacity group-hover:opacity-100"
                  />
                </a>

                <div class="my-1 h-px w-full bg-[#fffdf3]/15"></div>

                <form method="POST" action="/auth/signout" class="w-full">
                  <button
                    type="submit"
                    role="menuitem"
                    class="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-rose-300 transition-colors hover:bg-rose-500/20 hover:text-rose-100 cursor-pointer"
                  >
                    <span>Sign out</span>
                    <IconArrow direction="right" size={12} class="opacity-60" />
                  </button>
                </form>
              </div>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>

  <!-- Mobile Dropdown Menu -->
  {#if isMobileMenuOpen}
    <div
      transition:fly={{ y: -8, duration: 240 }}
      class="mx-auto mt-2 w-full max-w-5xl overflow-hidden rounded-3xl border-2 p-2.5 text-[#fffdf3] shadow-[0_16px_48px_rgba(30,40,55,0.35)] backdrop-blur-xl md:hidden {isHeroInView
        ? 'border-[#fffdf3]/35 bg-[#627383]/85 ring-1 ring-[#fffdf3]/25'
        : 'border-[#fffdf3] bg-[#627383]/95 ring-1 ring-[#fffdf3]/40'}"
    >
      <div class="flex flex-col gap-1">
        {#each navigation as item}
          <a
            href={item.href}
            onclick={() => {
              isMobileMenuOpen = false;
            }}
            class="group flex items-center justify-between rounded-2xl px-4 py-3 text-base font-bold text-[#fffdf3] transition-all duration-200 hover:bg-[#fffdf3]/15 active:scale-[0.99] active:bg-[#fffdf3]/20"
          >
            <span>{item.label}</span>
            <IconArrow
              direction="right"
              size={14}
              class="text-[#fffdf3]/50 transition-colors duration-200 group-hover:text-[#fffdf3]"
            />
          </a>
        {/each}

        {#if profile}
          <div class="my-1.5 h-px w-full bg-[#fffdf3]/15"></div>

          <!-- Compact Mobile Account Section -->
          <div class="flex flex-col gap-0.5 px-1 py-0.5">
            <div class="flex items-center justify-between px-3 py-1">
              <span class="truncate text-xs font-bold text-[#fffdf3]/75">
                {profile.display_name}
              </span>
              {#if canAuthor}
                <span
                  class="shrink-0 rounded-full border border-[#8fb8d8]/60 bg-[#8fb8d8]/20 px-2 py-0.5 text-[9px] font-black text-[#fffdf3]"
                >
                  {profile.role === 'admin' ? 'Admin' : 'Author'}
                </span>
              {/if}
            </div>

            <div class="flex items-center gap-1 text-xs">
              {#if canAuthor}
                <a
                  href="/blog/dashboard"
                  onclick={() => {
                    isMobileMenuOpen = false;
                  }}
                  class="group inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 font-bold text-[#fffdf3] transition-colors hover:bg-[#fffdf3]/15 active:scale-95"
                >
                  <span>Dashboard</span>
                  <IconArrow
                    direction="right"
                    size={11}
                    class="opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100"
                  />
                </a>
              {/if}

              <a
                href="/account"
                onclick={() => {
                  isMobileMenuOpen = false;
                }}
                class="group inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 font-bold text-[#fffdf3] transition-colors hover:bg-[#fffdf3]/15 active:scale-95"
              >
                <span>Account</span>
                <IconArrow
                  direction="right"
                  size={11}
                  class="opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100"
                />
              </a>

              <form method="POST" action="/auth/signout" class="ml-auto">
                <button
                  type="submit"
                  class="group inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 font-bold text-rose-300 transition-colors hover:bg-rose-500/20 hover:text-rose-100 active:scale-95 cursor-pointer"
                >
                  <span>Sign out</span>
                  <IconArrow
                    direction="right"
                    size={11}
                    class="opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100"
                  />
                </button>
              </form>
            </div>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</nav>

<style>
  .sound-wave {
    opacity: 1;
    transform: scaleX(1);
    transition: opacity 240ms ease, transform 280ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .sound-wave-near { transform-origin: 15.54px 12px; }
  .sound-wave-far { transform-origin: 19.07px 12px; transition-delay: 0ms, 40ms; }
  .is-muted .sound-wave { opacity: 0; transform: scaleX(0.3); }

  .sound-cross {
    opacity: 0;
    transform-origin: 19px 12px;
    transition: opacity 220ms ease, transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .sound-cross-first { transform: rotate(-45deg) scale(0.3); }
  .sound-cross-second { transform: rotate(45deg) scale(0.3); transition-delay: 0ms, 30ms; }
  .is-muted .sound-cross { opacity: 1; transform: rotate(0deg) scale(1); }

  @supports (animation-timeline: scroll()) {
    :global(:root:has([data-hero])) .nav-pill-dynamic {
      animation: nav-pill-scroll linear both;
      animation-timeline: scroll();
      animation-range: calc(var(--hero-exit-distance, calc(100vh - 80px)) - 100px) var(--hero-exit-distance, calc(100vh - 80px));
    }

    :global(:root:has([data-hero])) .nav-symbol-icon {
      animation: nav-symbol-scroll linear both;
      animation-timeline: scroll();
      animation-range: calc(var(--hero-exit-distance, calc(100vh - 80px)) - 100px) var(--hero-exit-distance, calc(100vh - 80px));
    }

    :global(:root:has([data-hero])) .nav-wordmark-logo {
      animation: nav-wordmark-scroll linear both;
      animation-timeline: scroll();
      animation-range: calc(var(--hero-exit-distance, calc(100vh - 80px)) - 100px) var(--hero-exit-distance, calc(100vh - 80px));
    }

    :global(:root:has([data-hero])) .nav-symbol-icon,
    :global(:root:has([data-hero])) .nav-wordmark-logo {
      translate: none !important;
      scale: none !important;
      transition: none !important;
    }

    @keyframes nav-pill-scroll {
      0% {
        border-color: rgba(255, 253, 243, 0.35);
        background-color: rgba(98, 115, 131, 0.45);
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }
      100% {
        border-color: #fffdf3;
        background-color: rgba(98, 115, 131, 0.92);
        box-shadow: 0 12px 40px rgba(50, 62, 75, 0.22), 0 0 0 1px rgba(255, 253, 243, 0.4);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
      }
    }

    @keyframes nav-symbol-scroll {
      0%, 25% {
        opacity: 1;
        transform: scale(1) translateX(0);
        pointer-events: auto;
      }
      100% {
        opacity: 0;
        transform: scale(0.75) translateX(-8px);
        pointer-events: none;
      }
    }

    @keyframes nav-wordmark-scroll {
      0%, 25% {
        opacity: 0;
        transform: scale(0.9) translateX(8px);
        pointer-events: none;
      }
      100% {
        opacity: 1;
        transform: scale(1) translateX(0);
        pointer-events: auto;
      }
    }
  }

  :global(:root:not(:has([data-hero]))) .nav-pill-dynamic {
    border-color: #fffdf3;
    background-color: rgba(98, 115, 131, 0.92);
    box-shadow: 0 12px 40px rgba(50, 62, 75, 0.22), 0 0 0 1px rgba(255, 253, 243, 0.4);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
  }

  :global(:root:not(:has([data-hero]))) .nav-symbol-icon {
    display: none !important;
  }

  :global(:root:not(:has([data-hero]))) .nav-wordmark-logo {
    opacity: 1 !important;
    transform: scale(1) translateX(0) !important;
    translate: none !important;
    scale: none !important;
    pointer-events: auto !important;
    transition: none !important;
  }

  /* Fallback for browsers without animation-timeline: scroll() */
  @supports not (animation-timeline: scroll()) {
    .nav-pill-dynamic,
    .nav-symbol-icon,
    .nav-wordmark-logo {
      transition: all 300ms ease-out;
    }
  }
</style>
