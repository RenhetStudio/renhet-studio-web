<script lang="ts">
  import { SITE_URL } from "$lib/blog/config";
  import BlogShell from "$lib/components/BlogShell.svelte";
  import type { PageProps } from "./$types";
  let { data, form }: PageProps = $props();
  const publishedDate = $derived(data.post.published_at ?? data.post.created_at);
  const canEdit = $derived(data.profile && ["author", "admin"].includes(data.profile.role));
</script>

<svelte:head><title>{data.post.title} | Renhet Studio</title><meta name="description" content={data.post.excerpt} /><link rel="canonical" href={`${SITE_URL}/blog/${data.post.slug}`} /><meta property="og:title" content={data.post.title} /><meta property="og:description" content={data.post.excerpt} /><meta property="og:type" content="article" />{#if data.post.cover_image_url}<meta property="og:image" content={data.post.cover_image_url} />{/if}</svelte:head>

<BlogShell profile={data.profile}>
  <article class="post-page" itemscope itemtype="https://schema.org/BlogPosting"><meta itemprop="headline" content={data.post.title} /><meta itemprop="description" content={data.post.excerpt} /><meta itemprop="datePublished" content={publishedDate} /><meta itemprop="dateModified" content={data.post.updated_at} /><meta itemprop="mainEntityOfPage" content={`${SITE_URL}/blog/${data.post.slug}`} />{#if data.post.cover_image_url}<meta itemprop="image" content={data.post.cover_image_url} />{/if}<span itemprop="publisher" itemscope itemtype="https://schema.org/Organization"><meta itemprop="name" content="Renhet Studio" /><meta itemprop="url" content={SITE_URL} /></span><header class="post-header"><a class="post-back" href="/blog">← All stories</a><p class="post-category">{data.post.category}</p><h1>{data.post.title}</h1>{#if data.post.excerpt}<p class="post-deck">{data.post.excerpt}</p>{/if}<time datetime={publishedDate}>{new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(new Date(publishedDate))}</time>{#if canEdit}<a class="post-edit-link" href={`/blog/dashboard/posts/${data.post.id}`}>Edit this post</a>{/if}</header><div class="rich-content">{@html data.contentHtml}</div></article>
  <section class="comments" id="comments"><div class="comments-inner"><div class="comments-heading"><h2>Discussion</h2><p>{data.comments.length} approved {data.comments.length === 1 ? "comment" : "comments"}</p></div>
    {#if data.user}<form method="POST" action="?/comment" class="comment-form"><input type="hidden" name="postId" value={data.post.id} /><input type="hidden" name="slug" value={data.post.slug} /><div class="form-honeypot" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off" /></label></div><label for="comment-body">Your comment</label><textarea id="comment-body" name="body" required maxlength="2000" rows="5"></textarea><div class="comment-form-row"><p>Comments appear after moderation.</p><button type="submit">Submit comment</button></div>{#if form?.message}<p class={form.ok ? "form-success" : "form-error"} role="status">{form.message}</p>{/if}</form>
    {:else}<p class="comment-login"><a href={`/login?next=/blog/${data.post.slug}%23comments`}>Sign in</a> to join the discussion.</p>{/if}
    <ol class="comment-list">{#each data.comments as comment}<li><div><strong>{comment.display_name}</strong><time datetime={comment.created_at}>{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(comment.created_at))}</time></div><p>{comment.body}</p></li>{/each}</ol>
  </div></section>
</BlogShell>
