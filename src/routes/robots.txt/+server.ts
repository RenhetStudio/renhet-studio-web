import { SITE_URL } from "$lib/blog/config";
import type { RequestHandler } from "./$types";
export const GET: RequestHandler = () => new Response(`User-agent: *\nAllow: /\nAllow: /blog/\nDisallow: /blog/dashboard/\nDisallow: /blog/preview/\nDisallow: /account\nDisallow: /login\nSitemap: ${SITE_URL}/sitemap.xml\nHost: ${SITE_URL}\n`, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
