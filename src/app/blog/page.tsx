import type { Metadata } from "next";
import Link from "next/link";
import { BlogShell } from "@/components/blog/blog-shell";
import { BlogMotion } from "@/components/blog/blog-motion";
import { PostCard } from "@/components/blog/post-card";
import { BLOG_CATEGORIES, BLOG_NAME, BLOG_TAGLINE } from "@/lib/blog/config";
import { getPublishedPosts } from "@/lib/blog/data";
import { getCurrentProfile } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: BLOG_NAME,
  description: BLOG_TAGLINE,
  alternates: { canonical: "/blog" },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const category = BLOG_CATEGORIES.includes(params.category as (typeof BLOG_CATEGORIES)[number])
    ? params.category
    : undefined;
  const [posts, profile] = await Promise.all([
    getPublishedPosts({ category, query: params.q }),
    getCurrentProfile(),
  ]);
  const [featured, ...rest] = posts;

  return (
    <BlogShell profile={profile}>
      <BlogMotion>
        <header className="blog-hero">
          <div className="blog-hero-copy">
            <h1 className="blog-hero-enter">{BLOG_NAME}</h1>
            <p className="blog-hero-tagline blog-hero-enter">{BLOG_TAGLINE}</p>
            <a className="blog-hero-cta blog-hero-enter" href="#stories">Read the latest</a>
          </div>
        </header>

        <div className="category-marquee" aria-label="Blog categories">
          <div>
            {[...BLOG_CATEGORIES, ...BLOG_CATEGORIES].map((item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
        </div>

        <section id="stories" className="blog-stories">
          <div className="stories-heading">
            <h2 className="blog-scrub-copy">What we are making lately.</h2>
            <form className="blog-filter" action="/blog">
              <label>
                <span className="sr-only">Search stories</span>
                <input name="q" defaultValue={params.q} placeholder="Search stories" maxLength={80} />
              </label>
              <label>
                <span className="sr-only">Filter by category</span>
                <select name="category" defaultValue={category ?? ""}>
                  <option value="">All categories</option>
                  {BLOG_CATEGORIES.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <button type="submit">Filter</button>
            </form>
          </div>

          {!featured && (
            <div className="blog-empty">
              <h2>No stories here yet.</h2>
              <p>{category || params.q ? "Try a different filter." : "The first Renhet note is being prepared."}</p>
              {(category || params.q) && <Link href="/blog">View all stories</Link>}
            </div>
          )}

          {featured && (
            <div className="featured-grid">
              <PostCard post={featured} featured />
              {rest.slice(0, 2).map((post) => <PostCard post={post} key={post.id} />)}
            </div>
          )}

          {rest.length > 2 && (
            <div className="post-accordion">
              {rest.slice(2).map((post) => <PostCard post={post} key={post.id} />)}
            </div>
          )}
        </section>

        <section className="blog-action">
          <p>From tiny tests to finished adventures.</p>
          <h2>Follow the things we are making.</h2>
          <Link href="/">Meet Renhet Studio</Link>
        </section>
      </BlogMotion>
    </BlogShell>
  );
}
