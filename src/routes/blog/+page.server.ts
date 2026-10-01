import { BLOG_CATEGORIES } from "$lib/blog/config";
import { getPublishedPosts } from "$lib/blog/data";
import { getCurrentProfile } from "$lib/supabase/auth";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, locals, cookies, setHeaders }) => {
  const requestedCategory = url.searchParams.get("category") ?? undefined;
  const category = BLOG_CATEGORIES.includes(requestedCategory as (typeof BLOG_CATEGORIES)[number]) ? requestedCategory : undefined;
  const query = url.searchParams.get("q")?.slice(0, 80) ?? undefined;
  const hasCookies = cookies.getAll().length > 0;
  setHeaders({
    Vary: "Cookie",
    ...(!hasCookies && { "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400" }),
  });
  const [posts, profile] = await Promise.all([getPublishedPosts({ category, query }), hasCookies ? getCurrentProfile(locals) : null]);
  return { posts, profile, category, query };
};
