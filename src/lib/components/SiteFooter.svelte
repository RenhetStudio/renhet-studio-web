<script lang="ts">
  import { sound } from "$lib/audio/soundEffects";
  import IconArrow from "$lib/components/icons/IconArrow.svelte";
  import IconExternal from "$lib/components/icons/IconExternal.svelte";

  const socialLinks = [
    { label: "Itch.io", href: "https://renhetstudio.itch.io/", action: "Play" },
    { label: "X", href: "https://x.com/renhetstudio", action: "Follow" },
    { label: "Instagram", href: "https://www.instagram.com/renhet.studio/", action: "Follow" },
    { label: "TikTok", href: "https://www.tiktok.com/@renhetstudio", action: "Watch" },
    { label: "Reddit", href: "https://www.reddit.com/user/RenhetStudio/", action: "Join" },
  ];
</script>

<footer id="contact" class="relative overflow-hidden bg-[#344253] px-5 py-20 text-[#fffdf3] sm:px-8 md:py-28 lg:px-12">
  <div class="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
    <div>
      <a href="/" aria-label="Renhet Studio home" class="inline-block transition-transform duration-200 hover:scale-105">
        <picture class="block w-full max-w-[280px]">
          <source
            type="image/avif"
            srcset="/optimized/renhet-logo-white-360.avif 360w, /optimized/renhet-logo-white-720.avif 720w"
            sizes="(max-width: 400px) 100vw, 280px"
          />
          <source
            type="image/webp"
            srcset="/optimized/renhet-logo-white-360.webp 360w, /optimized/renhet-logo-white-720.webp 720w"
            sizes="(max-width: 400px) 100vw, 280px"
          />
          <img
            src="/renhet-logo-white.png"
            width="280"
            height="141"
            alt="Renhet Studio"
            loading="lazy"
            class="mb-6 w-full max-w-[280px] object-contain"
          />
        </picture>
      </a>

      <h2 class="text-balance text-4xl font-black leading-[0.9] tracking-tight sm:text-5xl md:text-6xl">
        Follow the adventures.
      </h2>

      <p class="mt-4 max-w-md text-base font-semibold text-[#b8d4f0]">
        Small updates, release news, and behind-the-scenes dev logs from our independent game studio.
      </p>

      <div class="mt-8 flex gap-3 text-xs font-bold text-[#b8d4f0]/80">
        <a href="/careers" class="hover:underline">Careers</a>
        <span>&bull;</span>
        <a href="/blog" class="hover:underline">Blog</a>
        <span>&bull;</span>
        <a href="/#game" class="hover:underline">Beelze Pub</a>
      </div>
    </div>

    <!-- Community & Social Pills -->
    <div class="flex flex-col justify-end gap-2.5">
      <a
        href="/careers"
        class="group flex min-h-14 items-center justify-between rounded-full border border-[#fffdf3]/20 bg-[#fffdf3]/10 px-6 text-base font-black text-[#fffdf3] backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#8fb8d8] hover:text-[#344253]"
        onmouseenter={() => sound.playHover(480)}
        onclick={() => sound.playPop(560)}
      >
        <span>Careers</span>
        <span class="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider opacity-80">
          <span>Join us</span>
          <IconArrow direction="right" size={14} class="transition-transform group-hover:translate-x-1" />
        </span>
      </a>

      <a
        href="/blog"
        class="group flex min-h-14 items-center justify-between rounded-full border border-[#fffdf3]/20 bg-[#fffdf3]/10 px-6 text-base font-black text-[#fffdf3] backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#8fb8d8] hover:text-[#344253]"
        onmouseenter={() => sound.playHover(500)}
        onclick={() => sound.playPop(580)}
      >
        <span>Between Builds (Blog)</span>
        <span class="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider opacity-80">
          <span>Read</span>
          <IconArrow direction="right" size={14} class="transition-transform group-hover:translate-x-1" />
        </span>
      </a>

      {#each socialLinks as link}
        <a
          href={link.href}
          target="_blank"
          rel="noreferrer"
          class="group flex min-h-14 items-center justify-between rounded-full border border-[#fffdf3]/20 bg-[#fffdf3]/10 px-6 text-base font-black text-[#fffdf3] backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#b8d4f0] hover:text-[#344253]"
          onmouseenter={() => sound.playHover(520)}
          onclick={() => sound.playPop(620)}
        >
          <span>{link.label}</span>
          <span class="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider opacity-80">
            <span>{link.action}</span>
            <IconExternal size={14} class="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </a>
      {/each}
    </div>
  </div>

  <div class="mx-auto mt-16 max-w-6xl border-t border-[#fffdf3]/15 pt-6 text-xs font-semibold text-[#b8d4f0]/70">
    <p>&copy; {new Date().getFullYear()} Renhet Studio. All rights reserved.</p>
  </div>
</footer>
