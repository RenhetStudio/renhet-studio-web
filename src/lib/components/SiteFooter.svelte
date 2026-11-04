<script lang="ts">
  import WaveDivider from "$lib/components/home/WaveDivider.svelte";

  const socialLinks = [
    { label: "X", href: "https://x.com/renhetstudio" },
    { label: "Instagram", href: "https://www.instagram.com/renhet.studio/" },
    { label: "Reddit", href: "https://www.reddit.com/user/RenhetStudio/" },
    { label: "TikTok", href: "https://www.tiktok.com/@renhetstudio" },
    { label: "Itch.io", href: "https://renhetstudio.itch.io/" },
  ];
</script>

<footer id="contact" class="relative overflow-hidden bg-[#4f5f70] text-[#fffdf3]">
  <!-- Inverted wave transition: ripples from paper (#f6f1e8) down into footer (#4f5f70) -->
  <div class="pointer-events-none relative z-10 w-full leading-none">
    <WaveDivider fillColor="#f6f1e8" inverted={true} />
  </div>

  <div class="relative mx-auto max-w-[1440px] px-5 pt-8 pb-20 sm:px-8 sm:pt-10 sm:pb-12 md:pt-12 md:pb-14 lg:px-10 xl:px-12">
    <div class="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-24 xl:gap-36 2xl:gap-48">
      <!-- Left Column: Logo + Monumental Title -->
      <div>
        <a
          href="/"
          aria-label="Renhet Studio home"
          class="inline-block transition-transform duration-200 hover:scale-105"
        >
          <picture class="block w-full max-w-[340px] sm:max-w-[400px] md:max-w-[440px] xl:max-w-[480px]">
            <source
              type="image/avif"
              srcset="/optimized/renhet-logo-white-360.avif 360w, /optimized/renhet-logo-white-720.avif 720w"
              sizes="(max-width: 640px) 340px, (max-width: 1024px) 440px, 480px"
            />
            <source
              type="image/webp"
              srcset="/optimized/renhet-logo-white-360.webp 360w, /optimized/renhet-logo-white-720.webp 720w"
              sizes="(max-width: 640px) 340px, (max-width: 1024px) 440px, 480px"
            />
            <img
              src="/renhet-logo-white.png"
              width="480"
              height="243"
              alt="Renhet Studio"
              loading="lazy"
              class="mb-6 sm:mb-8 w-full max-w-[340px] sm:max-w-[400px] md:max-w-[440px] xl:max-w-[480px] object-contain"
            />
          </picture>
        </a>

        <h2 class="text-balance text-[clamp(3.2rem,6vw,5.5rem)] font-black leading-[0.88] tracking-tight text-[#fffdf3]">
          Follow the<br />adventures.
        </h2>
      </div>

      <!-- Right Column: Community & Social Pills (Longer pill width) -->
      <div class="flex flex-col gap-2.5 w-full lg:w-[400px] xl:w-[440px] lg:ml-auto">
        <a
          href="/careers"
          class="group flex min-h-13 sm:min-h-14 items-center justify-between rounded-full bg-[#fffdf3] px-6 sm:px-7 text-base font-black text-[#4f5f70] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#b8d4f0]"
        >
          <span>Careers</span>
          <span class="text-xs font-bold text-[#4f5f70]/90 transition-transform duration-200 group-hover:translate-x-0.5">
            Join us
          </span>
        </a>

        <a
          href="/blog"
          class="group flex min-h-13 sm:min-h-14 items-center justify-between rounded-full bg-[#fffdf3] px-6 sm:px-7 text-base font-black text-[#4f5f70] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#b8d4f0]"
        >
          <span>Blog</span>
          <span class="text-xs font-bold text-[#4f5f70]/90 transition-transform duration-200 group-hover:translate-x-0.5">
            Read
          </span>
        </a>

        {#each socialLinks as link}
          <a
            href={link.href}
            target="_blank"
            rel="noreferrer"
            class="group flex min-h-13 sm:min-h-14 items-center justify-between rounded-full bg-[#fffdf3] px-6 sm:px-7 text-base font-black text-[#4f5f70] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#b8d4f0]"
          >
            <span>{link.label}</span>
            <span class="text-xs font-bold text-[#4f5f70]/90 transition-transform duration-200 group-hover:translate-x-0.5">
              Visit
            </span>
          </a>
        {/each}
      </div>
    </div>
  </div>
</footer>
