import type { Metadata } from "next";
import { PostEditor } from "@/components/blog/post-editor";
import { requireAuthor } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "New blog post", robots: { index: false, follow: false } };

export default async function NewPostPage() {
  await requireAuthor();
  return <main className="editor-page"><PostEditor /></main>;
}

