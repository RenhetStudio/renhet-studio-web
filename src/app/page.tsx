import Image from "next/image";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

const team = [
  {
    name: "Miguel",
    role: "Team Lead / Programmer",
    country: "Spain",
    href: "https://www.bitemdev.com/",
  },
  {
    name: "Vaclav",
    role: "Producer",
    country: "Czech Republic",
    href: "https://www.linkedin.com/in/vaclavkorycanek/",
  },
  {
    name: "Todd",
    role: "Game Designer",
    country: "USA",
    href: "https://nat20.mal.plus/technical-portfolio/",
  },
  {
    name: "Maurice",
    role: "UI/UX Designer",
    country: "USA",
    href: "https://www.linkedin.com/in/mauricebirchard/",
  },
  {
    name: "Daniël",
    role: "Composer",
    country: "The Netherlands",
    href: "https://daniel-otten.bandcamp.com/",
  },
  {
    name: "Ben",
    role: "Sound Designer",
    country: "UK",
    href: "https://benaaronaudio.com/",
  },
  {
    name: "Freya",
    role: "Marketer & Writer",
    country: "UK",
    href: "https://www.linkedin.com/in/freya-clinton-06383134a/",
  },
  {
    name: "Anton",
    role: "3D Artist",
    country: "Finland",
  },
  {
    name: "Luca",
    role: "Marketer & Content",
    country: "Italy",
    href: "https://drive.google.com/file/d/1heCc9AVpGwAMI5p9Fi_N91vu-Nn-2FFq/view?usp=drivesdk",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Renhet Studio",
  url: "https://www.renhetstudio.com",
  logo: "https://www.renhetstudio.com/renhet-logo-dark.png",
  description: "An independent international game studio making warm, handmade games.",
  sameAs: [
    "https://x.com/renhetstudio",
    "https://www.instagram.com/renhet.studio/",
    "https://www.reddit.com/user/RenhetStudio/",
    "https://www.tiktok.com/@renhetstudio",
    "https://renhetstudio.itch.io/",
  ],
};

export default function Home() {
  return (
    <main
      className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f6f1e8] text-[#4f5f70]"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <SiteHeader />

      <section id="top" className="hero-pond relative isolate min-h-screen px-5 pb-24 pt-32 sm:px-8 lg:px-10">
        <div className="mx-auto flex min-h-[78vh] max-w-[1500px] items-center justify-center">
          <div className="text-center">
            {/* <Image
              src="/renhet-logo-dark.png"
              alt="Renhet Studio logo"
              width={2048}
              height={1032}
              priority
              className="hero-enter mx-auto mb-7 w-full max-w-[460px] object-contain drop-shadow-[0_18px_42px_rgba(77,92,108,0.24)]"
            /> */}
            <h1 className="hero-enter mx-auto max-w-[1120px] text-[clamp(3rem,7vw,7rem)] font-black leading-[0.88] tracking-normal text-[#fffdf3] drop-shadow-[0_5px_0_rgba(79,95,112,0.22)]">
              Friendly detailed worlds filled with passion.
            </h1>
            <p className="hero-enter mx-auto mt-6 max-w-2xl text-xl font-bold leading-8 text-[#fffdf3] sm:text-2xl sm:leading-9">
              A tiny indie game studio making warm, handmade things.
            </p>
            <div className="hero-enter mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              {/* <a className="button-primary" href="#game">
                Play our first game
              </a> */}
              {/* <a className="button-secondary" href="#team">
                Meet the crew
              </a> */}
            </div>
          </div>
        </div>
      </section>

      <section id="game" className="px-5 py-24 sm:px-8 md:py-32 lg:px-10">
        <div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[0.52fr_0.48fr] lg:items-center">
          <div>
            <h2 className="max-w-5xl text-[clamp(2.6rem,6vw,6.2rem)] font-black leading-[0.92] tracking-normal text-[#4f5f70]">
              Our first game is out now.
            </h2>
            <p className="mt-6 max-w-xl text-lg font-bold leading-8 text-[#627383] sm:text-xl">
              Mix drinks, serve customers, and keep the business running as Skelly, a laid-back skeletender filling in at Beelze Pub for the weekend.
            </p>
            <div className="mt-8 flex max-w-xl justify-center">
              <a
                href="https://renhetstudio.itch.io/beelze-pub"
                target="_blank"
                rel="noreferrer"
                className="button-primary"
              >
                Play free on Itch.io
              </a>
            </div>
          </div>
          <div className="flex min-h-[420px] items-center justify-center">
            <Image
              src="/beelze-pub/logo.png"
              alt="Beelze Pub"
              width={558}
              height={558}
              className="game-logo-float h-auto w-full max-w-[420px] object-contain drop-shadow-[0_24px_28px_rgba(79,95,112,0.18)]"
            />
          </div>
        </div>
      </section>

      <section id="team" className="px-5 py-24 sm:px-8 md:py-32 lg:px-10">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-12 grid gap-5 lg:grid-cols-[0.44fr_0.56fr] lg:items-end">
            <h2 className="text-[clamp(2.8rem,6.2vw,7rem)] font-black leading-[0.9] tracking-normal text-[#4f5f70]">
              The crew.
            </h2>
          </div>

          <ul className="team-grid">
            {team.map((member) => (
              <li key={member.name}>
                <a
                  href={member.href}
                  target="_blank"
                  rel="noreferrer"
                  className="team-panel"
                >
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p className="team-country">{member.country}</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
