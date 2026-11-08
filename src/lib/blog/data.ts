import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "$lib/supabase/env";
import type { BlogComment, BlogPost, BlogPostSummary } from "./types";

type PublishedPostsOptions = { category?: string; query?: string; limit?: number };
type CacheEntry<T> = { expires: number; value: T };
const publicCache = new Map<string, CacheEntry<unknown>>();
const PUBLIC_CACHE_MS = 300_000;
const PUBLIC_CACHE_MAX_ENTRIES = 200;

let cachedPublicClient: SupabaseClient | null = null;
function getPublicClient(): SupabaseClient {
  if (!cachedPublicClient) {
    const { url, anonKey } = getSupabaseEnv();
    cachedPublicClient = createSupabaseClient(url, anonKey, { auth: { persistSession: false } });
  }
  return cachedPublicClient;
}

async function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  const entry = publicCache.get(key) as CacheEntry<T> | undefined;
  if (entry && entry.expires > Date.now()) return entry.value;
  const value = await load();
  if (publicCache.size >= PUBLIC_CACHE_MAX_ENTRIES) {
    for (const [cachedKey, cachedEntry] of publicCache) {
      if (cachedEntry.expires <= Date.now()) publicCache.delete(cachedKey);
    }
    if (publicCache.size >= PUBLIC_CACHE_MAX_ENTRIES) {
      const oldestKey = publicCache.keys().next().value;
      if (oldestKey) publicCache.delete(oldestKey);
    }
  }
  publicCache.set(key, { expires: Date.now() + PUBLIC_CACHE_MS, value });
  return value;
}

export function clearPublishedPostsCache() {
  publicCache.clear();
}

export async function getPublishedPosts(options: PublishedPostsOptions = {}): Promise<BlogPostSummary[]> {
  return cached(`posts:${JSON.stringify(options)}`, async () => {
    try {
      const supabase = getPublicClient();
      let request = supabase
        .from("posts")
        .select("id, slug, title, excerpt, category, published_at, created_at, updated_at")
        .eq("status", "published")
        .is("deleted_at", null)
        .lte("published_at", new Date().toISOString())
        .order("published_at", { ascending: false })
        .limit(options.limit ?? 100);

      if (options.category) request = request.eq("category", options.category);
      if (options.query) {
        const safeQuery = options.query.replace(/[%_,()]/g, " ").trim().slice(0, 80);
        if (safeQuery) request = request.or(`title.ilike.%${safeQuery}%,excerpt.ilike.%${safeQuery}%`);
      }

      const { data, error } = await request;
      if (error) {
        console.error("Could not fetch published posts:", error.message);
        return [];
      }
      return (data ?? []) as BlogPostSummary[];
    } catch (err) {
      console.error("Unexpected error fetching published posts:", err);
      return [];
    }
  });
}

export async function getPublishedPost(slug: string): Promise<BlogPost | null> {
  return cached(`post:${slug}`, async () => {
    try {
      const { data, error } = await getPublicClient()
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .is("deleted_at", null)
        .lte("published_at", new Date().toISOString())
        .maybeSingle();

      if (error) {
        console.error(`Could not fetch post ${slug}:`, error.message);
        return null;
      }
      return (data ?? null) as BlogPost | null;
    } catch (err) {
      console.error(`Unexpected error fetching post ${slug}:`, err);
      return null;
    }
  });
}

export async function getPostForEditor(supabase: SupabaseClient, id: string): Promise<BlogPost | null> {
  const { data } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
  return data as BlogPost | null;
}

export async function getAllPostsForDashboard(supabase: SupabaseClient): Promise<BlogPost[]> {
  const { data, error } = await supabase.from("posts").select("*").order("updated_at", { ascending: false });
  if (error) throw new Error(`Could not load dashboard posts: ${error.message}`);
  return (data ?? []) as BlogPost[];
}

export async function getPostComments(supabase: SupabaseClient, postId: string): Promise<BlogComment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .eq("status", "approved")
    .order("created_at", { ascending: true });
  if (error) return [];
  return (data ?? []) as BlogComment[];
}

export async function getPendingComments(supabase: SupabaseClient): Promise<BlogComment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  if (error) throw new Error(`Could not load moderation queue: ${error.message}`);
  return (data ?? []) as BlogComment[];
}
