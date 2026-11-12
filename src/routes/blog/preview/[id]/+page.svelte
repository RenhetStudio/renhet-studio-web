<script lang="ts">
  import BlogShell from "$lib/components/BlogShell.svelte";
  import IconArrow from "$lib/components/icons/IconArrow.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  const previewDate = $derived(
    data.post.published_at ?? data.post.updated_at ?? data.post.created_at,
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
  <title>Preview: {data.post.title} | Renhet Studio</title>
  <meta name="robots" content="noindex,nofollow" />
</svelte:head>

<BlogShell profile={data.profile}>
  <div class="preview-banner">Private preview · {data.post.status}</div>
  <div
    class="mx-auto max-w-[880px] px-5 sm:px-8 lg:px-10 pt-28 sm:pt-36 md:pt-40 pb-16 sm:pb-24"
  >
    <!-- 1. Editorial Header -->
    <header class="mb-10 sm:mb-14">
      <!-- Back Link -->
      <a
        href={`/blog/dashboard/posts/${data.post.id}`}
        class="inline-flex items-center gap-2 text-sm font-black text-[#4f5f70] transition-colors hover:text-[#344253] mb-6 sm:mb-8"
      >
        <IconArrow direction="left" size={14} />
        <span>Return to editor</span>
      </a>

      <!-- Category Pill & Date -->
      <div class="flex items-center gap-3 mb-4">
        <span
          class="inline-flex items-center rounded-full border border-[#8fb8d8]/60 bg-[#fffdf3] px-3.5 py-0.5 text-xs font-black uppercase tracking-wider text-[#4f5f70]"
        >
          {data.post.category}
        </span>
        <span class="text-xs font-bold uppercase tracking-wider text-[#8a98a5]">
          {formatDate(previewDate)}
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

      <!-- Edit link -->
      <div class="mt-4">
        <a
          href={`/blog/dashboard/posts/${data.post.id}`}
          class="text-xs font-bold text-[#8fb8d8] underline hover:text-[#4f5f70]"
        >
          Edit this story in editor
        </a>
      </div>
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
  </div>
</BlogShell>
