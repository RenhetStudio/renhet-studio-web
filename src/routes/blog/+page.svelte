<script lang="ts">
  import { goto } from "$app/navigation";
  import { BLOG_CATEGORIES, BLOG_NAME, BLOG_TAGLINE } from "$lib/blog/config";
  import BlogShell from "$lib/components/BlogShell.svelte";
  import IconChevronDown from "$lib/components/icons/IconChevronDown.svelte";
  import IconArrow from "$lib/components/icons/IconArrow.svelte";
  import BlogDecoSplash from "$lib/components/blog/BlogDecoSplash.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  const hasQuery = $derived(Boolean(data.query && data.query.trim().length > 0));

  function applyFilter(updates: { query?: string; category?: string; page?: number; scroll?: boolean }) {
    const newQuery = updates.query !== undefined ? updates.query : (data.query ?? "");
    const newCategory = updates.category !== undefined ? updates.category : (data.category ?? "");
    const newPage = updates.page !== undefined ? updates.page : (data.page ?? 1);

    const parts: string[] = [];
    if (newQuery.trim()) parts.push(`q=${encodeURIComponent(newQuery.trim())}`);
    if (newCategory) parts.push(`category=${encodeURIComponent(newCategory)}`);
    if (newPage > 1) parts.push(`page=${newPage}`);

    const qs = parts.length > 0 ? `?${parts.join("&")}` : "";
    goto(`/blog${qs}`, {
      replaceState: true,
      keepFocus: true,
      noScroll: updates.scroll ? false : true,
    });
  }

  function handleSearchInput(e: Event & { currentTarget: HTMLInputElement }) {
    const val = e.currentTarget.value;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      applyFilter({ query: val, page: 1, scroll: false });
    }, 300);
  }

  function clearSearch() {
    if (debounceTimer) clearTimeout(debounceTimer);
    applyFilter({ query: "", page: 1, scroll: false });
  }

  function handleCategoryChange(e: Event & { currentTarget: HTMLSelectElement }) {
    applyFilter({ category: e.currentTarget.value, page: 1, scroll: false });
  }

  function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  }
</script>

<svelte:head>
  <title>{BLOG_NAME} | Renhet Studio</title>
  <meta name="description" content={BLOG_TAGLINE} />
  <link rel="canonical" href="https://www.renhetstudio.com/blog" />
</svelte:head>

<BlogShell profile={data.profile}>
  <div class="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10 pt-28 sm:pt-36 md:pt-40 pb-20 sm:pb-24">
    <!-- Editorial Header: Standardized with Careers and The Crew in monumental scale, font-black leading-[1.08] and authentic Indie Palette -->
    <header class="mb-10 sm:mb-14 text-left">
      <h1
        id="blog-title"
        class="text-[clamp(3.2rem,7.5vw,7rem)] font-black leading-[1.08] tracking-tight text-[#4f5f70]"
      >
        Renhet Between Builds.
      </h1>
      <p class="mt-4 sm:mt-6 text-lg sm:text-xl md:text-[22px] font-bold leading-relaxed text-[#627383]">
        Small updates from our warm, handmade game studio.
      </p>
    </header>

    <!-- Search & Category Controls with Debounced Instant Input (300ms) & Authentic Renhet Blue Accents -->
    <div
      class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-8 sm:mb-10"
    >
      <!-- Search Input with Real-Time Debounce (300ms) & Instant Clear -->
      <div class="relative w-full sm:w-[420px]">
        <label for="blog-search" class="sr-only">Search stories</label>
        <input
          id="blog-search"
          name="q"
          type="search"
          value={data.query ?? ""}
          oninput={handleSearchInput}
          placeholder="Search stories..."
          maxlength="80"
          class="h-[48px] w-full rounded-full border border-[#4f5f70]/25 bg-[#fffdf3]/80 px-5 text-[15px] font-medium text-[#344253] placeholder:text-[#8a98a5] transition-all duration-200 hover:border-[#8fb8d8] focus:border-[#8fb8d8] focus:bg-[#fffdf3] focus:outline-none focus:ring-2 focus:ring-[#8fb8d8]/25"
        />
        {#if hasQuery}
          <button
            type="button"
            onclick={clearSearch}
            class="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#627383] hover:text-[#344253] transition-colors"
            aria-label="Clear search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        {/if}
      </div>

      <!-- Category Filter Dropdown Pill with Chevron Icon & Pond Blue Accents -->
      <div class="relative w-full sm:w-[180px]">
        <label for="blog-category" class="sr-only">Filter by category</label>
        <select
          id="blog-category"
          name="category"
          value={data.category ?? ""}
          onchange={handleCategoryChange}
          class="h-[48px] w-full appearance-none cursor-pointer rounded-full border border-[#4f5f70]/25 bg-[#fffdf3]/80 pl-5 pr-10 text-[14px] sm:text-[15px] font-bold text-[#4f5f70] transition-all duration-200 hover:border-[#8fb8d8] hover:bg-[#fffdf3] focus:border-[#8fb8d8] focus:outline-none focus:ring-2 focus:ring-[#8fb8d8]/25"
        >
          <option value="">All categories</option>
          {#each BLOG_CATEGORIES as item}
            <option value={item}>{item}</option>
          {/each}
        </select>
        <div class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#4f5f70]">
          <IconChevronDown size={14} strokeWidth={2.4} />
        </div>
      </div>
    </div>

    <!-- Articles Stream: Featured Post, Editorial List, & Editorial Pagination -->
    {#await Promise.all([data.posts, data.globalLatestSlug])}
      <!-- Non-blocking pulse skeleton matching the 3-column editorial grid -->
      <div class="animate-pulse" aria-busy="true" aria-label="Loading stories">
        <div
          class="rounded-[28px] bg-[#f0f5fa] border-2 border-[#8fb8d8]/25 p-6 sm:p-8 lg:p-10 min-h-[160px] flex items-center justify-between shadow-sm"
        >
          <div class="h-4 w-20 rounded bg-[#4f5f70]/15"></div>
          <div class="flex-1 max-w-xl mx-8">
            <div class="h-5 w-28 rounded-full bg-[#8fb8d8]/25 mb-3"></div>
            <div class="h-8 w-4/5 rounded bg-[#4f5f70]/15 mb-2"></div>
            <div class="h-4 w-3/5 rounded bg-[#4f5f70]/10"></div>
          </div>
          <div class="h-6 w-16 rounded-full bg-[#8fb8d8]/20"></div>
        </div>
        <div class="divide-y divide-[#4f5f70]/15 mt-8 border-t border-[#4f5f70]/15">
          {#each [1, 2, 3] as i (i)}
            <div class="py-5 px-3 flex items-center justify-between">
              <div class="h-4 w-16 rounded bg-[#4f5f70]/10"></div>
              <div class="flex-1 max-w-lg mx-8">
                <div class="h-5 w-2/3 rounded bg-[#4f5f70]/15 mb-1.5"></div>
                <div class="h-3 w-1/2 rounded bg-[#4f5f70]/10"></div>
              </div>
              <div class="h-5 w-14 rounded-full bg-[#8fb8d8]/20"></div>
            </div>
          {/each}
        </div>
      </div>
    {:then [postsData, globalLatestSlug]}
      {@const isFiltered = Boolean(data.category || data.query)}
      {@const isPageOne = (data.page ?? 1) === 1}
      {@const isLatestInResults = isPageOne && (!isFiltered || (postsData.items[0] && postsData.items[0].slug === globalLatestSlug))}
      {@const featured = isLatestInResults ? postsData.items[0] : null}
      {@const listPosts = featured ? postsData.items.slice(1) : postsData.items}

      {#if postsData.total === 0}
        <div class="py-16 text-left">
          <h2 class="text-2xl font-black text-[#4f5f70]">No stories here yet.</h2>
          <p class="text-base text-[#627383] mt-2">
            {data.category || data.query
              ? "Try a different filter or search term."
              : "The first Renhet note is being prepared."}
          </p>
          {#if data.category || data.query}
            <button
              type="button"
              onclick={() => applyFilter({ query: "", category: "", page: 1, scroll: false })}
              class="inline-block mt-4 text-sm font-bold text-[#8fb8d8] underline underline-offset-4 hover:text-[#4f5f70] transition-colors"
            >
              Reset filters and view all stories
            </button>
          {/if}
        </div>
      {:else}
        <!-- Featured Post: Delicate Light Blue Wash #f0f5fa with Pond Blue Border #8fb8d8 & Handcrafted Organic Star Splash -->
        {#if featured}
          <article
            class="group relative overflow-hidden rounded-[28px] bg-[#f0f5fa] border-2 border-[#8fb8d8]/30 shadow-[0_4px_24px_rgba(143,184,216,0.12)] p-6 sm:p-8 lg:p-10 transition-all duration-200 hover:border-[#8fb8d8] hover:shadow-[0_8px_32px_rgba(143,184,216,0.2)]"
          >
            <!-- Desktop Layout (3 Columns: Date ~15%, Content ~70%, Category ~15%) -->
            <div
              class="hidden md:grid md:grid-cols-[140px_1fr_auto] lg:grid-cols-[160px_1fr_auto] gap-6 items-center"
            >
              <!-- Column 1: Date -->
              <time
                datetime={featured.published_at ?? featured.created_at}
                class="text-[13px] sm:text-[14px] font-bold uppercase tracking-wider text-[#627383] shrink-0"
              >
                {formatDate(featured.published_at ?? featured.created_at)}
              </time>

              <!-- Column 2: Content (LATEST POST pill, Title & Excerpt) -->
              <div class="relative z-10 flex flex-col items-start pr-6 max-w-[760px]">
                <span
                  class="inline-flex h-[26px] items-center rounded-full bg-[#b8d4f0]/40 border border-[#8fb8d8]/60 px-3.5 text-xs font-black tracking-widest text-[#344253] uppercase mb-3"
                >
                  LATEST POST
                </span>
                <a
                  href={`/blog/${featured.slug}`}
                  class="font-black text-2xl sm:text-3xl lg:text-[34px] leading-[1.08] text-[#344253] tracking-tight group-hover:text-[#4f5f70] group-hover:underline decoration-2 underline-offset-4 decoration-[#8fb8d8] transition-colors"
                >
                  {featured.title}
                </a>
                {#if featured.excerpt}
                  <p class="mt-2.5 text-[15px] sm:text-[16px] text-[#627383] font-normal leading-relaxed">
                    {featured.excerpt}
                  </p>
                {/if}
              </div>

              <!-- Column 3: Category Pill with Pond Blue Theme -->
              <div class="relative z-10 shrink-0">
                <span
                  class="inline-flex items-center rounded-full border border-[#8fb8d8]/60 bg-[#fffdf3] px-4 py-1 text-xs font-bold text-[#4f5f70] transition-colors group-hover:border-[#8fb8d8] group-hover:bg-[#8fb8d8]/15 group-hover:text-[#344253]"
                >
                  {featured.category}
                </span>
              </div>
            </div>

            <!-- Mobile Layout (Compact Single Column Stack) -->
            <div class="flex flex-col md:hidden relative z-10">
              <span
                class="inline-flex self-start h-[24px] items-center rounded-full bg-[#b8d4f0]/40 border border-[#8fb8d8]/60 px-3 text-[11px] font-black tracking-widest text-[#344253] uppercase mb-2"
              >
                LATEST POST
              </span>
              <div class="flex items-center justify-between w-full mb-2">
                <time
                  datetime={featured.published_at ?? featured.created_at}
                  class="text-xs font-bold uppercase tracking-wider text-[#627383]"
                >
                  {formatDate(featured.published_at ?? featured.created_at)}
                </time>
                <span
                  class="inline-flex items-center rounded-full border border-[#8fb8d8]/60 bg-[#fffdf3] px-3 py-0.5 text-[11px] font-bold text-[#4f5f70]"
                >
                  {featured.category}
                </span>
              </div>
              <a
                href={`/blog/${featured.slug}`}
                class="font-black text-2xl leading-tight text-[#344253] tracking-tight group-hover:underline decoration-2 underline-offset-4 decoration-[#8fb8d8]"
              >
                {featured.title}
              </a>
              {#if featured.excerpt}
                <p class="mt-2 text-sm text-[#627383] font-normal leading-relaxed">
                  {featured.excerpt}
                </p>
              {/if}
            </div>

            <!-- Single Decorative Artistic Organic Splash in Desaturated Sky Blue #bbd5e2 -->
            <BlogDecoSplash
              class="absolute -top-6 right-6 sm:-top-8 sm:right-16 lg:right-28 xl:right-36 w-[130px] h-[130px] sm:w-[190px] sm:h-[190px] lg:w-[215px] lg:h-[215px] opacity-75 z-0"
            />
          </article>
        {/if}

        <!-- Editorial List of Other Stories (Separated by subtle dividers) -->
        {#if listPosts.length > 0}
          <div class="divide-y divide-[#4f5f70]/15 mt-8 sm:mt-10 border-t border-[#4f5f70]/15">
            {#each listPosts as post (post.id)}
              <article
                class="group relative transition-colors duration-200 hover:bg-[#fffdf3]/50"
              >
                <!-- Desktop 3-column row -->
                <div
                  class="hidden md:grid md:grid-cols-[140px_1fr_auto] lg:grid-cols-[160px_1fr_auto] gap-6 items-center py-5 sm:py-6 px-3"
                >
                  <!-- Column 1: Date -->
                  <time
                    datetime={post.published_at ?? post.created_at}
                    class="text-[13px] sm:text-[14px] font-bold uppercase tracking-wider text-[#627383] shrink-0"
                  >
                    {formatDate(post.published_at ?? post.created_at)}
                  </time>

                  <!-- Column 2: Title and Excerpt -->
                  <div class="flex flex-col items-start pr-6">
                    <a
                      href={`/blog/${post.slug}`}
                      class="font-black text-lg sm:text-[21px] leading-[1.2] text-[#344253] tracking-tight group-hover:text-[#4f5f70] group-hover:underline decoration-2 underline-offset-4 decoration-[#8fb8d8] transition-colors"
                    >
                      {post.title}
                    </a>
                    {#if post.excerpt}
                      <p class="mt-1 text-[14px] sm:text-[15px] text-[#627383] font-normal leading-relaxed">
                        {post.excerpt}
                      </p>
                    {/if}
                  </div>

                  <!-- Column 3: Category Pill -->
                  <div class="shrink-0">
                    <span
                      class="inline-flex items-center rounded-full border border-[#8fb8d8]/50 bg-[#fffdf3] px-3.5 py-0.5 text-xs font-bold text-[#4f5f70] transition-colors group-hover:border-[#8fb8d8] group-hover:bg-[#8fb8d8]/15 group-hover:text-[#344253]"
                    >
                      {post.category}
                    </span>
                  </div>
                </div>

                <!-- Mobile vertical row -->
                <div class="flex flex-col md:hidden py-4 px-2 gap-1.5">
                  <div class="flex items-center justify-between text-xs text-[#627383]">
                    <time datetime={post.published_at ?? post.created_at} class="font-bold uppercase tracking-wider">
                      {formatDate(post.published_at ?? post.created_at)}
                    </time>
                    <span
                      class="inline-flex items-center rounded-full border border-[#8fb8d8]/50 bg-[#fffdf3] px-2.5 py-0.5 text-[11px] font-bold text-[#4f5f70]"
                    >
                      {post.category}
                    </span>
                  </div>
                  <a
                    href={`/blog/${post.slug}`}
                    class="font-black text-base sm:text-lg text-[#344253] tracking-tight leading-snug group-hover:underline decoration-2 underline-offset-4 decoration-[#8fb8d8]"
                  >
                    {post.title}
                  </a>
                  {#if post.excerpt}
                    <p class="text-xs sm:text-sm text-[#627383] leading-relaxed">
                      {post.excerpt}
                    </p>
                  {/if}
                </div>
              </article>
            {/each}
          </div>
        {/if}

        <!-- Bottom Bar: Live Story Counter & Editorial Pagination Controls -->
        <div
          class="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#4f5f70]/15 pt-6 sm:pt-8"
        >
          <!-- Live Story Count -->
          <p class="text-sm font-bold text-[#627383]">
            {#if postsData.totalPages > 1}
              Showing {(postsData.page - 1) * postsData.perPage + 1}–{Math.min(
                postsData.page * postsData.perPage,
                postsData.total
              )} of {postsData.total} {postsData.total === 1 ? "story" : "stories"}
            {:else}
              {postsData.total} {postsData.total === 1 ? "story" : "stories"}
            {/if}
          </p>

          <!-- Editorial Pagination Controls (Accessible & Responsive) -->
          {#if postsData.totalPages > 1}
            <nav class="flex items-center gap-2" aria-label="Blog pagination">
              <!-- Newer Stories Button -->
              <button
                type="button"
                disabled={postsData.page <= 1}
                onclick={() => applyFilter({ page: postsData.page - 1, scroll: true })}
                class="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#4f5f70]/25 bg-[#fffdf3] px-4 text-xs font-bold text-[#4f5f70] shadow-sm transition-all hover:border-[#8fb8d8] hover:bg-[#8fb8d8]/15 hover:text-[#344253] disabled:opacity-35 disabled:pointer-events-none active:scale-95"
              >
                <IconArrow direction="left" size={13} />
                <span>Newer</span>
              </button>

              <!-- Page Indicator -->
              <span class="px-3 text-xs font-bold text-[#4f5f70]">
                {postsData.page} / {postsData.totalPages}
              </span>

              <!-- Older Stories Button -->
              <button
                type="button"
                disabled={postsData.page >= postsData.totalPages}
                onclick={() => applyFilter({ page: postsData.page + 1, scroll: true })}
                class="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#4f5f70]/25 bg-[#fffdf3] px-4 text-xs font-bold text-[#4f5f70] shadow-sm transition-all hover:border-[#8fb8d8] hover:bg-[#8fb8d8]/15 hover:text-[#344253] disabled:opacity-35 disabled:pointer-events-none active:scale-95"
              >
                <span>Older</span>
                <IconArrow direction="right" size={13} />
              </button>
            </nav>
          {/if}
        </div>
      {/if}
    {:catch}
      <div class="py-16 text-left">
        <h2 class="text-2xl font-black text-[#4f5f70]">No stories here yet.</h2>
        <p class="text-base text-[#627383] mt-2">
          The first Renhet note is being prepared.
        </p>
      </div>
    {/await}
  </div>
</BlogShell>
