import { getPublishedPosts } from "@/lib/blog/data";
import { BLOG_NAME, BLOG_TAGLINE, SITE_URL } from "@/lib/blog/config";

export const dynamic = "force-dynamic";

function xml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({
    "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;",
  })[character] ?? character);
}

export async function GET() {
  const posts = await getPublishedPosts({ limit: 30 });
  const items = posts.map((post) => `
    <item>
      <title>${xml(post.title)}</title>
      <link>${SITE_URL}/blog/${xml(post.slug)}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${xml(post.slug)}</guid>
      <description>${xml(post.excerpt)}</description>
      <category>${xml(post.category)}</category>
      <pubDate>${new Date(post.published_at ?? post.created_at).toUTCString()}</pubDate>
    </item>`).join("");

  return new Response(`<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0"><channel>
      <title>${xml(BLOG_NAME)}</title>
      <link>${SITE_URL}/blog</link>
      <description>${xml(BLOG_TAGLINE)}</description>
      <language>en</language>${items}
    </channel></rss>`, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=0, s-maxage=900" },
  });
}
