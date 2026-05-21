"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const studioLinks = [
  { label: "X", href: "https://x.com/renhetstudio" },
  { label: "Instagram", href: "https://www.instagram.com/renhet.studio/" },
  { label: "Itch.io", href: "https://renhetstudio.itch.io/" },
];

const team = [
  {
    name: "Miguel Diaz",
    role: "Team Lead / Programmer",
    country: "Spain",
    href: "https://www.bitemdev.com/",
    accent: "programming",
    description:
      "Miguel keeps the studio moving with gameplay code, tools, and a practical eye for how ideas become playable. He likes systems that serve the player first: clear, responsive, and easy for the team to build on.",
  },
  {
    name: "Eunji Lee",
    role: "Artist",
    country: "South Korea",
    href: "https://www.artstation.com/kiwi_lee",
    accent: "art",
    description:
      "Eunji shapes the worlds by hand, bringing six years of studio craft into a smaller space where taste can lead. Her work leans toward distinctive silhouettes, strange charm, and art direction with a pulse of its own.",
  },
  {
    name: "Daniël Otten",
    role: "Composer",
    country: "The Netherlands",
    href: "https://daniel-otten.bandcamp.com/",
    accent: "music",
    description:
      "Daniël writes for feeling: quiet wonder, pressure, relief, and the moments between them. His orchestral instincts give Renhet's games a musical voice that can carry story without crowding the scene.",
  },
  {
    name: "Todd Rich",
    role: "Game Designer",
    country: "USA",
    href: "https://nat20.mal.plus/technical-portfolio/",
    accent: "design",
    description:
      "Todd builds from deep game literacy, tabletop structure, and an appetite for systems that players can test, bend, and remember. He brings the kind of design focus that turns a world into a place with rules worth learning.",
  },
  {
    name: "Ben Aaron",
    role: "Sound Designer",
    country: "UK",
    href: "https://benaaronaudio.com/",
    accent: "sound",
    description:
      "Ben gives the studio's spaces weight and texture through interactive audio, live-production discipline, and engine-aware sound design. His work is built for games that need atmosphere to react, not just decorate.",
  },
  {
    name: "Václav Koryčánek",
    role: "Producer",
    country: "Czech Republic",
    href: "https://www.linkedin.com/in/vaclavkorycanek/",
    accent: "production",
    description:
      "Václav brings eleven years in games and the steady enthusiasm of someone who still plays with curiosity. He helps turn creative ambition into schedules, decisions, and the kind of production rhythm small teams need.",
  },
];

const principles = [
  {
    title: "Small team, clear authorship",
    text: "Each discipline has a strong voice, and the work gets better because those voices stay close to the game.",
  },
  {
    title: "Worlds with texture",
    text: "Art, sound, music, and systems are treated as one atmosphere instead of separate layers.",
  },
  {
    title: "Playable before precious",
    text: "Ideas earn their place through feel, readability, and the moments players remember after closing the game.",
  },
  {
    title: "Genre without a cage",
    text: "The studio follows the project, not a formula, while keeping a recognizable taste for mood and craft.",
  },
];

const craftWords =
  "Renhet Studio is a small international team making games with handmade worlds, expressive systems, and audio that moves with the player. The aim is not to look bigger than we are. It is to make every choice feel deliberate.".split(
    " ",
  );

const marqueeItems = [
  "Atmosphere",
  "Systems",
  "Illustration",
  "Music",
  "Interactive Audio",
  "Production",
  "Worldbuilding",
  "Player Feel",
];

export default function Home() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".nav-shell", {
        y: -24,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      });

      gsap.from(".hero-copy > *", {
        y: 28,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
      });

      gsap.to(".craft-word", {
        opacity: 1,
        y: 0,
        stagger: 0.025,
        ease: "none",
        scrollTrigger: {
          trigger: ".craft-reveal",
          start: "top 72%",
          end: "bottom 48%",
          scrub: true,
        },
      });

      gsap.utils.toArray<HTMLElement>(".motion-image").forEach((image) => {
        gsap.fromTo(
          image,
          { scale: 0.86, opacity: 0.42 },
          {
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: image,
              start: "top 88%",
              end: "bottom 18%",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <main ref={root} className="w-full max-w-full overflow-x-hidden bg-[#F8F7F2] text-[#5F6C7B]">
      <nav className="nav-shell fixed inset-x-0 top-0 z-50 border-b border-[#5F6C7B]/14 bg-[#F8F7F2]/92 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 w-full max-w-[1500px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
          <a href="#top" className="nav-identity text-[#344253]">
            <span className="text-base font-semibold leading-none">Renhet Studio</span>
            <span className="hidden text-xs font-medium text-[#5F6C7B]/72 sm:block">
              Independent game studio
            </span>
          </a>

          <div className="flex items-center gap-2">
            <div className="nav-center hidden items-center md:flex">
              <a href="#craft">Craft</a>
              <a href="#team">Team</a>
              <a href="#contact">Contact</a>
            </div>
            <a
              href="https://renhetstudio.itch.io/"
              target="_blank"
              rel="noreferrer"
              className="nav-external text-[#F8F7F2]"
            >
              Itch.io
            </a>
          </div>
        </div>
      </nav>

      <section id="top" className="relative min-h-screen px-5 pb-24 pt-28 sm:px-8 lg:px-10">
        <div className="hero-field absolute inset-0" />
        <div className="relative mx-auto grid min-h-[78vh] max-w-[1500px] items-center gap-10 lg:grid-cols-[0.58fr_0.42fr]">
          <div className="hero-copy">
            <p className="max-w-xl text-base leading-7 text-[#5F6C7B] md:text-lg">
              An independent game studio making warm, tactile worlds with a small team and a clear point of view.
            </p>
            <h1 className="mt-7 max-w-6xl text-[clamp(3rem,7vw,7.4rem)] font-semibold leading-[0.92] tracking-normal text-[#344253]">
              Games shaped by hand, sound, and systems.
            </h1>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="#team"
                className="inline-flex min-h-12 items-center justify-center bg-[#5F6C7B] px-7 text-sm font-semibold text-[#F8F7F2] transition hover:-translate-y-0.5 hover:bg-[#344253]"
              >
                Meet the team
              </a>
              <a
                href="#craft"
                className="inline-flex min-h-12 items-center justify-center border border-[#5F6C7B]/25 bg-[#F8F7F2] px-7 text-sm font-semibold text-[#344253] transition hover:-translate-y-0.5 hover:border-[#5F6C7B]"
              >
                Read the studio note
              </a>
            </div>
          </div>

          <div className="motion-image hero-image studio-surface group relative min-h-[440px] overflow-hidden bg-[#A7C7E7] md:min-h-[620px]">
            <div className="absolute bottom-0 left-0 max-w-sm p-7 text-[#F8F7F2]">
              <p className="text-2xl font-semibold leading-tight">The work leads: people, systems, and worlds taking shape.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="craft" className="px-5 py-32 sm:px-8 md:py-48 lg:px-10">
        <div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[0.36fr_0.64fr]">
          <div className="sticky top-28 h-fit">
            <p className="text-sm font-semibold text-[#344253]">The studio note</p>
            <div className="mt-5 h-px w-full bg-[#5F6C7B]/20" />
          </div>
          <p className="craft-reveal max-w-5xl text-[clamp(2.2rem,5vw,5.6rem)] font-semibold leading-[1.02] tracking-normal text-[#344253]">
            {craftWords.map((word, index) => (
              <span className="craft-word inline-block translate-y-3 opacity-30" key={`${word}-${index}`}>
                {word}&nbsp;
              </span>
            ))}
          </p>
        </div>
      </section>

      <section className="bg-[#A7C7E7]/36 px-5 py-32 sm:px-8 md:py-48 lg:px-10">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-12 max-w-5xl">
            <h2 className="text-[clamp(2.5rem,6vw,6.4rem)] font-semibold leading-[0.98] tracking-normal text-[#344253]">
              Built around a team that can actually make the thing.
            </h2>
          </div>

          <div className="grid-flow-dense grid gap-3 md:grid-cols-6">
            {principles.map((principle) => (
              <article
                key={principle.title}
                className={[
                  "group overflow-hidden border border-[#5F6C7B]/14 bg-[#F8F7F2] p-7 shadow-[0_28px_80px_rgba(95,108,123,0.09)]",
                  "md:col-span-3",
                ].join(" ")}
              >
                <div className="mb-12 h-2 w-16 bg-[#A7C7E7] transition duration-700 group-hover:w-28" />
                <h3 className="max-w-sm text-2xl font-semibold leading-tight text-[#344253]">{principle.title}</h3>
                <p className="mt-5 max-w-md text-base leading-7">{principle.text}</p>
              </article>
            ))}
            <article className="motion-image studio-surface group relative min-h-[360px] overflow-hidden border border-[#5F6C7B]/14 bg-[#5F6C7B] md:col-span-6">
              <p className="absolute bottom-7 left-7 max-w-2xl text-3xl font-semibold leading-tight text-[#F8F7F2] md:text-5xl">
                Fewer layers between taste, decision, and implementation.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="team" className="px-5 py-32 sm:px-8 md:py-48 lg:px-10">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-16 grid gap-8 lg:grid-cols-[0.42fr_0.58fr]">
            <h2 className="text-[clamp(2.6rem,6vw,6.8rem)] font-semibold leading-[0.95] tracking-normal text-[#344253]">
              The people behind Renhet.
            </h2>
            <p className="max-w-3xl text-xl leading-9">
              Renhet is spread across Europe, Asia, and the United States. The shared language is craft: tools that make iteration easier, art with a strong silhouette, music that carries emotion, sound that responds, design with teeth, and production that keeps it all moving.
            </p>
          </div>

          <div className="team-accordion">
            {team.map((member) => (
              <a
                href={member.href}
                target="_blank"
                rel="noreferrer"
                className={`team-panel team-panel-${member.accent} group`}
                key={member.name}
              >
                <div className="team-panel-image" />
                <div className="team-panel-shade" />
                <div className="team-panel-copy">
                  <p className="text-sm font-semibold text-[#A7C7E7]">{member.role}</p>
                  <h3 className="mt-2 text-[clamp(1.85rem,2.65vw,3.25rem)] font-semibold leading-[0.94] text-[#F8F7F2]">{member.name}</h3>
                  <p className="mt-2 text-sm text-[#F8F7F2]/80">{member.country}</p>
                  <p className="mt-6 max-w-xl text-base leading-7 text-[#F8F7F2]/92">{member.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-y border-[#5F6C7B]/15 bg-[#344253] py-10 text-[#F8F7F2]">
        <div className="marquee-track flex w-max gap-10 text-4xl font-semibold md:text-7xl">
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <span className="whitespace-nowrap" key={`${item}-${index}`}>
              {item}
            </span>
          ))}
        </div>
      </section>

      <section id="contact" className="px-5 py-32 sm:px-8 md:py-48 lg:px-10">
        <div className="mx-auto grid max-w-[1500px] gap-12 border-t border-[#5F6C7B]/20 pt-14 lg:grid-cols-[0.7fr_0.3fr]">
          <div>
            <h2 className="max-w-5xl text-[clamp(2.8rem,7vw,7rem)] font-semibold leading-[0.95] tracking-normal text-[#344253]">
              The first worlds are still quiet.
            </h2>
            <p className="mt-8 max-w-2xl text-xl leading-9">
              Renhet Studio will share projects when they can speak with the quality they deserve. Until then, follow the studio and the team as the foundation comes together.
            </p>
          </div>

          <div className="flex flex-col justify-end gap-3">
            {studioLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="group flex min-h-14 items-center justify-between border border-[#5F6C7B]/20 bg-[#F8F7F2] px-5 font-semibold text-[#344253] transition hover:-translate-y-0.5 hover:border-[#5F6C7B]"
              >
                {link.label}
                <span className="transition group-hover:translate-x-1">Visit</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
