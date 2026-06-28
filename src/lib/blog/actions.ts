"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAuthor, requireUser } from "@/lib/supabase/auth";
import { commentSchema, postSchema } from "./validation";

export type ActionState = { ok: boolean; message: string; id?: string };

export async function savePostAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const profile = await requireAuthor();
  const parsed = postSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the post fields" };
  }

  const input = parsed.data;
  const requestedDate = input.publishedAt ? new Date(input.publishedAt) : null;
  if (requestedDate && Number.isNaN(requestedDate.getTime())) {
    return { ok: false, message: "The publication date is invalid" };
  }
  const publishedAt = requestedDate?.toISOString() ??
    (input.status === "published" ? new Date().toISOString() : null);

  const values = {
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt,
    category: input.category,
    content: input.content,
    status: input.status,
    published_at: publishedAt,
  };

  const supabase = await createClient();
  const request = input.id
    ? supabase.from("posts").update(values).eq("id", input.id).select("id").single()
    : supabase
        .from("posts")
        .insert({ ...values, author_id: profile.id })
        .select("id")
        .single();
  const { data, error } = await request;

  if (error) {
    const message = error.code === "23505" ? "That URL slug is already in use" : error.message;
    return { ok: false, message };
  }

  revalidatePath("/blog");
  revalidatePath("/blog/dashboard");
  revalidatePath(`/blog/${input.slug}`);
  return { ok: true, message: "Post saved", id: data.id };
}

export async function deletePostAction(formData: FormData) {
  await requireAuthor();
  const id = String(formData.get("id") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return;
  const supabase = await createClient();
  await supabase.from("posts").delete().eq("id", id);
  revalidatePath("/blog");
  revalidatePath("/blog/dashboard");
}

export async function submitCommentAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = commentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Check your comment" };
  }
  const user = await requireUser(`/blog/${parsed.data.slug}#comments`);
  const supabase = await createClient();
  const { error } = await supabase.from("comments").insert({
    post_id: parsed.data.postId,
    user_id: user.id,
    display_name: "Reader",
    body: parsed.data.body,
    status: "pending",
  });

  if (error) return { ok: false, message: error.message };
  revalidatePath(`/blog/${parsed.data.slug}`);
  return { ok: true, message: "Comment submitted for review" };
}

export async function moderateCommentAction(formData: FormData) {
  await requireAuthor();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id) || !["approved", "rejected"].includes(status)) return;
  const supabase = await createClient();
  await supabase.from("comments").update({ status }).eq("id", id);
  revalidatePath("/blog/dashboard");
  revalidatePath("/blog", "layout");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/blog");
}
