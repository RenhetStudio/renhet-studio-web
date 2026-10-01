import { BLOG_CATEGORIES } from "$lib/blog/config";
import { getPublishedPosts } from "$lib/blog/data";
import { getCurrentProfile } from "$lib/supabase/auth";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, locals }) => {
  const requestedCategory = url.searchParams.get("category") ?? undefined;
  const category = BLOG_CATEGORIES.includes(requestedCategory as (typeof BLOG_CATEGORIES)[number]) ? requestedCategory : undefined;
  const query = url.searchParams.get("q")?.slice(0, 80) ?? undefined;
  const [posts, profile] = await Promise.all([getPublishedPosts({ category, query }), getCurrentProfile(locals)]);
  return { posts, profile, category, query };
};
