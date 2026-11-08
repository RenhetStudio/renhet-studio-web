import { error, fail } from "@sveltejs/kit";
import { env } from "$env/dynamic/public";
import { commentSchema } from "$lib/blog/validation";
import { getPostComments, getPublishedPost } from "$lib/blog/data";
import { renderRichContent } from "$lib/blog/rich-content";
import { getCurrentProfile, requireUser } from "$lib/supabase/auth";
import type { Actions, PageServerLoad } from "./$types";

const isCommentsEnabled = env.PUBLIC_ENABLE_COMMENTS === "true";

export const load: PageServerLoad = async ({ params, locals, cookies, setHeaders }) => {
  const post = await getPublishedPost(params.slug);
  if (!post) error(404, "Story not found");

  const hasAuthCookie = cookies.getAll().some((c) => c.name.startsWith("sb-") && c.name.includes("-auth-token"));

  if (!hasAuthCookie) {
    setHeaders({
      "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
    });
  }

  const [comments, profile] = await Promise.all([
    isCommentsEnabled
      ? getPostComments(locals.supabase, post.id).catch(() => [])
      : Promise.resolve([]),
    hasAuthCookie ? getCurrentProfile(locals).catch(() => null) : null,
  ]);

  return {
    post,
    comments,
    user: Boolean(profile),
    profile,
    contentHtml: renderRichContent(post.content),
    commentsEnabled: isCommentsEnabled,
  };
};

export const actions = {
  comment: async ({ request, locals, params }) => {
    if (!isCommentsEnabled) {
      return fail(403, { ok: false, message: "Discussion is currently closed." });
    }
    const parsed = commentSchema.safeParse(Object.fromEntries(await request.formData()));
    if (!parsed.success) return fail(400, { ok: false, message: parsed.error.issues[0]?.message ?? "Check your comment" });
    const post = await getPublishedPost(params.slug);
    if (!post || parsed.data.postId !== post.id || parsed.data.slug !== params.slug) return fail(400, { ok: false, message: "This story is no longer available for comments" });
    const user = await requireUser(locals, `/blog/${params.slug}#comments`);
    const { error: insertError } = await locals.supabase.from("comments").insert({ post_id: parsed.data.postId, user_id: user.id, display_name: "Reader", body: parsed.data.body, status: "pending" });
    if (insertError) return fail(400, { ok: false, message: insertError.message });
    return { ok: true, message: "Comment submitted for review" };
  },
} satisfies Actions;
