<script lang="ts">
  import IconArrow from "$lib/components/icons/IconArrow.svelte";
  import IconExternal from "$lib/components/icons/IconExternal.svelte";
  import WaveDivider from "$lib/components/home/WaveDivider.svelte";

  const socialLinks = [
    { label: "Itch.io", href: "https://renhetstudio.itch.io/", action: "Play" },
    { label: "X", href: "https://x.com/renhetstudio", action: "Follow" },
    { label: "Instagram", href: "https://www.instagram.com/renhet.studio/", action: "Follow" },
    { label: "TikTok", href: "https://www.tiktok.com/@renhetstudio", action: "Watch" },
    { label: "Reddit", href: "https://www.reddit.com/user/RenhetStudio/", action: "Join" },
  ];
</script>

<footer id="contact" class="relative overflow-hidden bg-[#4f5f70] text-[#fffdf3]">
  <!-- Inverted wave transition: ripples from paper (#f6f1e8) down into footer (#4f5f70) -->
  <div class="pointer-events-none relative z-10 w-full leading-none">
    <WaveDivider fillColor="#f6f1e8" inverted={true} />
  </div>

  <div class="relative mx-auto max-w-6xl px-5 pb-20 pt-10 sm:px-8 md:pb-28 md:pt-14 lg:px-12">
    <div class="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
      <div>
        <!-- Prominent Large Studio Logo in Footer -->
        <a href="/" aria-label="Renhet Studio home" class="inline-block transition-transform duration-200 hover:scale-105">
          <picture class="block w-full max-w-[340px] sm:max-w-[400px]">
            <source
              type="image/avif"
              srcset="/optimized/renhet-logo-white-360.avif 360w, /optimized/renhet-logo-white-720.avif 720w"
              sizes="(max-width: 640px) 340px, 400px"
            />
            <source
              type="image/webp"
              srcset="/optimized/renhet-logo-white-360.webp 360w, /optimized/renhet-logo-white-720.webp 720w"
              sizes="(max-width: 640px) 340px, 400px"
            />
            <img
              src="/renhet-logo-white.png"
              width="400"
              height="202"
              alt="Renhet Studio"
              loading="lazy"
              class="mb-8 w-full max-w-[340px] sm:max-w-[400px] object-contain"
            />
          </picture>
        </a>

        <h2 class="text-balance text-4xl font-black leading-[0.9] tracking-tight sm:text-5xl md:text-6xl">
          Follow the adventures.
        </h2>
      </div>

      <!-- Community & Social Pills -->
      <div class="flex flex-col justify-end gap-2.5">
        <a
          href="/careers"
          class="group flex min-h-14 items-center justify-between rounded-full border-2 border-[#fffdf3]/40 bg-[#fffdf3] px-6 text-base font-black text-[#4f5f70] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#b8d4f0]"
        >
          <span>Careers</span>
          <span class="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider opacity-80">
            <span>Join us</span>
            <IconArrow direction="right" size={14} class="transition-transform group-hover:translate-x-1" />
          </span>
        </a>

        <a
          href="/blog"
          class="group flex min-h-14 items-center justify-between rounded-full border-2 border-[#fffdf3]/40 bg-[#fffdf3] px-6 text-base font-black text-[#4f5f70] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#b8d4f0]"
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
            class="group flex min-h-14 items-center justify-between rounded-full border-2 border-[#fffdf3]/40 bg-[#fffdf3] px-6 text-base font-black text-[#4f5f70] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#b8d4f0]"
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

    <!-- Centered Copyright -->
    <div class="mt-16 border-t border-[#fffdf3]/15 pt-6 text-center text-xs font-semibold text-[#b8d4f0]/70">
      <p>&copy; {new Date().getFullYear()} Renhet Studio. All rights reserved.</p>
    </div>
  </div>
</footer>
