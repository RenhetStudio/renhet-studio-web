<script lang="ts">
  import type { JSONContent } from "@tiptap/core";
  import { untrack } from "svelte";
  import { BLOG_CATEGORIES } from "$lib/blog/config";
  import type { BlogPost } from "$lib/blog/types";
  import IconArrow from "$lib/components/icons/IconArrow.svelte";
  import IconChevronDown from "$lib/components/icons/IconChevronDown.svelte";
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

  let title = $state(untrack(() => post?.title ?? ""));
  let slug = $state(untrack(() => post?.slug ?? ""));
  let slugTouched = $state(untrack(() => Boolean(post)));
  let content = $state<JSONContent>(untrack(() => post?.content ?? EMPTY_CONTENT));

  const slugify = (value: string) =>
    value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 180);

  const localDate = (value: string | null) => {
    if (!value) return "";
    const date = new Date(value);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
      .toISOString()
      .slice(0, 16);
  };
</script>

<form method="POST" class="post-editor-form">
  <input type="hidden" name="content" value={JSON.stringify(content)} />

  <!-- Editor Sticky Header: Aesthetic indie topbar -->
  <header
    class="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-b border-[#4f5f70]/15 bg-[#f6f1e8]/95 px-5 py-3.5 backdrop-blur-md sm:px-8 lg:px-10"
  >
    <div class="flex items-center gap-4">
      <a
        href="/blog/dashboard"
        class="inline-flex items-center gap-2 rounded-full border border-[#4f5f70]/20 bg-[#fffdf3] px-3.5 py-1.5 text-xs font-black text-[#4f5f70] transition-all hover:border-[#8fb8d8] hover:bg-[#8fb8d8]/15"
      >
        <IconArrow direction="left" size={12} />
        <span>Dashboard</span>
      </a>
      <div>
        <p class="text-base sm:text-lg font-black text-[#4f5f70] leading-tight">
          {post ? "Editing story" : "New story"}
        </p>
        <span class="block text-xs font-bold text-[#8a98a5]">
          {form?.message || "Changes are saved when you press Save post."}
        </span>
      </div>
    </div>

    <div class="flex items-center gap-2.5">
      {#if post}
        <a
          href={`/blog/preview/${post.id}`}
          target="_blank"
          rel="noreferrer"
          class="inline-flex h-[38px] items-center justify-center rounded-full border border-[#4f5f70]/25 bg-[#fffdf3] px-4 text-xs font-black text-[#4f5f70] transition-all hover:border-[#8fb8d8] hover:bg-[#8fb8d8]/15"
        >
          Preview
        </a>
      {/if}
      <button
        type="submit"
        class="inline-flex h-[38px] items-center justify-center rounded-full bg-[#4f5f70] px-5 text-xs font-black text-[#fffdf3] shadow-[0_4px_16px_rgba(79,95,112,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#344253] active:translate-y-0 cursor-pointer"
      >
        {post ? "Update post" : "Save post"}
      </button>
    </div>
  </header>

  <div class="editor-fields">
    <label class="editor-title-field">
      <span>Title</span>
      <input
        name="title"
        bind:value={title}
        oninput={(event) => {
          if (!slugTouched) slug = slugify(event.currentTarget.value);
        }}
        maxlength="160"
        placeholder="A clear, useful title"
        required
      />
    </label>

    <div class="editor-settings-grid">
      <label>
        <span>URL slug</span>
        <input
          name="slug"
          bind:value={slug}
          oninput={() => {
            slugTouched = true;
            slug = slugify(slug);
          }}
          required
        />
      </label>

      <!-- Category Dropdown with custom chevron arrow like in /careers -->
      <label>
        <span>Category</span>
        <div class="relative w-full">
          <select
            name="category"
            value={post?.category ?? "General"}
            class="h-[52px] w-full appearance-none rounded-xl border border-[#d6d5ca] bg-[#fffdf3] pl-4 pr-10 font-bold text-[#344253] outline-none transition-all duration-180 hover:border-[#8fb8d8] focus:border-[#4f5f70] focus:ring-2 focus:ring-[#8fb8d8]/30 cursor-pointer"
          >
            {#each BLOG_CATEGORIES as category}
              <option>{category}</option>
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
            value={post?.status ?? "draft"}
            class="h-[52px] w-full appearance-none rounded-xl border border-[#d6d5ca] bg-[#fffdf3] pl-4 pr-10 font-bold text-[#344253] outline-none transition-all duration-180 hover:border-[#8fb8d8] focus:border-[#4f5f70] focus:ring-2 focus:ring-[#8fb8d8]/30 cursor-pointer"
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
          value={localDate(post?.published_at ?? null)}
        />
      </label>
    </div>

    <label>
      <span>Short summary</span>
      <textarea
        name="excerpt"
        maxlength="320"
        rows="3"
        placeholder="Shown on the blog index and in search results."
      >{post?.excerpt ?? ""}</textarea>
    </label>

    <div class="editor-content-field">
      <span>Story</span>
      <RichEditor bind:value={content} />
    </div>
  </div>

  {#if form?.message}
    <p
      class={form.ok ? "editor-status form-success" : "editor-status form-error"}
      role="status"
    >
      {form.message}
    </p>
  {/if}
</form>
