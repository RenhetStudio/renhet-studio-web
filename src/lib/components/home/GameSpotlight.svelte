<script lang="ts">
  import IconItch from "$lib/components/icons/IconItch.svelte";
  import IconExternal from "$lib/components/icons/IconExternal.svelte";
</script>

<section id="game" class="px-5 py-14 sm:px-8 sm:py-16 md:py-20 lg:px-10" aria-labelledby="game-title">
  <div class="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[0.55fr_0.45fr] lg:items-center">
    <!-- Left Column: Copy & CTAs -->
    <div>
      <h2
        id="game-title"
        class="max-w-xl text-[clamp(2.6rem,6vw,6rem)] font-black leading-[0.92] tracking-normal text-[#4f5f70]"
      >
        Our first game<br />is out now.
      </h2>

      <p class="mt-6 max-w-xl text-lg font-bold leading-8 text-[#627383] sm:text-xl">
        Mix drinks, serve customers, and keep the business running as Skelly, a laid-back skeletender filling in at Beelze Pub for the weekend.
      </p>

      <div class="mt-8 flex flex-wrap items-center gap-4">
        <!-- Button to dedicated game page -->
        <a
          href="/games/beelze-pub"
          class="group inline-flex items-center gap-2 rounded-full bg-[#4f5f70] px-6 py-3.5 text-base font-black text-[#fffdf3] shadow-[0_4px_16px_rgba(79,95,112,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#344253] hover:shadow-[0_8px_24px_rgba(52,66,83,0.25)] active:translate-y-0"
        >
          <span>About the game</span>
          <span class="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </a>

        <!-- Small Play free on Itch.io button -->
        <a
          href="https://renhetstudio.itch.io/beelze-pub"
          target="_blank"
          rel="noreferrer"
          class="group inline-flex items-center gap-2 rounded-full border-2 border-[#4f5f70]/30 bg-[#fffdf3] px-5 py-3 text-sm font-black text-[#4f5f70] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#4f5f70] hover:bg-[#f6f1e8] active:translate-y-0"
          aria-label="Play Beelze Pub free on Itch.io (opens in new tab)"
        >
          <IconItch size={16} />
          <span>Play free on Itch.io</span>
          <IconExternal size={14} class="opacity-80 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </div>

    <!-- Right Column: Floating Logo -->
    <div class="flex min-h-[360px] items-center justify-center sm:min-h-[420px]">
      <a
        href="/games/beelze-pub"
        class="block transition-transform duration-300 hover:scale-105"
        aria-label="Explore Beelze Pub game page"
      >
        <picture class="block w-full max-w-[420px]">
          <source
            type="image/avif"
            srcset="/optimized/beelze-pub-logo-420.avif 420w, /optimized/beelze-pub-logo-556.avif 556w"
            sizes="(max-width: 460px) 100vw, 420px"
          />
          <source
            type="image/webp"
            srcset="/optimized/beelze-pub-logo-420.webp 420w, /optimized/beelze-pub-logo-556.webp 556w"
            sizes="(max-width: 460px) 100vw, 420px"
          />
          <img
            src="/beelze-pub/logo.png"
            width="420"
            height="422"
            alt="Beelze Pub logo"
            loading="lazy"
            decoding="async"
            class="game-logo-float h-auto w-full max-w-[420px] object-contain drop-shadow-[0_24px_28px_rgba(79,95,112,0.18)]"
          />
        </picture>
      </a>
    </div>
  </div>
</section>
