import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "$lib/supabase/env";
import type { BlogComment, BlogPost } from "./types";

type PublishedPostsOptions = { category?: string; query?: string; limit?: number };
type CacheEntry<T> = { expires: number; value: T };
const publicCache = new Map<string, CacheEntry<unknown>>();
const PUBLIC_CACHE_MS = 300_000;

function createPublicClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createSupabaseClient(url, anonKey, { auth: { persistSession: false } });
}

async function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  const entry = publicCache.get(key) as CacheEntry<T> | undefined;
  if (entry && entry.expires > Date.now()) return entry.value;
  const value = await load();
  publicCache.set(key, { expires: Date.now() + PUBLIC_CACHE_MS, value });
  return value;
}

export function clearPublishedPostsCache() {
  publicCache.clear();
}

export async function getPublishedPosts(options: PublishedPostsOptions = {}) {
  return cached(`posts:${JSON.stringify(options)}`, async () => {
    const supabase = createPublicClient();
    let request = supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false })
      .limit(options.limit ?? 100);
    if (options.category) request = request.eq("category", options.category);
    if (options.query) {
      const safeQuery = options.query.replace(/[%_,()]/g, " ").trim().slice(0, 80);
      if (safeQuery) request = request.or(`title.ilike.%${safeQuery}%,excerpt.ilike.%${safeQuery}%`);
    }
    const { data, error } = await request;
    if (error) throw new Error(`Could not load posts: ${error.message}`);
    return (data ?? []) as BlogPost[];
  });
}

export async function getPublishedPost(slug: string) {
  return cached(`post:${slug}`, async () => {
    const { data } = await createPublicClient()
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .maybeSingle();
    return data as BlogPost | null;
  });
}

export async function getPostForEditor(supabase: SupabaseClient, id: string) {
  const { data } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
  return data as BlogPost | null;
}

export async function getAllPostsForDashboard(supabase: SupabaseClient) {
  const { data, error } = await supabase.from("posts").select("*").order("updated_at", { ascending: false });
  if (error) throw new Error(`Could not load dashboard posts: ${error.message}`);
  return (data ?? []) as BlogPost[];
}

export async function getPostComments(supabase: SupabaseClient, postId: string) {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .eq("status", "approved")
    .order("created_at", { ascending: true });
  if (error) throw new Error(`Could not load comments: ${error.message}`);
  return (data ?? []) as BlogComment[];
}

export async function getPendingComments(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  if (error) throw new Error(`Could not load moderation queue: ${error.message}`);
  return (data ?? []) as BlogComment[];
}
