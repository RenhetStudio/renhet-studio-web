import { z } from "zod";
import { BLOG_CATEGORIES } from "./config";

const urlOrEmpty = z
  .string()
  .trim()
  .max(2048)
  .refine((value) => !value || /^https:\/\//i.test(value), "Use a secure HTTPS URL");

export const postSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(1).max(160),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(180)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens"),
  excerpt: z.string().trim().max(320),
  category: z.enum(BLOG_CATEGORIES),
  coverImageUrl: urlOrEmpty,
  coverImageAlt: z.string().trim().max(180),
  content: z.string().min(1).max(1_000_000).transform((value, context) => {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (!parsed || typeof parsed !== "object") throw new Error("Invalid document");
      return parsed;
    } catch {
      context.addIssue({ code: "custom", message: "The post content is invalid" });
      return z.NEVER;
    }
  }),
  status: z.enum(["draft", "published"]),
  publishedAt: z.string().trim().optional(),
});

export const commentSchema = z.object({
  postId: z.string().uuid(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  body: z.string().trim().min(1).max(2000),
  website: z.string().max(0),
});

export const mediaSchema = z.object({
  filename: z.string().trim().min(1).max(180),
  contentType: z.enum([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "video/mp4",
    "video/webm",
    "audio/mpeg",
    "audio/ogg",
    "audio/wav",
    "audio/webm",
  ]),
  size: z.number().int().positive().max(52_428_800),
});

