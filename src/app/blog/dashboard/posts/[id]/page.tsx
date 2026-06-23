import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostEditor } from "@/components/blog/post-editor";
import { getPostForEditor } from "@/lib/blog/data";
import { requireAuthor } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit blog post", robots: { index: false, follow: false } };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAuthor();
  const { id } = await params;
  const post = await getPostForEditor(id);
  if (!post) notFound();
  return <main className="editor-page"><PostEditor post={post} /></main>;
}

