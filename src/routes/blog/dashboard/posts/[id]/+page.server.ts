import { error } from "@sveltejs/kit";
import { getPostForEditor } from "$lib/blog/data";
import { savePost } from "$lib/blog/posts.server";
import { requireAuthor } from "$lib/supabase/auth";
import type { Actions, PageServerLoad } from "./$types";
export const load: PageServerLoad = async ({ locals, params }) => { await requireAuthor(locals); const post = await getPostForEditor(locals.supabase, params.id); if (!post) error(404, "Post not found"); return { post }; };
export const actions = { default: async ({ request, locals, params }) => savePost(locals, await request.formData(), params.id) } satisfies Actions;
