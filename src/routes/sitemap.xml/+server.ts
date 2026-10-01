import { getPublishedPosts } from "$lib/blog/data";
import { SITE_URL } from "$lib/blog/config";
import type { RequestHandler } from "./$types";
export const GET: RequestHandler = async () => {
  const posts = await getPublishedPosts();
  const entries = [{ loc: SITE_URL, frequency: "monthly", priority: 1 }, { loc: `${SITE_URL}/blog`, frequency: "weekly", priority: 0.9 }, { loc: `${SITE_URL}/careers`, frequency: "weekly", priority: 0.8 }, ...posts.map((post) => ({ loc: `${SITE_URL}/blog/${post.slug}`, frequency: "monthly", priority: 0.7, modified: post.updated_at }))];
  const body = entries.map((entry) => `<url><loc>${entry.loc}</loc>${"modified" in entry ? `<lastmod>${entry.modified}</lastmod>` : ""}<changefreq>${entry.frequency}</changefreq><priority>${entry.priority}</priority></url>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=0, s-maxage=900, stale-while-revalidate=86400" } });
};
