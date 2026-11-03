<script lang="ts">
  import { onMount } from "svelte";
  import type { UserProfile } from "$lib/blog/types";
  import { sound } from "$lib/audio/soundEffects";
  import IconSound from "$lib/components/icons/IconSound.svelte";

  let { profile = null }: { profile?: UserProfile | null } = $props();

  let isMuted = $state(false);

  onMount(() => {
    sound.init();
    return sound.subscribe((muted) => {
      isMuted = muted;
    });
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
    class="mx-auto flex min-h-16 w-full max-w-5xl items-center justify-between gap-3 rounded-full border-2 border-[#eef0e9]/80 bg-[#344253]/92 px-4 text-[#fffdf3] shadow-[0_12px_40px_rgba(50,62,75,0.18)] backdrop-blur-xl sm:px-6"
  >
    <!-- Logo -->
    <a
      href="/"
      class="flex items-center gap-2.5 transition-transform duration-200 hover:scale-105"
      aria-label="Renhet Studio home"
      onmouseenter={() => sound.playHover(480)}
    >
      <picture>
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
          fetchpriority="high"
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
          onmouseenter={() => sound.playHover(440)}
          onclick={() => sound.playPop(520)}
        >
          {item.label}
        </a>
      {/each}
    </div>

    <!-- Right Controls: Audio Toggle & Auth -->
    <div class="flex items-center gap-2">
      <!-- Mute/Sound Toggle -->
      <button
        type="button"
        class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#fffdf3]/30 bg-[#fffdf3]/10 text-[#fffdf3] transition-all duration-200 hover:bg-[#fffdf3]/25"
        onclick={toggleSound}
        aria-label={isMuted ? "Enable sound effects" : "Mute sound effects"}
        title={isMuted ? "Sound is muted (click to enable)" : "Sound is active (click to mute)"}
      >
        <IconSound muted={isMuted} size={16} />
      </button>

      <!-- Mobile navigation links -->
      <div class="flex items-center gap-1 md:hidden">
        <a
          href="/#game"
          class="rounded-full px-2.5 py-1.5 text-xs font-bold text-[#fffdf3]/90 hover:bg-[#fffdf3]/15"
          onmouseenter={() => sound.playHover(440)}
        >
          Game
        </a>
        <a
          href="/blog"
          class="rounded-full px-2.5 py-1.5 text-xs font-bold text-[#fffdf3]/90 hover:bg-[#fffdf3]/15"
          onmouseenter={() => sound.playHover(440)}
        >
          Blog
        </a>
      </div>

      {#if canAuthor}
        <a
          href="/blog/dashboard"
          class="rounded-full bg-[#fffdf3] px-3 py-1.5 text-xs font-black text-[#344253] transition-transform duration-200 hover:scale-105 hover:bg-[#b8d4f0] sm:px-4 sm:text-sm"
          onmouseenter={() => sound.playHover(520)}
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
