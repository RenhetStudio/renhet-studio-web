import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "$lib/supabase/env";
import type { BlogComment, BlogPost, BlogPostSummary } from "./types";

type PublishedPostsOptions = { category?: string; query?: string; limit?: number };
type CacheEntry<T> = { expires: number; value: T };
const publicCache = new Map<string, CacheEntry<unknown>>();
const PUBLIC_CACHE_MS = 300_000;
const PUBLIC_CACHE_MAX_ENTRIES = 200;

export const FALLBACK_POSTS: BlogPostSummary[] = [
  {
    id: "post-006",
    slug: "006-its-okay-if-youre-not-there-yet",
    title: "#006: It's Okay If You're Not There Yet",
    excerpt: "Sharing thoughts on trying to break into the industry.",
    category: "General",
    published_at: "2026-08-09T12:00:00Z",
    created_at: "2026-08-09T12:00:00Z",
    updated_at: "2026-08-09T12:00:00Z",
  },
  {
    id: "post-weekend-shift",
    slug: "the-weekend-shift-update",
    title: "The Weekend Shift Update",
    excerpt: "A big one this time, we've rebuilt the rhythm of a night behind the bar from the ground up. Here's what's new.",
    category: "Dev Log",
    published_at: "2026-07-31T12:00:00Z",
    created_at: "2026-07-31T12:00:00Z",
    updated_at: "2026-07-31T12:00:00Z",
  },
  {
    id: "post-005",
    slug: "005-a-beginners-guide-to-languages-that-dont-exist",
    title: "#005: A Beginners Guide to Languages That Don't Exist",
    excerpt: "Todd explains to us how Conlang works within world-building and game design!",
    category: "General",
    published_at: "2026-07-26T12:00:00Z",
    created_at: "2026-07-26T12:00:00Z",
    updated_at: "2026-07-26T12:00:00Z",
  },
  {
    id: "post-004",
    slug: "004-renhets-origins",
    title: "#004: Renhet's Origins",
    excerpt: "A small chat with Miguel around the creation of Renhet!",
    category: "General",
    published_at: "2026-07-19T12:00:00Z",
    created_at: "2026-07-19T12:00:00Z",
    updated_at: "2026-07-19T12:00:00Z",
  },
  {
    id: "post-003",
    slug: "003-who-is-renhet-part-2",
    title: "#003: Who Is Renhet? Part 2!",
    excerpt: "Round 2 of showing off our amazing team!",
    category: "General",
    published_at: "2026-07-12T12:00:00Z",
    created_at: "2026-07-12T12:00:00Z",
    updated_at: "2026-07-12T12:00:00Z",
  },
  {
    id: "post-002",
    slug: "002-who-is-renhet-part-1",
    title: "#002: Who Is Renhet? Part 1!",
    excerpt: "The first small glimpse into the team!",
    category: "General",
    published_at: "2026-07-05T12:00:00Z",
    created_at: "2026-07-05T12:00:00Z",
    updated_at: "2026-07-05T12:00:00Z",
  },
  {
    id: "post-001",
    slug: "001-hello-from-the-desk",
    title: "#001: Hello From the Desk.",
    excerpt: "An introduction to Renhet Between Builds!",
    category: "General",
    published_at: "2026-06-28T12:00:00Z",
    created_at: "2026-06-28T12:00:00Z",
    updated_at: "2026-06-28T12:00:00Z",
  },
  {
    id: "post-sound-beezle",
    slug: "brewing-up-sound-the-acoustics-of-beelze-pub",
    title: "Brewing Up Sound: The Acoustics of Beelze Pub",
    excerpt: "How we layered sizzling pans, wooden tankards, and demon whispers to create a cozy subterranean soundscape.",
    category: "Sound design",
    published_at: "2026-06-20T12:00:00Z",
    created_at: "2026-06-20T12:00:00Z",
    updated_at: "2026-06-20T12:00:00Z",
  },
  {
    id: "post-pixel-stained-glass",
    slug: "why-pixel-art-feels-like-stained-glass",
    title: "Why Pixel Art Feels Like Stained Glass",
    excerpt: "Reflections on lighting, palette restriction, and the meditative art of placing every pixel by hand.",
    category: "Art",
    published_at: "2026-06-14T12:00:00Z",
    created_at: "2026-06-14T12:00:00Z",
    updated_at: "2026-06-14T12:00:00Z",
  },
  {
    id: "post-inventory-system",
    slug: "handling-inventory-without-losing-your-mind",
    title: "Handling Inventory Without Losing Your Mind",
    excerpt: "Building a fluid, drag-and-drop cocktail crafting grid that never drops player input or desyncs.",
    category: "Programming",
    published_at: "2026-06-07T12:00:00Z",
    created_at: "2026-06-07T12:00:00Z",
    updated_at: "2026-06-07T12:00:00Z",
  },
  {
    id: "post-dialogue-design",
    slug: "designing-dialogue-that-respects-player-time",
    title: "Designing Dialogue That Respects Player Time",
    excerpt: "No filler, no exposition dumps. Every line of tavern conversation must reveal character or advance a recipe.",
    category: "Design",
    published_at: "2026-05-30T12:00:00Z",
    created_at: "2026-05-30T12:00:00Z",
    updated_at: "2026-05-30T12:00:00Z",
  },
  {
    id: "post-playtest-one",
    slug: "the-first-playtest-what-broke-and-what-sang",
    title: "The First Playtest: What Broke and What Sang",
    excerpt: "We put an early build into the hands of 50 players. Here is what they loved and what we had to rewrite immediately.",
    category: "Production",
    published_at: "2026-05-22T12:00:00Z",
    created_at: "2026-05-22T12:00:00Z",
    updated_at: "2026-05-22T12:00:00Z",
  },
  {
    id: "post-tavern-lighting",
    slug: "lighting-the-tavern-warm-lanterns-in-2d",
    title: "Lighting the Tavern: Warm Lanterns in 2D",
    excerpt: "Creating a sense of hearth and home using custom 2D normal-mapped shader lighting on paper textures.",
    category: "Art",
    published_at: "2026-05-15T12:00:00Z",
    created_at: "2026-05-15T12:00:00Z",
    updated_at: "2026-05-15T12:00:00Z",
  },
  {
    id: "post-melody-composer",
    slug: "composing-a-tavern-melody-you-can-hear-100-times",
    title: "Composing a Tavern Melody You Can Hear 100 Times",
    excerpt: "The subtle acoustic tricks Daniël used to write music that stays charming after dozens of tavern shifts.",
    category: "Music",
    published_at: "2026-05-08T12:00:00Z",
    created_at: "2026-05-08T12:00:00Z",
    updated_at: "2026-05-08T12:00:00Z",
  },
  {
    id: "post-drink-physics",
    slug: "behind-the-foam-simulating-pouring-drinks",
    title: "Behind the Foam: Simulating Pouring Drinks",
    excerpt: "A look under the hood at the 2D fluid simulation that makes mixing hellish drinks so satisfying.",
    category: "Programming",
    published_at: "2026-04-30T12:00:00Z",
    created_at: "2026-04-30T12:00:00Z",
    updated_at: "2026-04-30T12:00:00Z",
  },
  {
    id: "post-cutting-features",
    slug: "when-to-cut-a-feature-you-love",
    title: "When to Cut a Feature You Love",
    excerpt: "Why we decided to shelve the fishing mini-game to keep Beelze Pub tightly focused on its core barcraft fantasy.",
    category: "Production",
    published_at: "2026-04-21T12:00:00Z",
    created_at: "2026-04-21T12:00:00Z",
    updated_at: "2026-04-21T12:00:00Z",
  },
  {
    id: "post-patron-silhouettes",
    slug: "character-silhouettes-making-patrons-instantly-recognizable",
    title: "Character Silhouettes: Making Patrons Instantly Recognizable",
    excerpt: "How Maurice and Burakcan design silhouettes so you immediately know who just walked through the tavern door.",
    category: "Design",
    published_at: "2026-04-12T12:00:00Z",
    created_at: "2026-04-12T12:00:00Z",
    updated_at: "2026-04-12T12:00:00Z",
  },
  {
    id: "post-roadmap-early-access",
    slug: "roadmap-to-early-access-balancing-dreams-and-deadlines",
    title: "Roadmap to Early Access: Balancing Dreams and Deadlines",
    excerpt: "Our honest timeline for bringing Beelze Pub to Steam and Itch.io with a demo this fall.",
    category: "Dev Log",
    published_at: "2026-04-02T12:00:00Z",
    created_at: "2026-04-02T12:00:00Z",
    updated_at: "2026-04-02T12:00:00Z",
  },
];

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

function filterFallbackPosts(options: PublishedPostsOptions = {}): BlogPostSummary[] {
  let list = [...FALLBACK_POSTS];
  if (options.category) {
    list = list.filter((p) => p.category.toLowerCase() === options.category?.toLowerCase());
  }
  if (options.query) {
    const q = options.query.toLowerCase().trim();
    list = list.filter((p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q));
  }
  if (options.limit) {
    list = list.slice(0, options.limit);
  }
  return list;
}

export async function getPublishedPosts(options: PublishedPostsOptions = {}) {
  return cached(`posts:${JSON.stringify(options)}`, async () => {
    try {
      const supabase = getPublicClient();
      let request = supabase
        .from("posts")
        .select("id, slug, title, excerpt, category, published_at, created_at, updated_at")
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
      if (error) {
        return filterFallbackPosts(options);
      }
      if (!data || data.length === 0) {
        return filterFallbackPosts(options);
      }
      return data as BlogPostSummary[];
    } catch {
      return filterFallbackPosts(options);
    }
  });
}

export async function getPublishedPost(slug: string) {
  return cached(`post:${slug}`, async () => {
    try {
      const { data, error } = await getPublicClient()
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .lte("published_at", new Date().toISOString())
        .maybeSingle();
      if (error || !data) {
        const fallback = FALLBACK_POSTS.find((p) => p.slug === slug);
        if (fallback) {
          return {
            ...fallback,
            cover_image_url: null,
            cover_image_alt: "",
            content: {
              type: "doc",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: fallback.excerpt }],
                },
              ],
            },
            status: "published" as const,
            author_id: "author-1",
          } as BlogPost;
        }
        return null;
      }
      return data as BlogPost | null;
    } catch {
      const fallback = FALLBACK_POSTS.find((p) => p.slug === slug);
      if (fallback) {
        return {
          ...fallback,
          cover_image_url: null,
          cover_image_alt: "",
          content: {
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: fallback.excerpt }],
              },
            ],
          },
          status: "published" as const,
          author_id: "author-1",
        } as BlogPost;
      }
      return null;
    }
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
  if (error) return [];
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
