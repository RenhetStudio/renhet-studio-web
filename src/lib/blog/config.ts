export const BLOG_NAME = "Renhet Between Builds";
export const BLOG_TAGLINE = "Small updates from our warm, handmade game studio.";

export const BLOG_CATEGORIES = [
  "Dev Log",
  "Art",
  "Marketing",
  "Design",
  "Programming",
  "Production",
  "Animation",
  "VFX",
  "Sound design",
  "Music",
  "General",
  "Recommendations",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://www.renhetstudio.com";
