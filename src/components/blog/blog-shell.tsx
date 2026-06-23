import Image from "next/image";
import Link from "next/link";
import { BLOG_NAME } from "@/lib/blog/config";
import type { UserProfile } from "@/lib/blog/types";
import { signOutAction } from "@/lib/blog/actions";

export function BlogShell({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile?: UserProfile | null;
}) {
  const canAuthor = profile && ["author", "admin"].includes(profile.role);

  return (
    <main className="blog-site min-h-screen w-full max-w-full overflow-x-hidden">
      <nav className="blog-nav-wrap" aria-label="Blog navigation">
        <div className="blog-nav">
          <Link href="/" className="blog-brand" aria-label="Renhet Studio home">
            <Image src="/renhet-logo-white.png" alt="Renhet Studio" width={2048} height={1032} priority />
          </Link>
          <Link href="/blog" className="blog-title-link">{BLOG_NAME}</Link>
          <div className="blog-nav-actions">
            {canAuthor && <Link href="/blog/dashboard">Dashboard</Link>}
            {profile ? (
              <>
                <Link href="/account">{profile.display_name}</Link>
                <form action={signOutAction}>
                  <button type="submit">Sign out</button>
                </form>
              </>
            ) : (
              <Link href="/login?next=/blog">Sign in</Link>
            )}
          </div>
        </div>
      </nav>
      {children}
      <footer className="blog-footer">
        <div>
          <Image src="/renhet-logo-white.png" alt="Renhet Studio" width={2048} height={1032} />
          <h2>Follow the adventures.</h2>
        </div>
        <div className="blog-footer-links">
          <Link href="/">Studio</Link>
          <Link href="/blog">All stories</Link>
          <a href="https://renhetstudio.itch.io/" target="_blank" rel="noreferrer">Itch.io</a>
        </div>
      </footer>
    </main>
  );
}
