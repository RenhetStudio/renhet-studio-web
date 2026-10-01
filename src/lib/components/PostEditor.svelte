<script lang="ts">
  import type { JSONContent } from "@tiptap/core";
  import { untrack } from "svelte";
  import { BLOG_CATEGORIES } from "$lib/blog/config";
  import type { BlogPost } from "$lib/blog/types";
  import RichEditor from "./RichEditor.svelte";
  let { post = undefined, form = null }: { post?: BlogPost; form?: { ok?: boolean; message?: string; id?: string } | null } = $props();
  const EMPTY_CONTENT: JSONContent = { type: "doc", content: [{ type: "paragraph" }] };
  let title = $state(untrack(() => post?.title ?? "")); let slug = $state(untrack(() => post?.slug ?? "")); let slugTouched = $state(untrack(() => Boolean(post))); let content = $state<JSONContent>(untrack(() => post?.content ?? EMPTY_CONTENT));
  const slugify = (value: string) => value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 180);
  const localDate = (value: string | null) => { if (!value) return ""; const date = new Date(value); return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16); };
</script>
<form method="POST" class="post-editor-form"><input type="hidden" name="content" value={JSON.stringify(content)} />
  <div class="editor-topbar"><div><p>{post ? "Editing story" : "New story"}</p><span>{form?.message || "Changes are saved when you press Save post."}</span></div><div>{#if post}<a href={`/blog/preview/${post.id}`} target="_blank" rel="noreferrer">Preview</a>{/if}<button type="submit">{post ? "Update post" : "Save post"}</button></div></div>
  <div class="editor-fields"><label class="editor-title-field"><span>Title</span><input name="title" bind:value={title} oninput={(event) => { if (!slugTouched) slug = slugify(event.currentTarget.value); }} maxlength="160" placeholder="A clear, useful title" required /></label>
    <div class="editor-settings-grid"><label><span>URL slug</span><input name="slug" bind:value={slug} oninput={() => { slugTouched = true; slug = slugify(slug); }} required /></label><label><span>Category</span><select name="category" value={post?.category ?? "General"}>{#each BLOG_CATEGORIES as category}<option>{category}</option>{/each}</select></label><label><span>Status</span><select name="status" value={post?.status ?? "draft"}><option value="draft">Draft</option><option value="published">Published</option></select></label><label><span>Publish date</span><input name="publishedAt" type="datetime-local" value={localDate(post?.published_at ?? null)} /></label></div>
    <label><span>Short summary</span><textarea name="excerpt" maxlength="320" rows="3" placeholder="Shown on the blog index and in search results.">{post?.excerpt ?? ""}</textarea></label>
    <div class="editor-content-field"><span>Story</span><RichEditor bind:value={content} /></div>
  </div>{#if form?.message}<p class={form.ok ? "editor-status form-success" : "editor-status form-error"} role="status">{form.message}</p>{/if}
</form>
