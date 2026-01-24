"use client";

import { useRef, useState, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { rushImages } from "@/lib/shows";
import { prefersReducedMotion } from "@/lib/animations";

gsap.registerPlugin(useGSAP);

interface HeroSequenceProps {
  isActive: boolean;
  onRushComplete: () => void;
}

const RUSH_IMAGES = rushImages.slice(0, 6);

// Use higher quality ace.jpg image
const heroImage = "/images/newpics/ace.jpg";

// Check if on mobile device
const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

export default function HeroSequence({ isActive, onRushComplete }: HeroSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const rushTrackRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<"rush" | "hero">("rush");
  const hasRunRush = useRef(false);

  useLayoutEffect(() => {
    if (isActive && phase === "rush") {
      window.scrollTo(0, 0);
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    }
  }, [isActive, phase]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

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
      if (nameRef.current) gsap.set(nameRef.current, { opacity: 0, y: 60 });
      if (subtitleRef.current) gsap.set(subtitleRef.current, { opacity: 0, y: 30 });
      if (scrollIndicatorRef.current) gsap.set(scrollIndicatorRef.current, { opacity: 0 });

      if (reducedMotion) {
        gsap.set(frameRef.current, { width: "100%", height: "100%", borderRadius: "0px" });
        gsap.set(rushTrackRef.current, { opacity: 0, display: "none" });
        if (heroImageRef.current) gsap.set(heroImageRef.current, { opacity: 1 });
        if (gradientRef.current) gsap.set(gradientRef.current, { yPercent: 0, opacity: 1 });
        if (nameRef.current) gsap.set(nameRef.current, { opacity: 1, y: 0 });
        if (subtitleRef.current) gsap.set(subtitleRef.current, { opacity: 1, y: 0 });
        if (scrollIndicatorRef.current) gsap.set(scrollIndicatorRef.current, { opacity: 1 });
        setPhase("hero");
        onRushComplete();
        return;
      }

      const tl = gsap.timeline();
      const mobile = isMobile();

      // Responsive initial sizing
      const initialWidth = mobile ? "92vw" : "85vw";
      const initialHeight = mobile ? "65vh" : "75vh";

      // Set initial state with GPU acceleration
      gsap.set(frameRef.current, {
        width: initialWidth,
        height: initialHeight,
        borderRadius: "12px",
        force3D: true,
      });
      gsap.set(rushTrackRef.current, { x: 0, force3D: true });
      gsap.set(heroImageRef.current, { opacity: 0 });
      if (gradientRef.current) gsap.set(gradientRef.current, { yPercent: 100, opacity: 0 });

      const calcFinalX = () => {
        if (!rushTrackRef.current) return 0;
        return -rushTrackRef.current.scrollWidth;
      };

      // Rush animation - faster on mobile for better UX
      const rushDuration = mobile ? 1.4 : 2.2;
      const expandDuration = mobile ? 0.8 : 1.2;

      // Rush animation
      tl.to(rushTrackRef.current, {
        x: calcFinalX,
        duration: rushDuration,
        ease: "power3.inOut",
      });

      // Fade out rush track completely first
      tl.to(rushTrackRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
      }, `-=0.5`);

      // Fade in hero image as rush track fades
      tl.to(heroImageRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.inOut",
      }, "-=0.3");

      // Hide rush track
      tl.set(rushTrackRef.current, { display: "none" });

      // Frame expands to full screen - slightly delayed for cleaner transition
      tl.to(frameRef.current, {
        width: "100vw",
        height: "100vh",
        borderRadius: "0px",
        duration: expandDuration,
        ease: "power3.out",
      }, "-=0.3");

      tl.call(() => {
        setPhase("hero");
        onRushComplete();
      }, [], "-=0.4");

      // Gradient slides up from bottom
      tl.to(gradientRef.current, {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      }, "-=0.5");

      // Text reveal starts during frame expansion for seamless feel
      tl.to(nameRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      }, "-=0.8");

      tl.to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
      }, "-=0.5");

      tl.to(scrollIndicatorRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      }, "-=0.3");
    },
    { scope: containerRef, dependencies: [isActive] }
  );

  if (!isActive) return null;

  return (
    <div ref={containerRef} className="relative h-screen bg-primary">
      <div className="fixed inset-0 h-screen w-full flex items-center justify-center overflow-hidden z-0">

        {/* Frame container - responsive initial sizing */}
        <div
          ref={frameRef}
          className="relative overflow-hidden bg-primary w-[92vw] md:w-[85vw] h-[65vh] md:h-[75vh] rounded-xl"
        >
          {/* Hero image - flipped horizontally, unoptimized for full quality */}
          <div
            ref={heroImageRef}
            className="absolute inset-0 w-full h-full opacity-0"
          >
            <Image
              src={heroImage}
              alt="Ace Suasola Photography"
              fill
              className="object-cover"
              style={{ transform: "scaleX(-1)", objectPosition: "center 35%" }}
              priority
              quality={100}
              sizes="100vw"
              unoptimized
            />
            {/* Gradient overlay for text readability - animates up */}
            <div
              ref={gradientRef}
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-[30]"
              style={{ transform: "translateY(100%)", opacity: 0 }}
            />
            <div className="absolute inset-0 bg-black/10 z-[25]" />
          </div>

          {/* Rush track - responsive image sizing */}
          <div
            ref={rushTrackRef}
            className="absolute top-0 left-0 flex items-stretch will-change-transform z-[80] gap-1"
            style={{ width: "fit-content", height: "100%" }}
          >
            <div className="relative flex-shrink-0 bg-primary w-screen" style={{ height: "100%" }} />
            {RUSH_IMAGES.map((src, index) => (
              <div key={index} className="relative flex-shrink-0 w-[70vw] md:w-[50vw]" style={{ height: "100%" }}>
                <img src={src} alt="" className="w-full h-full object-cover" loading="eager" />
              </div>
            ))}
          </div>
        </div>

        {/* Name overlay - centered on mobile, lower-center on desktop */}
        <div className="absolute inset-0 flex items-center justify-center md:items-end md:justify-start p-4 sm:p-8 md:p-16 md:pb-[20vh] z-[40] pointer-events-none">
          <div className="text-center md:text-left">
            <div ref={nameRef} className="opacity-0">
              {/* One line on mobile, stacked on desktop */}
              <h1 className="font-display font-bold tracking-tight leading-[0.85] text-white">
                <span className="md:hidden text-[clamp(2.2rem,11vw,14rem)]">ACE SUASOLA</span>
                <span className="hidden md:block text-[clamp(3.5rem,15vw,14rem)]">ACE</span>
              </h1>
              <h1 className="hidden md:block font-display text-[clamp(2rem,8vw,7rem)] font-bold tracking-tight leading-[0.85] text-white -mt-2">
                SUASOLA
              </h1>
            </div>
            <div ref={subtitleRef} className="opacity-0 mt-4 sm:mt-6 md:mt-8 flex flex-col md:flex-row md:items-center gap-1 md:gap-6">
              <p className="font-body text-xs sm:text-sm md:text-lg text-yellow-500/70 tracking-widest uppercase">
                Concert & Event Photography
              </p>
              <span className="hidden md:block w-px h-4 bg-yellow-500/40" />
              <p className="font-body text-xs sm:text-sm md:text-lg text-yellow-500/70 tracking-widest uppercase">
                Vancouver, BC
              </p>
            </div>
          </div>
        </div>

        {/* Scroll indicator - bottom right, hidden on small mobile */}
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 md:right-16 z-[40] opacity-0 hidden sm:block"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="font-mono text-xs text-white/40 tracking-widest uppercase">Scroll</span>
            <div className="w-px h-8 sm:h-12 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
