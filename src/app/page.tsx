"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";

const studioLinks = [
  { label: "X", href: "https://x.com/renhetstudio" },
  { label: "Instagram", href: "https://www.instagram.com/renhet.studio/" },
  { label: "Itch.io", href: "https://renhetstudio.itch.io/" },
];

const team = [
  {
    name: "Miguel",
    role: "Team Lead / Programmer",
    country: "Spain",
    href: "https://www.bitemdev.com/",
  },
  {
    name: "Jay",
    role: "Artist",
    country: "South Korea",
    href: "https://www.artstation.com/kiwi_lee",
  },
  {
    name: "Habin",
    role: "Animator",
    country: "South Korea",
    href: "https://www.notion.so/Habin-Yoon_Portfolio-c07cfee2d7fc828880a281241bc94189",
  },
  {
    name: "Daniël",
    role: "Composer",
    country: "The Netherlands",
    href: "https://daniel-otten.bandcamp.com/",
  },
  {
    name: "Todd",
    role: "Game Designer",
    country: "USA",
    href: "https://nat20.mal.plus/technical-portfolio/",
  },
  {
    name: "Ben",
    role: "Sound Designer",
    country: "UK",
    href: "https://benaaronaudio.com/",
  },
  {
    name: "Vaclav",
    role: "Producer",
    country: "Czech Republic",
    href: "https://www.linkedin.com/in/vaclavkorycanek/",
  },
  {
    name: "Freya",
    role: "Marketer",
    country: "UK",
    href: "https://www.linkedin.com/in/freya-clinton-06383134a/",
  },
  {
    name: "Jun",
    role: "VFX Artist",
    country: "South Korea",
    href: "https://www.linkedin.com/in/gwngjun-lee-477ba5139/",
  },
];

export default function Home() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".nav-shell", {
        y: -22,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      });

      gsap.from(".hero-enter", {
        y: 34,
        opacity: 0,
        duration: 0.95,
        stagger: 0.09,
        ease: "power3.out",
      });

      gsap.to(".game-logo-float", {
        y: -14,
        rotate: 1.2,
        duration: 3.2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    },
    { scope: root },
  );

  return (
    <main
      ref={root}
      className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f6f1e8] text-[#4f5f70]"
    >
      <nav className="nav-shell fixed inset-x-0 top-4 z-50 px-4">
        <div className="mx-auto flex min-h-16 w-full max-w-[1180px] items-center justify-between gap-3 rounded-full border-2 border-[#eef0e9] bg-[#627383]/92 px-4 text-[#fffdf3] shadow-[0_18px_60px_rgba(50,62,75,0.16)] backdrop-blur-xl sm:px-5">
          <a href="#top" className="flex items-center gap-3">
            <Image
              src="/renhet-logo-white.png"
              alt="Renhet Studio"
              width={2048}
              height={1032}
              priority
              className="h-9 w-auto object-contain sm:h-11"
            />
          </a>

          <div className="hidden items-center gap-1 md:flex">
            <a className="nav-link" href="#game">
              Beelze Pub
            </a>
            <a className="nav-link" href="#team">
              Crew
            </a>
            <a className="nav-link" href="#contact">
              Follow
            </a>
          </div>

          <a
            href="https://renhetstudio.itch.io/beelze-pub"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-[#fffdf3] px-5 py-3 text-sm font-black text-[#4f5f70] transition duration-300 hover:-translate-y-0.5 hover:bg-[#b8d4f0]"
          >
            Play now
          </a>
        </div>
      </nav>

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
              <a className="button-primary" href="#game">
                Play our first game
              </a>
              <a className="button-secondary" href="#team">
                Meet the crew
              </a>
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

      <footer id="contact" className="relative overflow-hidden bg-[#4f5f70] px-5 py-24 text-[#fffdf3] sm:px-8 md:py-32 lg:px-10">
        <div className="footer-ripple" />
        <div className="relative mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[0.68fr_0.32fr]">
          <div>
            <Image
              src="/renhet-logo-white.png"
              alt="Renhet Studio"
              width={2048}
              height={1032}
              className="mb-8 w-full max-w-[360px] object-contain"
            />
            <h2 className="max-w-4xl text-[clamp(3rem,7vw,7rem)] font-black leading-[0.88] tracking-normal">
              Follow the adventures.
            </h2>
          </div>

          <div className="flex flex-col justify-end gap-3">
            {studioLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="group flex min-h-16 items-center justify-between rounded-full border-2 border-[#fffdf3]/40 bg-[#fffdf3] px-6 text-lg font-black text-[#4f5f70] transition duration-300 hover:-translate-y-1 hover:bg-[#b8d4f0]"
              >
                {link.label}
                <span className="transition duration-300 group-hover:translate-x-1">Visit</span>
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
