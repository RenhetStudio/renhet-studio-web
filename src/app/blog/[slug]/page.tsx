import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogShell } from "@/components/blog/blog-shell";
import { RichContent } from "@/components/blog/rich-content";
import { CommentForm } from "@/components/blog/comment-form";
import { getPublishedPost, getPostComments } from "@/lib/blog/data";
import { getCurrentProfile, getCurrentUser } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();
  const [comments, user, profile] = await Promise.all([
    getPostComments(post.id),
    getCurrentUser(),
    getCurrentProfile(),
  ]);

  const publishedDate = post.published_at ?? post.created_at;
  const canEdit = profile && ["author", "admin"].includes(profile.role);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: publishedDate,
    dateModified: post.updated_at,
    publisher: { "@type": "Organization", name: "Renhet Studio", url: "https://www.renhetstudio.com" },
    mainEntityOfPage: `https://www.renhetstudio.com/blog/${post.slug}`,
  };

  return (
    <BlogShell profile={profile}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <article className="post-page">
        <header className="post-header">
          <Link className="post-back" href="/blog">← All stories</Link>
          <p className="post-category">{post.category}</p>
          <h1>{post.title}</h1>
          {post.excerpt && <p className="post-deck">{post.excerpt}</p>}
          <time dateTime={publishedDate}>
            {new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(new Date(publishedDate))}
          </time>
          {canEdit && <Link className="post-edit-link" href={`/blog/dashboard/posts/${post.id}`}>Edit this post</Link>}
        </header>
        <RichContent content={post.content} />
      </article>

      <section className="comments" id="comments">
        <div className="comments-inner">
          <div className="comments-heading">
            <h2>Discussion</h2>
            <p>{comments.length} approved {comments.length === 1 ? "comment" : "comments"}</p>
          </div>
          <CommentForm postId={post.id} slug={post.slug} signedIn={Boolean(user)} />
          <ol className="comment-list">
            {comments.map((comment) => (
              <li key={comment.id}>
                <div><strong>{comment.display_name}</strong><time dateTime={comment.created_at}>{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(comment.created_at))}</time></div>
                <p>{comment.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </BlogShell>
  );
}
