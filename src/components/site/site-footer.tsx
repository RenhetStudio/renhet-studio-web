import Image from "next/image";
import Link from "next/link";

const socialLinks = [
  { label: "X", href: "https://x.com/renhetstudio" },
  { label: "Instagram", href: "https://www.instagram.com/renhet.studio/" },
  { label: "TikTok", href: "https://www.tiktok.com/@renhetstudio" },
  { label: "Itch.io", href: "https://renhetstudio.itch.io/" },
];

const linkClass =
  "group flex min-h-16 items-center justify-between rounded-full border-2 border-[#fffdf3]/40 bg-[#fffdf3] px-6 text-lg font-black text-[#4f5f70] transition duration-300 hover:-translate-y-1 hover:bg-[#b8d4f0]";

export function SiteFooter() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-[#4f5f70] px-5 py-24 text-[#fffdf3] sm:px-8 md:py-32 lg:px-10">
      <div className="footer-ripple" />
      <div className="relative mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[0.68fr_0.32fr]">
        <div>
          <Link href="/" aria-label="Renhet Studio home">
            <Image
              src="/renhet-logo-white.png"
              alt="Renhet Studio"
              width={2048}
              height={1032}
              className="mb-8 w-full max-w-[360px] object-contain"
            />
          </Link>
          <h2 className="max-w-4xl text-[clamp(3rem,7vw,7rem)] font-black leading-[0.88] tracking-normal">
            Follow the adventures.
          </h2>
        </div>

        <div className="flex flex-col justify-end gap-3">
          <Link href="/careers" className={`${linkClass} bg-[#b8d4f0] hover:bg-[#fffdf3]`}>
            Careers
            <span className="transition duration-300 group-hover:translate-x-1">Join us</span>
          </Link>
          <Link href="/blog" className={linkClass}>
            Blog
            <span className="transition duration-300 group-hover:translate-x-1">Read</span>
          </Link>
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className={linkClass}
            >
              {link.label}
              <span className="transition duration-300 group-hover:translate-x-1">Visit</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
