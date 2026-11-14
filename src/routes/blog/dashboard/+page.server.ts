import { fail } from "@sveltejs/kit";
import { clearPublishedPostsCache, getAllPostsForDashboard, getPendingComments } from "$lib/blog/data";
import { requireAuthor } from "$lib/supabase/auth";
import type { Actions, PageServerLoad } from "./$types";

// This loads the page server
export const load: PageServerLoad = async ({ locals }) => {
  const profile = await requireAuthor(locals);
  const [allPosts, comments] = await Promise.all([
    getAllPostsForDashboard(locals.supabase),
    getPendingComments(locals.supabase),
  ]);

  const posts = allPosts.filter((p) => !p.deleted_at);
  const deletedPosts = allPosts.filter((p) => Boolean(p.deleted_at));

  return { profile, posts, deletedPosts, comments };
};

export const actions = {
  moderate: async ({ request, locals }) => {
    await requireAuthor(locals);
    const data = await request.formData();
    const id = String(data.get("id") ?? "");
    const status = String(data.get("status") ?? "");
    if (!/^[0-9a-f-]{36}$/i.test(id) || !["approved", "rejected"].includes(status)) return fail(400);
    const { error } = await locals.supabase.from("comments").update({ status }).eq("id", id);
    return error ? fail(400, { message: error.message }) : { ok: true };
  },
  delete: async ({ request, locals }) => {
    await requireAuthor(locals);
    const id = String((await request.formData()).get("id") ?? "");
    if (!/^[0-9a-f-]{36}$/i.test(id)) return fail(400);
    const { error } = await locals.supabase
      .from("posts")
      .update({ deleted_at: new Date().toISOString(), status: "draft" })
      .eq("id", id);
    if (error) return fail(400, { message: error.message });
    clearPublishedPostsCache();
    return { ok: true, message: "Story moved to trash" };
  },
  restore: async ({ request, locals }) => {
    await requireAuthor(locals);
    const id = String((await request.formData()).get("id") ?? "");
    if (!/^[0-9a-f-]{36}$/i.test(id)) return fail(400);
    const { error } = await locals.supabase
      .from("posts")
      .update({ deleted_at: null, status: "draft" })
      .eq("id", id);
    if (error) return fail(400, { message: error.message });
    clearPublishedPostsCache();
    return { ok: true, message: "Story restored as draft" };
  },
  destroy: async ({ request, locals }) => {
    await requireAuthor(locals);
    const id = String((await request.formData()).get("id") ?? "");
    if (!/^[0-9a-f-]{36}$/i.test(id)) return fail(400);
    const { error } = await locals.supabase
      .from("posts")
      .delete()
      .eq("id", id);
    if (error) return fail(400, { message: error.message });
    clearPublishedPostsCache();
    return { ok: true, message: "Story permanently deleted" };
  },
} satisfies Actions;
