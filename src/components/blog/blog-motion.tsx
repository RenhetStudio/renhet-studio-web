"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function BlogMotion({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".blog-hero-enter", {
        y: 34,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
      });

      gsap.utils.toArray<HTMLElement>(".blog-reveal-image").forEach((element) => {
        gsap.fromTo(
          element,
          { scale: 0.88, opacity: 0.45 },
          {
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: element, start: "top 92%", end: "center 55%", scrub: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".blog-scrub-copy").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0.18 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: element, start: "top 88%", end: "top 48%", scrub: true },
          },
        );
      });
    },
    { scope },
  );

  return <div ref={scope}>{children}</div>;
}

