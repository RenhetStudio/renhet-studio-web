<script lang="ts">
  const socialLinks = [
    { label: "X", href: "https://x.com/renhetstudio" },
    { label: "Instagram", href: "https://www.instagram.com/renhet.studio/" },
    { label: "Reddit", href: "https://www.reddit.com/user/RenhetStudio/" },
    { label: "TikTok", href: "https://www.tiktok.com/@renhetstudio" },
    { label: "Itch.io", href: "https://renhetstudio.itch.io/" },
  ];
  const linkClass = "group flex min-h-16 items-center justify-between rounded-full border-2 border-[#fffdf3]/40 bg-[#fffdf3] px-6 text-lg font-black text-[#4f5f70] transition duration-300 hover:-translate-y-1 hover:bg-[#b8d4f0]";
</script>

<footer id="contact" class="relative overflow-hidden bg-[#4f5f70] px-5 py-24 text-[#fffdf3] sm:px-8 md:py-32 lg:px-10">
  <div class="relative mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[0.68fr_0.32fr]">
    <div>
      <a href="/" aria-label="Renhet Studio home"><picture class="block w-full max-w-[360px]">
        <source type="image/avif" srcset="/optimized/renhet-logo-white-360.avif 360w, /optimized/renhet-logo-white-720.avif 720w" sizes="(max-width: 400px) 100vw, 360px" />
        <source type="image/webp" srcset="/optimized/renhet-logo-white-360.webp 360w, /optimized/renhet-logo-white-720.webp 720w" sizes="(max-width: 400px) 100vw, 360px" />
        <img src="/renhet-logo-white.png" width="360" height="181" alt="Renhet Studio" loading="lazy" class="mb-8 w-full max-w-[360px] object-contain" />
      </picture></a>
      <h2 class="max-w-4xl text-[clamp(3rem,7vw,7rem)] font-black leading-[0.88] tracking-normal">Follow the adventures.</h2>
    </div>
    <div class="flex flex-col justify-end gap-3">
      <a href="/careers" class={linkClass}>Careers <span class="transition duration-300 group-hover:translate-x-1">Join us</span></a>
      <a href="/blog" class={linkClass}>Blog <span class="transition duration-300 group-hover:translate-x-1">Read</span></a>
      {#each socialLinks as link}
        <a href={link.href} target="_blank" rel="noreferrer" class={linkClass}>{link.label}<span class="transition duration-300 group-hover:translate-x-1">Visit</span></a>
      {/each}
    </div>
  </div>
</footer>
