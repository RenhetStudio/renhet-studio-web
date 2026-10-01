<script lang="ts">
  import type { UserProfile } from "$lib/blog/types";
  let { profile = null }: { profile?: UserProfile | null } = $props();
  const navigation = [
    { label: "Renhet Between Builds", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Follow us", href: "/#contact" },
  ];
  const canAuthor = $derived(profile ? ["author", "admin"].includes(profile.role) : false);
</script>

<nav class="nav-shell fixed inset-x-0 top-4 z-50 px-4" aria-label="Primary navigation">
  <div class="mx-auto flex min-h-16 w-full max-w-[1180px] items-center justify-between gap-3 rounded-full border-2 border-[#eef0e9] bg-[#627383]/92 px-4 text-[#fffdf3] shadow-[0_18px_60px_rgba(50,62,75,0.16)] backdrop-blur-xl sm:px-5">
    <a href="/" class="flex items-center gap-3" aria-label="Renhet Studio home">
      <picture>
        <source type="image/avif" srcset="/optimized/renhet-logo-white-88.avif 88w, /optimized/renhet-logo-white-176.avif 176w" sizes="(min-width: 640px) 88px, 72px" />
        <source type="image/webp" srcset="/optimized/renhet-logo-white-88.webp 88w, /optimized/renhet-logo-white-176.webp 176w" sizes="(min-width: 640px) 88px, 72px" />
        <img src="/renhet-logo-white.png" width="176" height="89" alt="" fetchpriority="high" class="h-9 w-auto object-contain sm:h-11" />
      </picture>
    </a>
    <div class="hidden items-center gap-1 md:flex">
      {#each navigation as item}
        <a class="nav-link" href={item.href}>{item.label}</a>
      {/each}
    </div>
    <div class="flex items-center gap-1 sm:gap-2">
      <a href="/blog" class="rounded-full px-2 py-3 text-xs font-black text-[#fffdf3] transition duration-300 hover:-translate-y-0.5 hover:bg-[#fffdf3]/15 sm:px-3 sm:text-sm md:hidden">Blog</a>
      <a href="/careers" class="rounded-full px-2 py-3 text-xs font-black text-[#fffdf3] transition duration-300 hover:-translate-y-0.5 hover:bg-[#fffdf3]/15 sm:px-3 sm:text-sm md:hidden">Careers</a>
      {#if canAuthor}
        <a href="/blog/dashboard" class="rounded-full bg-[#fffdf3] px-3 py-3 text-xs font-black text-[#4f5f70] transition duration-300 hover:-translate-y-0.5 hover:bg-[#b8d4f0] sm:px-5 sm:text-sm">Dashboard</a>
      {/if}
      {#if profile}
        <a href="/account" title={profile.display_name} class="max-w-24 truncate rounded-full px-2 py-3 text-xs font-black text-[#fffdf3] transition duration-300 hover:-translate-y-0.5 hover:bg-[#fffdf3]/15 sm:max-w-40 sm:px-3 sm:text-sm">{profile.display_name}</a>
        <form method="POST" action="/auth/signout" class="flex">
          <button type="submit" class="rounded-full px-2 py-3 text-xs font-black text-[#fffdf3] transition duration-300 hover:-translate-y-0.5 hover:bg-[#fffdf3]/15 sm:px-3 sm:text-sm">Sign out</button>
        </form>
      {/if}
    </div>
  </div>
</nav>
