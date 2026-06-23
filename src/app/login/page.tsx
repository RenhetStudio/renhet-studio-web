import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/blog/login-form";
import { getCurrentUser } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const params = await searchParams;
  const next = params.next?.startsWith("/") && !params.next.startsWith("//") ? params.next : "/blog";
  const user = await getCurrentUser();
  if (user) redirect(next);

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <Link href="/blog" className="auth-logo">
          <Image src="/renhet-logo-dark.png" alt="Renhet Studio" width={2048} height={1032} priority />
        </Link>
        <p className="auth-kicker">Renhet Studio community</p>
        <h1>Sign in to the discussion.</h1>
        <p>Use Google or a one-time email link. New comments are reviewed before they become public.</p>
        <LoginForm nextPath={next} />
        <Link className="auth-back" href="/blog">&larr; Return to the blog</Link>
      </section>
      <aside className="auth-art" aria-hidden="true"><span>Make.</span><span>Share.</span><span>Discuss.</span></aside>
    </main>
  );
}
