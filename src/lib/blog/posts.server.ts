import { fail } from "@sveltejs/kit";
import { postSchema } from "./validation";
import { clearPublishedPostsCache } from "./data";
import { requireAuthor } from "$lib/supabase/auth";

export async function savePost(locals: App.Locals, formData: FormData, id?: string) {
  const profile = await requireAuthor(locals);
  const parsed = postSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail(400, { ok: false, message: parsed.error.issues[0]?.message ?? "Check the post fields" });
  const input = parsed.data; const requestedDate = input.publishedAt ? new Date(input.publishedAt) : null;
  if (requestedDate && Number.isNaN(requestedDate.getTime())) return fail(400, { ok: false, message: "The publication date is invalid" });
  const values = { title: input.title, slug: input.slug, excerpt: input.excerpt, category: input.category, content: input.content, status: input.status, published_at: requestedDate?.toISOString() ?? (input.status === "published" ? new Date().toISOString() : null) };
  const request = id ? locals.supabase.from("posts").update(values).eq("id", id).select("id").single() : locals.supabase.from("posts").insert({ ...values, author_id: profile.id }).select("id").single();
  const { data, error } = await request;
  if (error) return fail(400, { ok: false, message: error.code === "23505" ? "That URL slug is already in use" : error.message });
  clearPublishedPostsCache();
  return { ok: true, message: id ? "Post updated" : "Post saved", id: data.id as string };
}
