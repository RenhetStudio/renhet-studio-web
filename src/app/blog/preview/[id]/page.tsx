import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogShell } from "@/components/blog/blog-shell";
import { RichContent } from "@/components/blog/rich-content";
import { getPostForEditor } from "@/lib/blog/data";
import { requireAuthor } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Post preview", robots: { index: false, follow: false } };

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const profile = await requireAuthor();
  const { id } = await params;
  const post = await getPostForEditor(id);
  if (!post) notFound();
  return (
    <BlogShell profile={profile}>
      <div className="preview-banner">Private preview · {post.status}</div>
      <article className="post-page">
        <header className="post-header"><p className="post-category">{post.category}</p><h1>{post.title}</h1>{post.excerpt && <p className="post-deck">{post.excerpt}</p>}</header>
        {post.cover_image_url && (
          <figure className="post-cover">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.cover_image_url} alt={post.cover_image_alt || ""} />
          </figure>
        )}
        <RichContent content={post.content} />
      </article>
    </BlogShell>
  );
}
