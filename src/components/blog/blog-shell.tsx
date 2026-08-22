import type { UserProfile } from "@/lib/blog/types";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

export function BlogShell({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile?: UserProfile | null;
}) {
  return (
    <main className="blog-site min-h-screen w-full max-w-full overflow-x-hidden">
      <SiteHeader profile={profile} />
      {children}
      <SiteFooter />
    </main>
  );
}
