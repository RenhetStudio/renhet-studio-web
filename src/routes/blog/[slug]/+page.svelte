<script lang="ts">
  import SocialMeta from "$lib/components/SocialMeta.svelte";
  import { SITE_URL } from "$lib/blog/config";
  import BlogShell from "$lib/components/BlogShell.svelte";
  import IconArrow from "$lib/components/icons/IconArrow.svelte";
  import OrganicDivider from "$lib/components/OrganicDivider.svelte";
  import type { PageProps } from "./$types";

  let { data, form }: PageProps = $props();

  const publishedDate = $derived(data.post.published_at ?? data.post.created_at);
  const canEdit = $derived(
    data.profile && ["author", "admin"].includes(data.profile.role),
  );

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
  <title>{data.post.title} | Renhet Studio</title>
  <meta name="description" content={data.post.excerpt} />
  <link rel="canonical" href={`${SITE_URL}/blog/${data.post.slug}`} />
  <meta property="article:published_time" content={publishedDate} />
  <meta property="article:modified_time" content={data.post.updated_at} />
</svelte:head>

<SocialMeta
  title={data.post.title}
  description={data.post.excerpt}
  path={`/blog/${data.post.slug}`}
  type="article"
  image={data.post.cover_image_url
    ? {
        src: data.post.cover_image_url,
        alt: data.post.cover_image_alt || data.post.title,
      }
    : undefined}
/>

<BlogShell profile={data.profile}>
  <div
    class="mx-auto max-w-[880px] px-5 sm:px-8 lg:px-10 pt-28 sm:pt-36 md:pt-40 pb-16 sm:pb-24"
  >
    <!-- 1. Editorial Header -->
    <header class="mb-10 sm:mb-14">
      <!-- Back Link with Tactile Arrow -->
      <a
        href="/blog"
        class="inline-flex items-center gap-2 text-sm font-black text-[#4f5f70] transition-colors hover:text-[#344253] mb-6 sm:mb-8"
      >
        <IconArrow direction="left" size={14} />
        <span>All stories</span>
      </a>

      <!-- Category Pill & Publication Date -->
      <div class="flex items-center gap-3 mb-4">
        <span
          class="inline-flex items-center rounded-full border border-[#8fb8d8]/60 bg-[#fffdf3] px-3.5 py-0.5 text-xs font-black uppercase tracking-wider text-[#4f5f70]"
        >
          {data.post.category}
        </span>
        <span class="text-xs font-bold uppercase tracking-wider text-[#8a98a5]">
          {formatDate(publishedDate)}
        </span>
      </div>

      <!-- Dominant Article Title in Paperlogy-9Black -->
      <h1
        class="text-[clamp(2.5rem,6vw,4.8rem)] font-black leading-[0.92] tracking-tight text-[#4f5f70]"
      >
        {data.post.title}
      </h1>

      <!-- Subtitle / Excerpt -->
      {#if data.post.excerpt}
        <p
          class="mt-4 sm:mt-6 text-lg sm:text-xl md:text-[22px] font-bold leading-relaxed text-[#627383]"
        >
          {data.post.excerpt}
        </p>
      {/if}

      <!-- Author desk & optional Edit link -->
      {#if canEdit}
        <div class="mt-4">
          <a
            href={`/blog/dashboard/posts/${data.post.id}`}
            class="text-xs font-bold text-[#8fb8d8] underline hover:text-[#4f5f70]"
          >
            Edit this post in dashboard
          </a>
        </div>
      {/if}
    </header>

    <!-- Optional Cover Image -->
    {#if data.post.cover_image_url}
      <figure class="my-8 sm:my-12">
        <img
          src={data.post.cover_image_url}
          alt={data.post.cover_image_alt || data.post.title}
          class="w-full rounded-[24px] object-cover shadow-sm"
        />
        {#if data.post.cover_image_alt}
          <figcaption class="mt-2.5 text-center text-xs font-bold text-[#8a98a5]">
            {data.post.cover_image_alt}
          </figcaption>
        {/if}
      </figure>
    {/if}

    <!-- 2. Prose Body Content -->
    <div class="rich-content">
      {@html data.contentHtml}
    </div>

    <!-- 3. Discussion Section (Rendered strictly when the switch is enabled) -->
    {#if data.commentsEnabled}
      <div class="my-14 sm:my-18">
        <OrganicDivider orientation="horizontal" seed={`comments-${data.post.slug}`} />
      </div>

      <section id="comments" aria-labelledby="discussion-title">
        <!-- Section Heading -->
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <h2
              id="discussion-title"
              class="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#4f5f70] leading-none"
            >
              Discussion
            </h2>
            <p class="mt-2 text-sm font-bold text-[#627383]">
              {#if data.comments.length > 0}
                {data.comments.length} approved {data.comments.length === 1 ? "comment" : "comments"}
              {:else}
                No comments yet.
              {/if}
            </p>
          </div>
        </div>

        <!-- Form / Login when Discussion is enabled -->
        {#if data.user}
          <form method="POST" action="?/comment" class="mb-10">
            <input type="hidden" name="postId" value={data.post.id} />
            <input type="hidden" name="slug" value={data.post.slug} />
            <div class="form-honeypot" aria-hidden="true">
              <label>Website <input name="website" tabindex="-1" autocomplete="off" /></label>
            </div>

            <label for="comment-body" class="block text-sm font-black text-[#4f5f70] mb-2">
              Your comment
            </label>
            <textarea
              id="comment-body"
              name="body"
              required
              maxlength="2000"
              rows="4"
              placeholder="Write a thoughtful comment..."
              class="w-full rounded-2xl border-2 border-[#4f5f70]/20 bg-[#fffdf3] p-4 text-[15px] font-medium text-[#4f5f70] placeholder:text-[#8a98a5] transition-all hover:border-[#8fb8d8] focus:border-[#8fb8d8] focus:bg-[#fffdf3] focus:outline-none focus:ring-2 focus:ring-[#8fb8d8]/20"
            ></textarea>

            <div class="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p class="text-xs font-bold text-[#8a98a5]">Comments appear after studio moderation.</p>
              <button
                type="submit"
                class="inline-flex h-[46px] items-center justify-center rounded-full bg-[#4f5f70] px-6 text-sm font-black text-[#fffdf3] shadow-[0_4px_16px_rgba(79,95,112,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#344253] active:translate-y-0 cursor-pointer"
              >
                Submit comment
              </button>
            </div>

            {#if form?.message}
              <p
                class="mt-3 text-sm font-bold {form.ok ? 'text-emerald-700' : 'text-rose-700'}"
                role="status"
              >
                {form.message}
              </p>
            {/if}
          </form>
        {:else}
          <div class="mb-10 rounded-2xl border border-[#4f5f70]/15 bg-[#fffdf3]/70 p-5 sm:p-6 text-center">
            <p class="text-sm font-bold text-[#627383]">
              <a
                href={`/login?next=/blog/${data.post.slug}%23comments`}
                class="font-black text-[#4f5f70] underline underline-offset-4 decoration-[#8fb8d8] hover:text-[#344253]"
              >
                Sign in
              </a>
              to join the discussion.
            </p>
          </div>
        {/if}

        <!-- Approved Comments List separated by OrganicDividers -->
        {#if data.comments.length > 0}
          <div class="space-y-6">
            {#each data.comments as comment, i (comment.id)}
              {#if i > 0}
                <OrganicDivider
                  orientation="horizontal"
                  seed={`comment-sep-${comment.id}`}
                  class="my-4"
                />
              {/if}
              <div class="py-2">
                <div class="flex items-center justify-between gap-4 mb-2">
                  <strong class="text-base font-black text-[#4f5f70]">{comment.display_name}</strong>
                  <time datetime={comment.created_at} class="text-xs font-bold text-[#8a98a5]">
                    {formatDate(comment.created_at)}
                  </time>
                </div>
                <p class="text-[15px] leading-relaxed text-[#4f5f70]/90 whitespace-pre-wrap">
                  {comment.body}
                </p>
              </div>
            {/each}
          </div>
        {/if}
      </section>
    {/if}
  </div>
</BlogShell>
