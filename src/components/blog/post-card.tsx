import Link from "next/link";
import type { BlogPost } from "@/lib/blog/types";

export function PostCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  return (
    <article className={featured ? "post-card post-card-featured" : "post-card"}>
      <Link href={`/blog/${post.slug}`} className="post-card-media" aria-label={post.title}>
        {post.cover_image_url ? (
          // User-authored media uses the validated HTTPS URL from Supabase Storage.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image_url}
            alt={post.cover_image_alt || ""}
            className="blog-reveal-image"
          />
        ) : (
          <div className="post-card-placeholder" aria-hidden="true" />
        )}
      </Link>
      <div className="post-card-copy">
        <div className="post-card-meta">
          <Link href={`/blog?category=${encodeURIComponent(post.category)}`}>{post.category}</Link>
          <time dateTime={post.published_at ?? post.created_at}>
            {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
              new Date(post.published_at ?? post.created_at),
            )}
          </time>
        </div>
        <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
        {post.excerpt && <p>{post.excerpt}</p>}
        <Link className="post-card-read" href={`/blog/${post.slug}`}>Read story <span aria-hidden="true">→</span></Link>
      </div>
    </article>
  );
}

