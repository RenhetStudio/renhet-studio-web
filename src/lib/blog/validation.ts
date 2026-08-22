import { z } from "zod";
import { BLOG_CATEGORIES } from "./config";

const richNodeTypes = new Set([
  "doc", "paragraph", "text", "heading", "bulletList", "orderedList", "listItem",
  "taskList", "taskItem", "blockquote", "codeBlock", "horizontalRule", "sectionGap",
  "hardBreak", "image", "youtube", "video", "audio", "table", "tableRow", "tableHeader", "tableCell",
]);
const richMarkTypes = new Set(["bold", "italic", "underline", "strike", "code", "highlight", "link"]);

function isSafeRichDocument(value: unknown) {
  let nodes = 0;
  let textLength = 0;
  const visit = (node: unknown, depth: number): boolean => {
    if (!node || typeof node !== "object" || Array.isArray(node) || depth > 30 || ++nodes > 10_000) return false;
    const record = node as Record<string, unknown>;
    if (typeof record.type !== "string" || !richNodeTypes.has(record.type)) return false;
    if (record.text !== undefined) {
      if (record.type !== "text" || typeof record.text !== "string" || (textLength += record.text.length) > 500_000) return false;
    }
    if (record.marks !== undefined && (!Array.isArray(record.marks) || record.marks.some((mark) => !mark || typeof mark !== "object" || !richMarkTypes.has((mark as { type?: unknown }).type as string)))) return false;
    return record.content === undefined || (Array.isArray(record.content) && record.content.every((child) => visit(child, depth + 1)));
  };
  return visit(value, 0) && (value as { type?: unknown }).type === "doc";
}

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
  content: z.string().min(1).max(1_000_000).transform((value, context) => {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (!isSafeRichDocument(parsed)) throw new Error("Invalid document");
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
