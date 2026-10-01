import { error } from "@sveltejs/kit";
import { getPostForEditor } from "$lib/blog/data";
import { renderRichContent } from "$lib/blog/rich-content";
import { requireAuthor } from "$lib/supabase/auth";
import type { PageServerLoad } from "./$types";
export const load: PageServerLoad = async ({ locals, params }) => { const profile = await requireAuthor(locals); const post = await getPostForEditor(locals.supabase, params.id); if (!post) error(404, "Post not found"); return { profile, post, contentHtml: renderRichContent(post.content) }; };
