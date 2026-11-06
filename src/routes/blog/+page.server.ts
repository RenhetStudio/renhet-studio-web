import { BLOG_CATEGORIES } from "$lib/blog/config";
import { getPublishedPosts } from "$lib/blog/data";
import { getCurrentProfile } from "$lib/supabase/auth";
import type { BlogPostSummary } from "$lib/blog/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, locals, cookies, setHeaders }) => {
  const requestedCategory = url.searchParams.get("category") ?? undefined;
  const category = BLOG_CATEGORIES.includes(requestedCategory as (typeof BLOG_CATEGORIES)[number]) ? requestedCategory : undefined;
  const query = url.searchParams.get("q")?.slice(0, 80) ?? undefined;
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
  const perPage = 7;

  // Selective Supabase auth cookie detection — avoids slow remote auth API calls for public readers
  const hasAuthCookie = cookies.getAll().some((c) => c.name.startsWith("sb-") && c.name.includes("-auth-token"));

  if (!hasAuthCookie && !query && !category && page === 1) {
    setHeaders({
      "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
    });
  } else if (!hasAuthCookie) {
    setHeaders({
      "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=600",
    });
  }

  // Stream posts as an unawaited Promise so route navigation transitions in 0ms without waiting for upstream databases
  const postsPromise = getPublishedPosts({ category, query }).catch((error): BlogPostSummary[] => {
    console.warn("Could not load published posts:", error instanceof Error ? error.message : error);
    return [];
  });

  // Track global latest post slug so filtered views never falsely badge a non-latest post as "LATEST POST"
  const globalLatestSlugPromise = (category || query || page > 1)
    ? getPublishedPosts().then((all) => all[0]?.slug ?? null).catch(() => null)
    : Promise.resolve(null);

  const profile = hasAuthCookie
    ? await getCurrentProfile(locals).catch(() => null)
    : null;

  return {
    posts: postsPromise.then((all) => ({
      items: all.slice((page - 1) * perPage, page * perPage),
      total: all.length,
      page,
      perPage,
      totalPages: Math.max(1, Math.ceil(all.length / perPage)),
    })),
    globalLatestSlug: globalLatestSlugPromise,
    profile,
    category,
    query,
    page,
  };
};
