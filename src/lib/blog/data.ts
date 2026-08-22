import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { BlogComment, BlogPost } from "./types";

type PublishedPostsOptions = {
  category?: string;
  query?: string;
  limit?: number;
};

function createPublicClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createSupabaseClient(url, anonKey, { auth: { persistSession: false } });
}

async function queryPublishedPosts(options?: PublishedPostsOptions) {
  const supabase = createPublicClient();
  let request = supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(options?.limit ?? 100);

  if (options?.category) request = request.eq("category", options.category);
  if (options?.query) {
    const safeQuery = options.query.replace(/[%_,()]/g, " ").trim().slice(0, 80);
    if (safeQuery) request = request.or(`title.ilike.%${safeQuery}%,excerpt.ilike.%${safeQuery}%`);
  }

  const { data, error } = await request;
  if (error) throw new Error(`Could not load posts: ${error.message}`);
  return (data ?? []) as BlogPost[];
}

async function queryPublishedPost(slug: string) {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .maybeSingle();
  return data as BlogPost | null;
}

export const getPublishedPosts = unstable_cache(queryPublishedPosts, ["published-posts"], {
  revalidate: 300,
  tags: ["published-posts"],
});

export const getPublishedPost = unstable_cache(queryPublishedPost, ["published-post"], {
  revalidate: 300,
  tags: ["published-posts"],
});

export async function getPostForEditor(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
  return data as BlogPost | null;
}

export async function getAllPostsForDashboard() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw new Error(`Could not load dashboard posts: ${error.message}`);
  return (data ?? []) as BlogPost[];
}

export async function getPostComments(postId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .eq("status", "approved")
    .order("created_at", { ascending: true });
  if (error) throw new Error(`Could not load comments: ${error.message}`);
  return (data ?? []) as BlogComment[];
}

export async function getPendingComments() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  if (error) throw new Error(`Could not load moderation queue: ${error.message}`);
  return (data ?? []) as BlogComment[];
}
