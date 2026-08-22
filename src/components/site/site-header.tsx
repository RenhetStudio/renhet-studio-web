import Image from "next/image";
import Link from "next/link";
import type { UserProfile } from "@/lib/blog/types";
import { signOutAction } from "@/lib/blog/actions";

const navigation = [
  // { label: "Beelze Pub", href: "/#game" },
  // { label: "Crew", href: "/#team" },
  { label: "Renhet Between Builds", href: "/blog" },
  { label: "Careers", href: "/careers" },
  { label: "Follow us", href: "/#contact" },
];

export function SiteHeader({ profile }: { profile?: UserProfile | null }) {
  const canAuthor = profile ? ["author", "admin"].includes(profile.role) : false;

  return (
    <nav className="nav-shell fixed inset-x-0 top-4 z-50 px-4" aria-label="Primary navigation">
      <div className="mx-auto flex min-h-16 w-full max-w-[1180px] items-center justify-between gap-3 rounded-full border-2 border-[#eef0e9] bg-[#627383]/92 px-4 text-[#fffdf3] shadow-[0_18px_60px_rgba(50,62,75,0.16)] backdrop-blur-xl sm:px-5">
        <Link href="/" className="flex items-center gap-3" aria-label="Renhet Studio home">
          <Image
            src="/renhet-logo-white.png"
            alt=""
            width={2048}
            height={1032}
            priority
            className="h-9 w-auto object-contain sm:h-11"
          />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => (
            <Link className="nav-link" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/blog"
            className="rounded-full px-2 py-3 text-xs font-black text-[#fffdf3] transition duration-300 hover:-translate-y-0.5 hover:bg-[#fffdf3]/15 sm:px-3 sm:text-sm md:hidden"
          >
            Blog
          </Link>
          <Link
            href="/careers"
            className="rounded-full px-2 py-3 text-xs font-black text-[#fffdf3] transition duration-300 hover:-translate-y-0.5 hover:bg-[#fffdf3]/15 sm:px-3 sm:text-sm md:hidden"
          >
            Careers
          </Link>
          {canAuthor && (
            <Link
              href="/blog/dashboard"
              className="rounded-full bg-[#fffdf3] px-3 py-3 text-xs font-black text-[#4f5f70] transition duration-300 hover:-translate-y-0.5 hover:bg-[#b8d4f0] sm:px-5 sm:text-sm"
            >
              Dashboard
            </Link>
          )}
          {profile && (
            <>
              <Link
                href="/account"
                title={profile.display_name}
                className="max-w-24 truncate rounded-full px-2 py-3 text-xs font-black text-[#fffdf3] transition duration-300 hover:-translate-y-0.5 hover:bg-[#fffdf3]/15 sm:max-w-40 sm:px-3 sm:text-sm"
              >
                {profile.display_name}
              </Link>
              <form action={signOutAction} className="flex">
                <button
                  type="submit"
                  className="rounded-full px-2 py-3 text-xs font-black text-[#fffdf3] transition duration-300 hover:-translate-y-0.5 hover:bg-[#fffdf3]/15 sm:px-3 sm:text-sm"
                >
                  Sign out
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
