<script lang="ts">
  import { BLOG_CATEGORIES, BLOG_NAME, BLOG_TAGLINE } from "$lib/blog/config";
  import BlogShell from "$lib/components/BlogShell.svelte";
  import PostCard from "$lib/components/PostCard.svelte";
  import type { PageProps } from "./$types";
  let { data }: PageProps = $props();
  const featured = $derived(data.posts[0]);
  const rest = $derived(data.posts.slice(1));
</script>

<svelte:head><title>{BLOG_NAME} | Renhet Studio</title><meta name="description" content={BLOG_TAGLINE} /><link rel="canonical" href="https://www.renhetstudio.com/blog" /></svelte:head>

<BlogShell profile={data.profile}>
  <header class="blog-hero"><div class="blog-hero-copy"><h1 class="blog-hero-enter">{BLOG_NAME}</h1><p class="blog-hero-tagline blog-hero-enter">{BLOG_TAGLINE}</p><a class="blog-hero-cta blog-hero-enter" href="#stories">Read the latest</a></div></header>
  <section id="stories" class="blog-stories">
    <div class="stories-heading"><h2 class="blog-scrub-copy">What we are making lately.</h2><form class="blog-filter" action="/blog"><label><span class="sr-only">Search stories</span><input name="q" value={data.query ?? ""} placeholder="Search stories" maxlength="80" /></label><label><span class="sr-only">Filter by category</span><select name="category" value={data.category ?? ""}><option value="">All categories</option>{#each BLOG_CATEGORIES as item}<option>{item}</option>{/each}</select></label><button type="submit">Filter</button></form></div>
    {#if !featured}
      <div class="blog-empty"><h2>No stories here yet.</h2><p>{data.category || data.query ? "Try a different filter." : "The first Renhet note is being prepared."}</p>{#if data.category || data.query}<a href="/blog">View all stories</a>{/if}</div>
    {:else}
      <div class="featured-grid"><PostCard post={featured} featured />{#each rest.slice(0, 2) as post}<PostCard {post} />{/each}</div>
      {#if rest.length > 2}<div class="post-accordion">{#each rest.slice(2) as post}<PostCard {post} />{/each}</div>{/if}
    {/if}
  </section>
</BlogShell>
