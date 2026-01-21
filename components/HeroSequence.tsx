"use client";

import { useRef, useState, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { rushImages, heroImage } from "@/lib/shows";
import { prefersReducedMotion } from "@/lib/animations";

gsap.registerPlugin(useGSAP);

interface HeroSequenceProps {
  isActive: boolean;
  onRushComplete: () => void;
}

// Rush images for the horizontal scroll animation
const RUSH_IMAGES = rushImages.slice(0, 5);

export default function HeroSequence({ isActive, onRushComplete }: HeroSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const rushTrackRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<"rush" | "hero">("rush");
  const hasRunRush = useRef(false);

  // Lock scroll when active until rush completes
  useLayoutEffect(() => {
    if (isActive && phase === "rush") {
      window.scrollTo(0, 0);
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    }
  }, [isActive, phase]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  // Unlock scroll when rush completes
  useEffect(() => {
    if (phase === "hero") {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
  }, [phase]);

  useGSAP(
    () => {
      if (!isActive || !containerRef.current || !frameRef.current || !rushTrackRef.current || !heroImageRef.current) return;
      if (hasRunRush.current) return;
      hasRunRush.current = true;

      const reducedMotion = prefersReducedMotion();

      // Hide text initially
      if (heroTextRef.current) gsap.set(heroTextRef.current, { opacity: 0 });

      if (reducedMotion) {
        gsap.set(frameRef.current, { width: "100%", height: "100%" });
        gsap.set(rushTrackRef.current, { opacity: 0 });
        if (heroTextRef.current) gsap.set(heroTextRef.current, { opacity: 1 });
        setPhase("hero");
        onRushComplete();
        return;
      }

      const tl = gsap.timeline();

      // Initial state
      gsap.set(frameRef.current, { width: "92vw", height: "90vh" });
      gsap.set(rushTrackRef.current, { x: 0 });

      const calcFinalX = () => {
        if (!rushTrackRef.current) return 0;
        return -rushTrackRef.current.scrollWidth;
      };

      // Rush slides left while frame expands
      tl.to(rushTrackRef.current, {
        x: calcFinalX,
        duration: 2.8,
        ease: "power1.inOut",
      });

      tl.to(frameRef.current, {
        width: "100vw",
        height: "100vh",
        duration: 2.8,
        ease: "power1.inOut",
      }, "<");

      // Hide rush track after animation
      tl.set(rushTrackRef.current, { display: "none" });

      // Transition to hero phase and signal rush complete
      tl.call(() => {
        setPhase("hero");
        onRushComplete();
      });

      // Fade in text
      tl.to(heroTextRef.current, {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      });
    },
    { scope: containerRef, dependencies: [isActive] }
  );

  if (!isActive) return null;

  return (
    <div ref={containerRef} className="relative h-screen bg-primary overflow-hidden">
      <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">

        {/* Frame container */}
        <div
          ref={frameRef}
          className="relative overflow-hidden bg-primary"
          style={{ width: "92vw", height: "90vh" }}
        >
          {/* HERO IMAGE - centered */}
          <div
            ref={heroImageRef}
            className="absolute top-1/2 left-1/2 w-full h-full"
            style={{ transform: "translate(-50%, -50%)" }}
          >
            <Image
              src={heroImage}
              alt="Featured Concert Photography"
              fill
              className="object-cover"
              priority
              quality={90}
            />
          </div>

          {/* RUSH TRACK - slides over hero, then hides */}
          <div
            ref={rushTrackRef}
            className="absolute top-1/2 left-0 -translate-y-1/2 flex items-stretch will-change-transform z-[80] gap-0"
            style={{ width: "fit-content", height: "110vh" }}
          >
            <div className="relative flex-shrink-0 bg-primary" style={{ width: "100vw", height: "110vh" }} />
            {RUSH_IMAGES.map((src, index) => (
              <div key={index} className="relative flex-shrink-0 -ml-px" style={{ width: "40vw", height: "110vh" }}>
                <img src={src} alt="" className="w-full h-full object-cover" loading="eager" />
              </div>
            ))}
          </div>
        </div>

        {/* HERO TEXT */}
        <div ref={heroTextRef} className="absolute inset-0 flex flex-col items-center justify-center z-[60] pointer-events-none opacity-0">
          <h1 className="font-display text-center leading-[0.85]">
            <span className="block text-[clamp(3rem,12vw,10rem)] text-[#F39C32] font-black tracking-tight">ACE</span>
            <span className="block text-[clamp(2rem,8vw,7rem)] text-[#F39C32] font-black tracking-tight">SUASOLA</span>
          </h1>
        </div>

        {/* Bottom gradient fade to dark */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[30vh] pointer-events-none z-[50]"
          style={{
            background: "linear-gradient(to bottom, transparent 0%, rgba(28, 28, 28, 0.6) 50%, rgb(28, 28, 28) 100%)"
          }}
        />
      </div>
    </div>
  );
}
