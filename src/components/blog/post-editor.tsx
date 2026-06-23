"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { JSONContent } from "@tiptap/react";
import { BLOG_CATEGORIES } from "@/lib/blog/config";
import type { BlogPost } from "@/lib/blog/types";
import { savePostAction, type ActionState } from "@/lib/blog/actions";
import { RichEditor } from "./rich-editor";
import { createClient } from "@/lib/supabase/client";

const EMPTY_CONTENT: JSONContent = { type: "doc", content: [{ type: "paragraph" }] };
const initialState: ActionState = { ok: false, message: "" };

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 180);
}

function localDate(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const shifted = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return shifted.toISOString().slice(0, 16);
}

async function uploadCover(file: File) {
  const response = await fetch("/api/media", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name, contentType: file.type, size: file.size }),
  });
  const signed = (await response.json()) as { path?: string; token?: string; publicUrl?: string; error?: string };
  if (!response.ok || !signed.path || !signed.token || !signed.publicUrl) throw new Error(signed.error ?? "Upload failed");
  const { error } = await createClient().storage.from("blog-media").uploadToSignedUrl(signed.path, signed.token, file, { contentType: file.type });
  if (error) throw error;
  return signed.publicUrl;
}

export function PostEditor({ post }: { post?: BlogPost }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(savePostAction, initialState);
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [content, setContent] = useState<JSONContent>(post?.content ?? EMPTY_CONTENT);
  const [cover, setCover] = useState(post?.cover_image_url ?? "");
  const [coverBusy, setCoverBusy] = useState(false);
  const [coverError, setCoverError] = useState("");

  useEffect(() => {
    if (state.ok && state.id && !post) router.replace(`/blog/dashboard/posts/${state.id}`);
  }, [state, post, router]);

  return (
    <form action={action} className="post-editor-form">
      {post && <input type="hidden" name="id" value={post.id} />}
      <input type="hidden" name="content" value={JSON.stringify(content)} />
      <input type="hidden" name="coverImageUrl" value={cover} />

      <div className="editor-topbar">
        <div>
          <p>{post ? "Editing story" : "New story"}</p>
          <span>{state.message || "Changes are saved when you press Save post."}</span>
        </div>
        <div>
          {post && <a href={`/blog/preview/${post.id}`} target="_blank" rel="noreferrer">Preview</a>}
          <button type="submit" disabled={pending || coverBusy}>{pending ? "Saving…" : "Save post"}</button>
        </div>
      </div>

      <div className="editor-fields">
        <label className="editor-title-field">
          <span>Title</span>
          <input
            name="title"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              if (!slugTouched) setSlug(slugify(event.target.value));
            }}
            maxLength={160}
            placeholder="A clear, useful title"
            required
          />
        </label>

        <div className="editor-settings-grid">
          <label><span>URL slug</span><input name="slug" value={slug} onChange={(event) => { setSlugTouched(true); setSlug(slugify(event.target.value)); }} required /></label>
          <label><span>Category</span><select name="category" defaultValue={post?.category ?? "General"}>{BLOG_CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></label>
          <label><span>Status</span><select name="status" defaultValue={post?.status ?? "draft"}><option value="draft">Draft</option><option value="published">Published</option></select></label>
          <label><span>Publish date</span><input name="publishedAt" type="datetime-local" defaultValue={localDate(post?.published_at ?? null)} /></label>
        </div>

        <label><span>Short summary</span><textarea name="excerpt" defaultValue={post?.excerpt} maxLength={320} rows={3} placeholder="Shown on the blog index and in search results." /></label>

        <div className="cover-field">
          <div>
            <span>Cover image</span>
            <p>JPEG, PNG, WebP, or GIF. Use a wide image and provide meaningful alt text.</p>
            <label className="cover-upload">
              {coverBusy ? "Uploading…" : cover ? "Replace cover" : "Upload cover"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                disabled={coverBusy}
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  setCoverBusy(true);
                  setCoverError("");
                  try { setCover(await uploadCover(file)); }
                  catch (error) { setCoverError(error instanceof Error ? error.message : "Upload failed"); }
                  finally { setCoverBusy(false); event.target.value = ""; }
                }}
              />
            </label>
            {cover && <button className="cover-remove" type="button" onClick={() => setCover("")}>Remove</button>}
            {coverError && <p className="form-error">{coverError}</p>}
          </div>
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt="Current cover preview" />
          ) : <div className="cover-placeholder">No cover selected</div>}
        </div>

        <label><span>Cover image alt text</span><input name="coverImageAlt" defaultValue={post?.cover_image_alt} maxLength={180} placeholder="Describe the image for screen readers" /></label>

        <div className="editor-content-field">
          <span>Story</span>
          <RichEditor value={content} onChange={setContent} />
        </div>
      </div>

      {state.message && <p className={state.ok ? "editor-status form-success" : "editor-status form-error"} role="status">{state.message}</p>}
    </form>
  );
}

