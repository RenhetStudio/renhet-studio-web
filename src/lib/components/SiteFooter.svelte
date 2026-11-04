<script lang="ts">
  import WaveDivider from "$lib/components/home/WaveDivider.svelte";
  import IconArrowUpRight from "$lib/components/icons/IconArrowUpRight.svelte";
  import IconArrowUp from "$lib/components/icons/IconArrowUp.svelte";
  import IconX from "$lib/components/icons/IconX.svelte";
  import IconInstagram from "$lib/components/icons/IconInstagram.svelte";
  import IconReddit from "$lib/components/icons/IconReddit.svelte";
  import IconTikTok from "$lib/components/icons/IconTikTok.svelte";
  import IconItch from "$lib/components/icons/IconItch.svelte";
  import FooterDecoSplash from "$lib/components/footer/FooterDecoSplash.svelte";
  import { scrollDockState } from "./scrollDock.svelte";

  const socialLinks = [
    {
      label: "X",
      href: "https://x.com/renhetstudio",
      icon: IconX,
      size: 16,
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/renhet.studio/",
      icon: IconInstagram,
      size: 18,
    },
    {
      label: "Reddit",
      href: "https://www.reddit.com/user/RenhetStudio/",
      icon: IconReddit,
      size: 18,
    },
    {
      label: "TikTok",
      href: "https://www.tiktok.com/@renhetstudio",
      icon: IconTikTok,
      size: 18,
    },
    {
      label: "Itch.io",
      href: "https://renhetstudio.itch.io/",
      icon: IconItch,
      size: 18,
    },
  ];

  let footerRef: HTMLElement | null = $state(null);
  let isEntered = $state(false);

  $effect(() => {
    if (!footerRef) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          isEntered = true;
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(footerRef);
    return () => observer.disconnect();
  });

  const scrollToTop = () => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };
</script>

<footer
  id="contact"
  bind:this={footerRef}
  class="relative overflow-hidden bg-[#4f5f70] text-[#fffdf3]"
>
  <!-- Animated inverted wave transition with pronounced ripples from paper (#f6f1e8) down into footer (#4f5f70) -->
  <div class="pointer-events-none relative z-10 w-full leading-none">
    <WaveDivider fillColor="#f6f1e8" inverted={true} pronounced={true} />
  </div>

  <!-- Decorative sun/splash element emerging from bottom edge behind content (100% organic curves) -->
  <FooterDecoSplash
    class="absolute -bottom-6 left-[50%] z-0 w-[240px] -translate-x-1/2 opacity-35 sm:left-[50%] sm:w-[280px] sm:opacity-40 lg:left-[45%] lg:w-[320px] xl:left-[46%] xl:w-[360px] lg:opacity-55"
  />

  <div
    class="footer-content relative z-10 mx-auto max-w-[1440px] px-6 pt-6 pb-12 transition-all duration-400 ease-out sm:px-8 sm:pt-8 sm:pb-14 lg:px-12 lg:pt-10 lg:pb-14 {isEntered
      ? 'translate-y-0 opacity-100'
      : 'translate-y-2 opacity-0'}"
  >
    <!-- Desktop: 3 zones on single midline. Tablet/Mobile: balanced flow -->
    <div
      class="flex flex-col gap-8 sm:gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-8"
    >
      <!-- Zone 1: Logo + Vertical Divider -->
      <div class="flex items-center">
        <a
          href="/"
          aria-label="Renhet Studio home"
          class="inline-flex shrink-0 items-center rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#fffdf3]"
        >
          <picture class="block">
            <source
              type="image/avif"
              srcset="/optimized/renhet-logo-white-88.avif 88w, /optimized/renhet-logo-white-176.avif 176w, /optimized/renhet-logo-white-360.avif 360w"
              sizes="(max-width: 640px) 110px, (max-width: 1024px) 130px, 145px"
            />
            <source
              type="image/webp"
              srcset="/optimized/renhet-logo-white-88.webp 88w, /optimized/renhet-logo-white-176.webp 176w, /optimized/renhet-logo-white-360.webp 360w"
              sizes="(max-width: 640px) 110px, (max-width: 1024px) 130px, 145px"
            />
            <img
              src="/renhet-logo-white.png"
              width="145"
              height="73"
              alt="Renhet Studio"
              loading="lazy"
              class="h-auto w-[110px] object-contain transition-opacity duration-200 hover:opacity-90 sm:w-[130px] lg:w-[145px]"
            />
          </picture>
        </a>

        <!-- Vertical divider line (like in reference image) -->
        <div
          class="mx-6 hidden h-12 w-px shrink-0 bg-[#fffdf3]/25 sm:block sm:mx-8 lg:mx-8 xl:mx-10 lg:h-14"
          aria-hidden="true"
        ></div>
      </div>

      <!-- Zone 2: Monumental Title (2 lines on desktop) -->
      <div class="shrink-0 lg:mr-auto">
        <h2
          class="font-black text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] leading-[0.98] tracking-tight text-[#fffdf3]"
        >
          Follow the<br />adventures.
        </h2>
      </div>

      <!-- Zone 3: Links (Two rows: pills on top, circular icons below) -->
      <div class="relative z-10 flex flex-col gap-2.5 sm:gap-3 lg:shrink-0">
        <!-- Row 1: Careers and Blog pills -->
        <div class="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <a
            href="/careers"
            class="group inline-flex h-9 sm:h-10 items-center justify-center gap-2 rounded-full border border-[#fffdf3]/40 bg-[#344253]/90 px-5 sm:px-6 text-sm sm:text-base font-semibold text-[#fffdf3] shadow-sm backdrop-blur-md transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[#fffdf3] hover:bg-[#fffdf3] hover:text-[#344253] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fffdf3] active:translate-y-0"
          >
            <span>Careers</span>
            <span
              class="inline-block transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.75 group-hover:-translate-y-0.75"
            >
              <IconArrowUpRight size={13} strokeWidth={2.2} />
            </span>
          </a>

          <a
            href="/blog"
            class="group inline-flex h-9 sm:h-10 items-center justify-center gap-2 rounded-full border border-[#fffdf3]/40 bg-[#344253]/90 px-5 sm:px-6 text-sm sm:text-base font-semibold text-[#fffdf3] shadow-sm backdrop-blur-md transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[#fffdf3] hover:bg-[#fffdf3] hover:text-[#344253] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fffdf3] active:translate-y-0"
          >
            <span>Blog</span>
            <span
              class="inline-block transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.75 group-hover:-translate-y-0.75"
            >
              <IconArrowUpRight size={13} strokeWidth={2.2} />
            </span>
          </a>
        </div>

        <!-- Row 2: Five circular social icons + Docked Scroll to top button -->
        <div class="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {#each socialLinks as link}
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Renhet Studio on {link.label}"
              title={link.label}
              class="flex h-10 w-10 sm:h-11 sm:w-11 cursor-pointer items-center justify-center rounded-full border border-[#fffdf3]/40 bg-[#344253]/90 text-[#fffdf3] shadow-sm backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-[#fffdf3] hover:bg-[#fffdf3] hover:text-[#344253] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fffdf3] active:translate-y-0"
            >
              <link.icon size={link.size} />
            </a>
          {/each}

          <!-- Subtle divider separating external social links from utility scroll action -->
          <div
            class="mx-0.5 h-5 w-px shrink-0 bg-[#fffdf3]/35 transition-opacity duration-300 sm:mx-1 {scrollDockState.isDocked
              ? 'opacity-100'
              : 'opacity-0'}"
            aria-hidden="true"
          ></div>

          <!-- Docked Scroll to top button (FLIP animated target) -->
          <button
            id="footer-scroll-to-top"
            type="button"
            onclick={scrollToTop}
            aria-label="Scroll back to top"
            title="Scroll to top"
            tabindex={scrollDockState.isDocked ? 0 : -1}
            class="group relative z-30 flex h-10 w-10 sm:h-11 sm:w-11 cursor-pointer items-center justify-center rounded-full border border-[#fffdf3]/40 bg-[#344253]/90 text-[#fffdf3] shadow-sm backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-[#fffdf3] hover:bg-[#fffdf3] hover:text-[#344253] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fffdf3] active:translate-y-0 will-change-transform {scrollDockState.isDocked
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'}"
          >
            <IconArrowUp
              size={16}
              class="transition-transform duration-200 group-hover:-translate-y-0.5"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</footer>

<style>
  @media (prefers-reduced-motion: reduce) {
    .footer-content {
      opacity: 1 !important;
      transform: none !important;
      transition: none !important;
    }
  }
</style>
