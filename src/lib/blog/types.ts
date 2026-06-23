import type { JSONContent } from "@tiptap/react";
import type { BlogCategory } from "./config";

export type PostStatus = "draft" | "published";
export type CommentStatus = "pending" | "approved" | "rejected";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  cover_image_url: string | null;
  cover_image_alt: string;
  content: JSONContent;
  status: PostStatus;
  published_at: string | null;
  author_id: string;
  created_at: string;
  updated_at: string;
}

export interface BlogComment {
  id: string;
  post_id: string;
  user_id: string;
  display_name: string;
  body: string;
  status: CommentStatus;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  display_name: string;
  role: "reader" | "author" | "admin";
}

