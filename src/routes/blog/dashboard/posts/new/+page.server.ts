import { redirect } from "@sveltejs/kit";
import { savePost } from "$lib/blog/posts.server";
import { requireAuthor } from "$lib/supabase/auth";
import type { Actions, PageServerLoad } from "./$types";
export const load: PageServerLoad = async ({ locals }) => { await requireAuthor(locals); return {}; };
export const actions = { default: async ({ request, locals }) => { const result = await savePost(locals, await request.formData()); if ("id" in result && result.id) redirect(303, `/blog/dashboard/posts/${result.id}`); return result; } } satisfies Actions;
