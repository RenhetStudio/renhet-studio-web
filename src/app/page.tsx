"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

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
    accent: "programming",
  },
  {
    name: "Eunji",
    role: "Artist",
    country: "South Korea",
    href: "https://www.artstation.com/kiwi_lee",
    accent: "art",
  },
  {
    name: "Daniel",
    role: "Composer",
    country: "The Netherlands",
    href: "https://daniel-otten.bandcamp.com/",
    accent: "music",
  },
  {
    name: "Todd",
    role: "Game Designer",
    country: "USA",
    href: "https://nat20.mal.plus/technical-portfolio/",
    accent: "design",
  },
  {
    name: "Ben",
    role: "Sound Designer",
    country: "UK",
    href: "https://benaaronaudio.com/",
    accent: "sound",
  },
  {
    name: "Vaclav",
    role: "Producer",
    country: "Czech Republic",
    href: "https://www.linkedin.com/in/vaclavkorycanek/",
    accent: "production",
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

      gsap.to(".mascot-float", {
        y: -18,
        rotate: 2,
        duration: 2.8,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      gsap.fromTo(
        ".image-scrub",
        { scale: 0.86, opacity: 0.45 },
        {
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".image-scrub",
            start: "top 88%",
            end: "bottom 28%",
            scrub: true,
          },
        },
      );
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
              src="/renhet-logo.png"
              alt="Renhet Studio"
              width={1024}
              height={512}
              priority
              className="h-10 w-auto rounded-full object-contain sm:h-12"
            />
          </a>

          <div className="hidden items-center gap-1 md:flex">
            <a className="nav-link" href="#studio">
              Studio
            </a>
            <a className="nav-link" href="#team">
              Crew
            </a>
            <a className="nav-link" href="#contact">
              Follow
            </a>
          </div>

          <a
            href="https://renhetstudio.itch.io/"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-[#fffdf3] px-5 py-3 text-sm font-black text-[#4f5f70] transition duration-300 hover:-translate-y-0.5 hover:bg-[#b8d4f0]"
          >
            Itch.io
          </a>
        </div>
      </nav>

      <section id="top" className="hero-pond relative isolate min-h-screen px-5 pb-24 pt-32 sm:px-8 lg:px-10">
        <div className="mx-auto flex min-h-[78vh] max-w-[1500px] items-center justify-center">
          <div className="text-center">
            <Image
              src="/renhet-logo.png"
              alt="Renhet Studio logo"
              width={1024}
              height={512}
              priority
              className="hero-enter mx-auto mb-7 w-full max-w-[460px] rounded-[1.8rem] border-2 border-[#fffdf3] shadow-[0_32px_90px_rgba(77,92,108,0.18)]"
            />
            <h1 className="hero-enter mx-auto max-w-[1120px] text-[clamp(3rem,7vw,7rem)] font-black leading-[0.88] tracking-normal text-[#fffdf3] drop-shadow-[0_5px_0_rgba(79,95,112,0.22)]">
              Friendly detailed worlds filled with passion.
            </h1>
            <p className="hero-enter mx-auto mt-6 max-w-2xl text-xl font-bold leading-8 text-[#fffdf3] sm:text-2xl sm:leading-9">
              A tiny indie game studio making warm, handmade things.
            </p>
            <div className="hero-enter mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a className="button-primary" href="#team">
                Meet the crew
              </a>
              <a className="button-secondary" href="#contact">
                Follow along
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="studio" className="px-5 py-24 sm:px-8 md:py-32 lg:px-10">
        <div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[0.52fr_0.48fr] lg:items-center">
          <h2 className="max-w-5xl text-[clamp(2.6rem,6vw,6.2rem)] font-black leading-[0.92] tracking-normal text-[#4f5f70]">
            Small team. Special charm. First game underway.
          </h2>
          <div className="relative min-h-[520px]">
            <div className="image-scrub game-window group absolute inset-x-0 top-0 min-h-[450px] overflow-hidden rounded-[2.25rem] border-2 border-[#d6d5ca] bg-[#8fb8d8] shadow-[0_28px_80px_rgba(79,95,112,0.12)]">
              <div className="game-window-art transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2f3d4b]/76 via-[#2f3d4b]/14 to-transparent" />
              <p className="absolute left-7 top-7 max-w-[15rem] text-3xl font-black leading-none text-[#fffdf3] sm:text-5xl">
                Workbench first. Trailer later.
              </p>
            </div>
            <div className="mascot-float absolute -bottom-2 right-2 h-40 w-40 rounded-[48%_52%_46%_54%] border-4 border-[#fffdf3] bg-[#b8d4f0] shadow-[0_18px_0_rgba(79,95,112,0.22)] sm:h-52 sm:w-52">
              <span className="mascot-eye left-[26%]" />
              <span className="mascot-eye right-[25%]" />
              <span className="absolute bottom-12 left-1/2 h-4 w-8 -translate-x-1/2 rounded-b-full border-b-4 border-[#4f5f70]" />
              <span className="absolute -right-7 bottom-14 h-5 w-12 rotate-[-22deg] rounded-full bg-[#b8d4f0]" />
            </div>
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

          <div className="team-accordion rounded-[2rem] border-2 border-[#d6d5ca]">
            {team.map((member) => (
              <a
                href={member.href}
                target="_blank"
                rel="noreferrer"
                className={`team-panel team-panel-${member.accent} group`}
                key={member.name}
              >
                <div className="team-panel-image transition duration-700 group-hover:scale-105" />
                <div className="team-panel-shade" />
                <div className="team-panel-copy">
                  <p className="team-role">{member.role}</p>
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-country">{member.country}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer id="contact" className="relative overflow-hidden bg-[#4f5f70] px-5 py-24 text-[#fffdf3] sm:px-8 md:py-32 lg:px-10">
        <div className="footer-ripple" />
        <div className="relative mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[0.68fr_0.32fr]">
          <div>
            <Image
              src="/renhet-logo.png"
              alt="Renhet Studio"
              width={1024}
              height={512}
              className="mb-8 w-full max-w-[360px] rounded-[1.7rem] border-2 border-[#fffdf3]/60"
            />
            <h2 className="max-w-4xl text-[clamp(3rem,7vw,7rem)] font-black leading-[0.88] tracking-normal">
              Follow the sparks.
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
