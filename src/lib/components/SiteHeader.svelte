<script lang="ts">
  import { onMount } from "svelte";
  import { scale } from "svelte/transition";
  import type { UserProfile } from "$lib/blog/types";
  import { sound } from "$lib/audio/soundEffects";
  import IconSound from "$lib/components/icons/IconSound.svelte";

  let { profile = null }: { profile?: UserProfile | null } = $props();

  let isMuted = $state(false);
  let isHeroInView = $state(true);

  onMount(() => {
    const unsub = sound.subscribe((muted) => {
      isMuted = muted;
    });

    const checkHeroVisibility = () => {
      const hero = document.getElementById("hero");
      if (hero) {
        const rect = hero.getBoundingClientRect();
        isHeroInView = rect.bottom > 160;
      } else {
        isHeroInView = window.scrollY < 400;
      }
    };

    checkHeroVisibility();
    window.addEventListener("scroll", checkHeroVisibility, { passive: true });
    window.addEventListener("resize", checkHeroVisibility, { passive: true });

    return () => {
      unsub();
      window.removeEventListener("scroll", checkHeroVisibility);
      window.removeEventListener("resize", checkHeroVisibility);
    };
  });

  const navigation = [
    { label: "Beelze Pub", href: "/#game" },
    { label: "The Crew", href: "/#crew" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
  ];

  const canAuthor = $derived(profile ? ["author", "admin"].includes(profile.role) : false);

  const toggleSound = () => {
    sound.toggleMute();
  };
</script>

<nav class="nav-shell fixed inset-x-0 top-4 z-50 px-4" aria-label="Primary navigation">
  <div
    class="mx-auto flex min-h-16 w-full max-w-5xl items-center justify-between gap-3 rounded-full transition-all duration-300 ease-out {isHeroInView
      ? 'border border-[#fffdf3]/20 bg-[#627383]/45 px-3 shadow-none backdrop-blur-md sm:px-5'
      : 'border-2 border-[#eef0e9]/80 bg-[#627383]/92 px-4 shadow-[0_12px_40px_rgba(50,62,75,0.18)] backdrop-blur-xl sm:px-6'} text-[#fffdf3]"
  >
    <!-- Logo with smooth morph between compact symbol and full wordmark -->
    <a
      href="/"
      class="relative flex h-9 items-center gap-2 overflow-hidden transition-transform duration-200 hover:scale-105"
      aria-label="Renhet Studio home"
    >
      <!-- Small icon version: shown when hero is in view -->
      <picture
        class="transition-all duration-300 ease-out {isHeroInView
          ? 'opacity-100 scale-100'
          : 'pointer-events-none absolute opacity-0 scale-75 -translate-x-3'}"
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
        class="transition-all duration-300 ease-out {!isHeroInView
          ? 'opacity-100 scale-100'
          : 'pointer-events-none absolute opacity-0 scale-90 translate-x-3'}"
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

    <!-- Desktop Navigation Links -->
    <div class="hidden items-center gap-1 md:flex">
      {#each navigation as item}
        <a
          class="rounded-full px-3.5 py-2 text-sm font-bold text-[#fffdf3]/90 transition-all duration-200 hover:bg-[#fffdf3]/15 hover:text-[#fffdf3]"
          href={item.href}
        >
          {item.label}
        </a>
      {/each}
    </div>

    <!-- Right Controls: Audio Toggle & Auth -->
    <div class="flex items-center gap-2">
      <!-- Mute/Sound Toggle with animated scale -->
      <button
        type="button"
        class="sound-toggle inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#fffdf3]/30 bg-[#fffdf3]/10 text-[#fffdf3] transition-all duration-200 hover:bg-[#fffdf3]/25"
        onclick={toggleSound}
        aria-label={isMuted ? "Enable sound effects" : "Mute sound effects"}
        title={isMuted ? "Sound is muted (click to enable)" : "Sound is active (click to mute)"}
      >
        {#key isMuted}
          <span
            in:scale={{ duration: 220, start: 0.5 }}
            out:scale={{ duration: 150, start: 0.5 }}
            class="inline-flex"
          >
            <IconSound muted={isMuted} size={16} />
          </span>
        {/key}
      </button>

      <!-- Mobile navigation links -->
      <div class="flex items-center gap-1 md:hidden">
        <a
          href="/#game"
          class="rounded-full px-2.5 py-1.5 text-xs font-bold text-[#fffdf3]/90 hover:bg-[#fffdf3]/15"
        >
          Game
        </a>
        <a
          href="/blog"
          class="rounded-full px-2.5 py-1.5 text-xs font-bold text-[#fffdf3]/90 hover:bg-[#fffdf3]/15"
        >
          Blog
        </a>
      </div>

      {#if canAuthor}
        <a
          href="/blog/dashboard"
          class="rounded-full bg-[#fffdf3] px-3 py-1.5 text-xs font-black text-[#344253] transition-transform duration-200 hover:scale-105 hover:bg-[#b8d4f0] sm:px-4 sm:text-sm"
        >
          Dashboard
        </a>
      {/if}

      {#if profile}
        <a
          href="/account"
          title={profile.display_name}
          class="max-w-24 truncate rounded-full px-2 py-1.5 text-xs font-bold text-[#fffdf3] hover:bg-[#fffdf3]/15 sm:max-w-36"
        >
          {profile.display_name}
        </a>
        <form method="POST" action="/auth/signout" class="flex">
          <button
            type="submit"
            class="rounded-full px-2.5 py-1.5 text-xs font-bold text-[#fffdf3]/80 hover:text-[#fffdf3]"
          >
            Sign out
          </button>
        </form>
      {/if}
    </div>
  </div>
</nav>
