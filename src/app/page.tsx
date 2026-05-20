const socialLinks = [
  {
    label: "X / Twitter",
    href: "https://x.com/renhetstudio",
  },
  {
    label: "Instagram",
    href: "https://instagram.com/renhetstudio",
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@renhetstudio",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@renhetstudio",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8">
        <header className="flex items-center justify-between">
          <a href="#" className="text-sm font-semibold uppercase tracking-[0.3em]">
            Renhet Studio
          </a>

          <nav className="hidden items-center gap-6 text-sm text-neutral-400 md:flex">
            <a href="#about" className="transition hover:text-neutral-100">
              About
            </a>
            <a href="#games" className="transition hover:text-neutral-100">
              Games
            </a>
            <a href="#contact" className="transition hover:text-neutral-100">
              Contact
            </a>
          </nav>
        </header>

        <div className="grid flex-1 items-center gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <section>
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.35em] text-neutral-500">
              Independent Game Studio
            </p>

            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-balance md:text-7xl">
              Crafting atmospheric games with memorable worlds.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-400">
              Renhet Studio is an independent video game studio focused on
              evocative worlds, strong visual identity, and carefully designed
              interactive experiences.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#games"
                className="rounded-full bg-neutral-100 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-white"
              >
                View our work
              </a>
              <a
                href="mailto:hello@renhetstudio.com"
                className="rounded-full border border-neutral-800 px-6 py-3 text-sm font-semibold text-neutral-100 transition hover:border-neutral-500"
              >
                Contact us
              </a>
            </div>
          </section>

          <aside className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 shadow-2xl">
            <div className="aspect-square rounded-2xl border border-neutral-800 bg-[radial-gradient(circle_at_top_left,_#525252,_transparent_35%),linear-gradient(135deg,_#171717,_#0a0a0a)] p-6">
              <div className="flex h-full flex-col justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
                    First project
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold">
                    Currently in development
                  </h2>
                </div>

                <p className="max-w-sm text-sm leading-6 text-neutral-400">
                  More details will be shared when the project is ready for its
                  first public reveal.
                </p>
              </div>
            </div>
          </aside>
        </div>

        <section id="about" className="border-t border-neutral-900 py-20">
          <div className="grid gap-8 md:grid-cols-[0.4fr_0.6fr]">
            <h2 className="text-2xl font-semibold">About</h2>
            <p className="text-lg leading-8 text-neutral-400">
              We are building games with a focus on atmosphere, mood, and
              player-driven discovery. This website will evolve alongside the
              studio and our first announced project.
            </p>
          </div>
        </section>

        <section id="games" className="border-t border-neutral-900 py-20">
          <div className="grid gap-8 md:grid-cols-[0.4fr_0.6fr]">
            <h2 className="text-2xl font-semibold">Games</h2>
            <div className="rounded-2xl border border-neutral-800 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
                Unannounced
              </p>
              <h3 className="mt-3 text-2xl font-semibold">
                First title in development
              </h3>
              <p className="mt-4 leading-7 text-neutral-400">
                Our first game is currently in early development. Follow Renhet
                Studio for future updates.
              </p>
            </div>
          </div>
        </section>

        <section id="contact" className="border-t border-neutral-900 py-20">
          <div className="grid gap-8 md:grid-cols-[0.4fr_0.6fr]">
            <h2 className="text-2xl font-semibold">Contact</h2>
            <div>
              <a
                href="mailto:hello@renhetstudio.com"
                className="text-lg font-medium text-neutral-100 underline underline-offset-4"
              >
                hello@renhetstudio.com
              </a>

              <div className="mt-8 flex flex-wrap gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="rounded-full border border-neutral-800 px-4 py-2 text-sm text-neutral-300 transition hover:border-neutral-500 hover:text-neutral-100"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}