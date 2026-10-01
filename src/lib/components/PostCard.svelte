<script lang="ts">
  import type { BlogPost } from "$lib/blog/types";
  let { post, featured = false }: { post: BlogPost; featured?: boolean } = $props();
  const publishedDate = $derived(post.published_at ?? post.created_at);
</script>

<article class:post-card-featured={featured} class="post-card">
  <div class="post-card-copy">
    <div class="post-card-meta">
      <a href={`/blog?category=${encodeURIComponent(post.category)}`}>{post.category}</a>
      <time datetime={publishedDate}>{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(publishedDate))}</time>
    </div>
    <h2><a href={`/blog/${post.slug}`}>{post.title}</a></h2>
    {#if post.excerpt}<p>{post.excerpt}</p>{/if}
    <a class="post-card-read" href={`/blog/${post.slug}`}>Read story <span aria-hidden="true">→</span></a>
  </div>
</article>
