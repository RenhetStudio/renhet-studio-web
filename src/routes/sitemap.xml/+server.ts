import { getPublishedPosts } from "$lib/blog/data";
import { SITE_URL } from "$lib/blog/config";
import type { RequestHandler } from "./$types";

type SitemapEntry = { loc: string; lastmod: string; priority: number };

// Update these dates when the corresponding page content changes.
const publicPages = [
  { path: "/", lastmod: "2026-11-09", priority: 1.0 },
  { path: "/games/beelze-pub", lastmod: "2026-11-09", priority: 0.9 },
  { path: "/blog", lastmod: "2026-11-09", priority: 0.9 },
  { path: "/careers", lastmod: "2026-11-09", priority: 0.8 },
];

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;",
  })[character] ?? character);
}

export const GET: RequestHandler = async () => {
  const posts = await getPublishedPosts();
  const entries: SitemapEntry[] = [
    ...publicPages.map(({ path, lastmod, priority }) => ({
      loc: `${SITE_URL}${path}`,
      lastmod,
      priority,
    })),
    ...posts.map((post) => ({
      loc: `${SITE_URL}/blog/${encodeURIComponent(post.slug)}`,
      lastmod: post.updated_at,
      priority: 0.7,
    })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${escapeXml(entry.lastmod)}</lastmod>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`).join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=900, stale-while-revalidate=86400",
      "Content-Type": "application/xml; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
};
