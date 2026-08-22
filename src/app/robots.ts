import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/blog/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: ["/", "/blog/"], disallow: ["/blog/dashboard/", "/blog/preview/", "/account", "/login"] },
    ],
    host: SITE_URL,
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
