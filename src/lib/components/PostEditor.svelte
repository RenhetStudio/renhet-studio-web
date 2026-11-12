<script lang="ts">
  import type { JSONContent } from "@tiptap/core";
  import { untrack } from "svelte";
  import { fade } from "svelte/transition";
  import { enhance } from "$app/forms";
  import { page } from "$app/state";
  import { BLOG_CATEGORIES } from "$lib/blog/config";
  import type { BlogPost } from "$lib/blog/types";
  import IconArrow from "$lib/components/icons/IconArrow.svelte";
  import IconCheck from "$lib/components/icons/IconCheck.svelte";
  import IconChevronDown from "$lib/components/icons/IconChevronDown.svelte";
  import IconClose from "$lib/components/icons/IconClose.svelte";
  import IconMedia from "$lib/components/icons/IconMedia.svelte";
  import IconReload from "$lib/components/icons/IconReload.svelte";
  import RichEditor from "./RichEditor.svelte";

  let {
    post = undefined,
    form = null,
  }: {
    post?: BlogPost;
    form?: { ok?: boolean; message?: string; id?: string } | null;
  } = $props();

  const EMPTY_CONTENT: JSONContent = {
    type: "doc",
    content: [{ type: "paragraph" }],
  };

  const localDate = (value: string | null) => {
    if (!value) return "";
    const date = new Date(value);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
      .toISOString()
      .slice(0, 16);
  };

  let title = $state(untrack(() => post?.title ?? ""));
  let slug = $state(untrack(() => post?.slug ?? ""));
  let slugTouched = $state(untrack(() => Boolean(post)));
  let category = $state(untrack(() => post?.category ?? "General"));
  let status = $state(untrack(() => post?.status ?? "draft"));
  let publishedAt = $state(
    untrack(() => localDate(post?.published_at ?? null)),
  );
  let excerpt = $state(untrack(() => post?.excerpt ?? ""));
  let content = $state<JSONContent>(
    untrack(() => post?.content ?? EMPTY_CONTENT),
  );

  let isSaving = $state(false);
  let isMediaSidebarOpen = $state(false);
  let mediaCount = $state(0);
  let formElement: HTMLFormElement | undefined = $state();

  interface FormSnapshot {
    title: string;
    slug: string;
    category: string;
    status: string;
    publishedAt: string;
    excerpt: string;
    contentJson: string;
  }

  function captureSnapshot(): FormSnapshot {
    return {
      title: title.trim(),
      slug: slug.trim(),
      category: category.trim(),
      status: status.trim(),
      publishedAt: publishedAt.trim(),
      excerpt: excerpt.trim(),
      contentJson: JSON.stringify(content),
    };
  }

  let baseline = $state<FormSnapshot>(untrack(() => captureSnapshot()));

  const hasChanges = $derived.by(() => {
    if (!title.trim()) return false;
    if (!post) {
      const isDefaultContent =
        JSON.stringify(content) === JSON.stringify(EMPTY_CONTENT);
      return (
        title.trim() !== "" ||
        slug.trim() !== "" ||
        excerpt.trim() !== "" ||
        !isDefaultContent
      );
    }
    return (
      title.trim() !== baseline.title ||
      slug.trim() !== baseline.slug ||
      category.trim() !== baseline.category ||
      status.trim() !== baseline.status ||
      publishedAt.trim() !== baseline.publishedAt ||
      excerpt.trim() !== baseline.excerpt ||
      JSON.stringify(content) !== baseline.contentJson
    );
  });

  let toast = $state<{ message: string; ok: boolean } | null>(null);
  let toastTimer: ReturnType<typeof setTimeout> | null = null;
  let lastHandledForm: unknown = null;

  function showToast(message: string, ok: boolean = true) {
    if (toastTimer) clearTimeout(toastTimer);
    toast = { message, ok };
    toastTimer = setTimeout(() => {
      toast = null;
    }, 4000);
  }

  function dismissToast() {
    if (toastTimer) clearTimeout(toastTimer);
    toast = null;
  }

  $effect(() => {
    // Check if redirected from newly created post
    if (
      typeof window !== "undefined" &&
      page.url.searchParams.get("saved") === "1"
    ) {
      showToast("Post saved", true);
      const url = new URL(window.location.href);
      url.searchParams.delete("saved");
      window.history.replaceState(
        {},
        "",
        url.pathname + (url.search ? url.search : ""),
      );
    }
  });

  $effect(() => {
    const currentForm = form;
    if (!currentForm || !currentForm.message) return;
    if (currentForm === lastHandledForm) return;
    lastHandledForm = currentForm;

    const isOk = currentForm.ok ?? true;
    if (isOk) {
      if (post?.published_at && !publishedAt) {
        publishedAt = localDate(post.published_at);
      }
      baseline = captureSnapshot();
    }
    showToast(currentForm.message, isOk);
  });

  const slugify = (value: string) =>
    value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 180);

  const sanitizeSlugInput = (value: string) =>
    value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]+/g, "")
      .replace(/^-+/g, "")
      .replace(/-{2,}/g, "-")
      .slice(0, 180);

  const cleanSlug = () => {
    slug = slug.replace(/^-+|-+$/g, "");
  };

  function handleKeydown(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
      event.preventDefault();
      if (hasChanges && !isSaving && formElement) {
        formElement.requestSubmit();
      }
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<form
  bind:this={formElement}
  method="POST"
  class="post-editor-form w-full"
  use:enhance={({ formData, cancel }) => {
    if (!hasChanges || isSaving) {
      cancel();
      return;
    }
    cleanSlug();
    formData.set("slug", slug);
    formData.set("content", JSON.stringify(content));
    isSaving = true;
    return async ({ update }) => {
      try {
        await update({ reset: false });
      } finally {
        isSaving = false;
      }
    };
  }}
>
  <input type="hidden" name="content" value={JSON.stringify(content)} />

  <!-- Editor Sticky Header: Aesthetic indie topbar (100% of screen) -->
  <header
    class="sticky top-0 z-30 w-full border-b border-[#4f5f70]/15 bg-[#f6f1e8]/95 px-4 py-3 backdrop-blur-md sm:px-8 sm:py-3.5 lg:px-12"
  >
    <div
      class="relative flex w-full items-center justify-between gap-2 sm:gap-4 flex-nowrap"
    >
      <div class="relative z-10 flex items-center shrink-0">
        <a
          href="/blog/dashboard"
          class="inline-flex h-[38px] shrink-0 items-center justify-center gap-2 rounded-full border border-[#4f5f70]/20 bg-[#fffdf3] px-3.5 sm:px-5 text-xs font-black text-[#4f5f70] transition-all hover:border-[#8fb8d8] hover:bg-[#8fb8d8]/15"
        >
          <IconArrow direction="left" size={12} />
          <span>Dashboard</span>
        </a>
      </div>

      <div
        class="pointer-events-none absolute inset-x-0 flex flex-col items-center justify-center text-center sm:pointer-events-auto sm:static sm:inset-auto sm:flex-initial sm:items-start sm:text-left sm:ml-4 sm:mr-auto"
      >
        <p
          class="truncate max-w-[160px] sm:max-w-none text-sm sm:text-lg font-black text-[#4f5f70] leading-tight"
        >
          {post ? "Editing story" : "New story"}
        </p>
        {#if hasChanges}
          <span
            class="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#b47a28]"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-[#b47a28] animate-pulse"
            ></span>
            Unsaved changes
          </span>
        {:else}
          <span class="hidden sm:block text-xs font-bold text-[#8a98a5]">
            {post
              ? "All changes saved"
              : "Changes are saved when you press Save post."}
          </span>
        {/if}
      </div>

      <div
        class="relative z-10 flex items-center gap-2 sm:gap-2.5 shrink-0 justify-end"
      >
        <button
          type="button"
          onclick={() => (isMediaSidebarOpen = !isMediaSidebarOpen)}
          class="inline-flex h-[38px] items-center justify-center gap-1.5 rounded-full border border-[#4f5f70]/25 bg-[#fffdf3] px-3 sm:px-4 text-xs font-black text-[#4f5f70] transition-all hover:border-[#8fb8d8] hover:bg-[#8fb8d8]/15 cursor-pointer"
          title="Story media manager (view, replace, delete, jump to)"
        >
          <IconMedia size={13} strokeWidth={2.4} />
          <span>Media</span>
          {#if mediaCount > 0}
            <span
              class="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#8fb8d8]/40 px-1 text-[10px] font-black text-[#344253]"
            >
              {mediaCount}
            </span>
          {/if}
        </button>

        {#if post}
          <a
            href={`/blog/preview/${post.id}`}
            target="_blank"
            rel="noreferrer"
            class="inline-flex h-[38px] items-center justify-center rounded-full border border-[#4f5f70]/25 bg-[#fffdf3] px-3.5 sm:px-5 text-xs font-black text-[#4f5f70] transition-all hover:border-[#8fb8d8] hover:bg-[#8fb8d8]/15"
          >
            Preview
          </a>
        {/if}
        <button
          type="submit"
          disabled={!hasChanges || isSaving}
          class="inline-flex h-[38px] items-center justify-center gap-2 rounded-full bg-[#4f5f70] px-4 sm:px-5 text-xs font-black text-[#fffdf3] shadow-[0_4px_16px_rgba(79,95,112,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#344253] active:translate-y-0 cursor-pointer disabled:pointer-events-none disabled:opacity-40 disabled:shadow-none"
        >
          {#if isSaving}
            <IconReload size={13} class="animate-spin text-[#fffdf3]" />
            <span>Saving…</span>
          {:else}
            <span>{post ? "Update post" : "Save post"}</span>
          {/if}
        </button>
      </div>
    </div>
  </header>

  <div class="editor-fields mx-auto max-w-[1500px]">
    <label class="editor-title-field block w-full">
      <span class="block text-xs font-black uppercase tracking-widest text-[#8a98a5] mb-2">
        Title
      </span>
      <input
        name="title"
        bind:value={title}
        oninput={(event) => {
          if (!slugTouched) slug = slugify(event.currentTarget.value);
        }}
        maxlength="160"
        placeholder="A clear, useful title…"
        required
        class="w-full !bg-transparent !border-0 !border-b-2 !border-[#c9c7bf] !rounded-none !px-0 !pt-2 !pb-4 text-[clamp(2.5rem,6vw,5.5rem)] font-black tracking-tight leading-[0.95] text-[#344253] placeholder:text-[#c9c7bf] outline-none transition-colors focus:!border-b-[#4f5f70] focus:outline-none focus:ring-0"
      />
    </label>

    <div class="editor-settings-grid">
      <label>
        <span>URL slug</span>
        <input
          name="slug"
          bind:value={slug}
          oninput={(event) => {
            slugTouched = true;
            slug = sanitizeSlugInput(event.currentTarget.value);
          }}
          onblur={cleanSlug}
          required
          class="h-[52px] w-full rounded-xl border-2 border-[#d6d5ca] bg-[#fffdf3] px-4 font-bold text-[#344253] outline-none transition-all duration-180 hover:border-[#8fb8d8] focus:border-[#4f5f70] focus:ring-2 focus:ring-[#8fb8d8]/30"
        />
      </label>

      <!-- Category Dropdown with custom chevron arrow like in /careers -->
      <label>
        <span>Category</span>
        <div class="relative w-full">
          <select
            name="category"
            bind:value={category}
            class="h-[52px] w-full appearance-none rounded-xl border-2 border-[#d6d5ca] bg-[#fffdf3] pl-4 pr-10 font-bold text-[#344253] outline-none transition-all duration-180 hover:border-[#8fb8d8] focus:border-[#4f5f70] focus:ring-2 focus:ring-[#8fb8d8]/30 cursor-pointer"
          >
            {#each BLOG_CATEGORIES as cat}
              <option value={cat}>{cat}</option>
            {/each}
          </select>
          <span
            class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 flex items-center text-[#4f5f70]"
          >
            <IconChevronDown size={16} strokeWidth={2.4} />
          </span>
        </div>
      </label>

      <!-- Status Dropdown with custom chevron arrow like in /careers -->
      <label>
        <span>Status</span>
        <div class="relative w-full">
          <select
            name="status"
            bind:value={status}
            class="h-[52px] w-full appearance-none rounded-xl border-2 border-[#d6d5ca] bg-[#fffdf3] pl-4 pr-10 font-bold text-[#344253] outline-none transition-all duration-180 hover:border-[#8fb8d8] focus:border-[#4f5f70] focus:ring-2 focus:ring-[#8fb8d8]/30 cursor-pointer"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <span
            class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 flex items-center text-[#4f5f70]"
          >
            <IconChevronDown size={16} strokeWidth={2.4} />
          </span>
        </div>
      </label>

      <label>
        <span>Publish date</span>
        <input
          name="publishedAt"
          type="datetime-local"
          bind:value={publishedAt}
          class="h-[52px] w-full rounded-xl border-2 border-[#d6d5ca] bg-[#fffdf3] px-4 font-bold text-[#344253] outline-none transition-all duration-180 hover:border-[#8fb8d8] focus:border-[#4f5f70] focus:ring-2 focus:ring-[#8fb8d8]/30 cursor-pointer"
        />
      </label>
    </div>

    <label>
      <span>Short summary</span>
      <textarea
        name="excerpt"
        bind:value={excerpt}
        maxlength="320"
        rows="3"
        placeholder="Shown on the blog index and in search results."
        class="w-full rounded-xl border-2 border-[#d6d5ca] bg-[#fffdf3] p-4 font-bold text-[#344253] outline-none transition-all duration-180 hover:border-[#8fb8d8] focus:border-[#4f5f70] focus:ring-2 focus:ring-[#8fb8d8]/30 resize-y"
      ></textarea>
    </label>

    <div class="editor-content-field">
      <span>Story</span>
      <RichEditor
        bind:value={content}
        bind:isMediaSidebarOpen
        bind:mediaCount
      />
    </div>
  </div>

  <!-- Floating Toast Notification with smooth fade in & fade out -->
  {#if toast}
    <div
      role="status"
      aria-live="polite"
      transition:fade={{ duration: 240 }}
      class="fixed bottom-7 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border-2 px-5 py-3 shadow-[0_12px_36px_rgba(52,66,83,0.18)] backdrop-blur-md {toast.ok
        ? 'border-[#8fb8d8]/60 bg-[#fffdf3]/95 text-[#344253]'
        : 'border-[#8b4b50]/40 bg-[#fffdf3]/95 text-[#8b4b50]'}"
    >
      <div
        class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full {toast.ok
          ? 'bg-[#8fb8d8]/30 text-[#344253]'
          : 'bg-[#8b4b50]/15 text-[#8b4b50]'}"
      >
        {#if toast.ok}
          <IconCheck size={14} strokeWidth={3} />
        {:else}
          <IconClose size={14} strokeWidth={3} />
        {/if}
      </div>
      <span class="text-sm font-black tracking-tight">{toast.message}</span>
      <button
        type="button"
        onclick={dismissToast}
        class="ml-1 -mr-1 flex h-6 w-6 items-center justify-center rounded-full text-[#4f5f70]/60 transition-colors hover:bg-[#4f5f70]/10 hover:text-[#4f5f70] cursor-pointer"
        aria-label="Dismiss notification"
      >
        <IconClose size={12} strokeWidth={2.5} />
      </button>
    </div>
  {/if}
</form>
