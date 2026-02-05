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
  const kenBurnsRef = useRef<HTMLDivElement>(null);
  const rushTrackRef = useRef<HTMLDivElement>(null);
  const rushHeroRef = useRef<HTMLDivElement>(null);
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
      if (!isActive || !containerRef.current || !frameRef.current || !rushTrackRef.current || !heroImageRef.current || !rushHeroRef.current) return;
      if (hasRunRush.current) return;
      hasRunRush.current = true;

      const reducedMotion = prefersReducedMotion();
      const mobile = isMobile();

      // Hide text initially
      if (nameRef.current) gsap.set(nameRef.current, { opacity: 0, y: 60 });
      if (subtitleRef.current) gsap.set(subtitleRef.current, { opacity: 0, y: 30 });
      if (scrollIndicatorRef.current) gsap.set(scrollIndicatorRef.current, { opacity: 0 });

      if (reducedMotion) {
        gsap.set(frameRef.current, { clipPath: "inset(0% 0% round 0px)" });
        gsap.set(rushTrackRef.current, { display: "none" });
        gsap.set(heroImageRef.current, { opacity: 1 });
        if (gradientRef.current) gsap.set(gradientRef.current, { yPercent: 0, opacity: 1 });
        if (nameRef.current) gsap.set(nameRef.current, { opacity: 1, y: 0 });
        if (subtitleRef.current) gsap.set(subtitleRef.current, { opacity: 1, y: 0 });
        if (scrollIndicatorRef.current) gsap.set(scrollIndicatorRef.current, { opacity: 1 });
        setPhase("hero");
        onRushComplete();
        return;
      }

      // ── Responsive values ──
      const clipInset = mobile
        ? "inset(17.5% 4% round 12px)"
        : "inset(12.5% 7.5% round 12px)";
      // Single duration for the entire rush+expansion motion
      const animDuration = mobile ? 2.0 : 3.0;
      const animEase = "power3.inOut";

      // ── Initial state ──
      gsap.set(frameRef.current, { clipPath: clipInset });
      gsap.set(rushTrackRef.current, { x: 0, force3D: true });
      // Hero is visible from the start — hidden behind rush track (z-80)
      gsap.set(heroImageRef.current, { opacity: 1 });
      if (kenBurnsRef.current) gsap.set(kenBurnsRef.current, { scale: 1, force3D: true });
      if (gradientRef.current) gsap.set(gradientRef.current, { opacity: 0 });

      // Scroll target: land exactly on the hero (last image in the rush track)
      const scrollTarget = -(rushHeroRef.current.offsetLeft);

      const tl = gsap.timeline();

      // ── Rush scroll + frame expansion — one synchronized motion ──
      // Both use the same duration and easing so they move as one gesture.
      // power3.inOut starts slow (you see images in the small frame),
      // accelerates through the middle, and settles on the hero at full screen.
      tl.to(rushTrackRef.current, {
        x: scrollTarget,
        duration: animDuration,
        ease: animEase,
      }, 0);

      tl.to(frameRef.current, {
        clipPath: "inset(0% 0% round 0px)",
        duration: animDuration,
        ease: animEase,
      }, 0);

      // ── Phase transition — fires near the end so nav can start loading ──
      tl.call(() => {
        setPhase("hero");
        onRushComplete();
      }, [], animDuration * 0.75);

      // ── Settled label — main animation complete ──
      tl.addLabel("settled", animDuration);

      // ── Swap rush track for real hero (invisible — same image, same styles) ──
      tl.set(rushTrackRef.current, { display: "none" }, "settled");


      // ── Gradient fades in for text readability ──
      tl.to(gradientRef.current, {
        opacity: 1,
        duration: 1.5,
        ease: "power2.inOut",
      }, "settled");

      // ── Text reveals — staggered entrance ──
      tl.to(nameRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      }, "settled+=0.3");

      tl.to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
      }, "settled+=0.5");

      tl.to(scrollIndicatorRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      }, "settled+=0.65");
    },
    { scope: containerRef, dependencies: [isActive] }
  );

  if (!isActive) return null;

  return (
    <div ref={containerRef} className="relative h-screen bg-primary">
      <div className="fixed inset-0 h-screen w-full flex items-center justify-center overflow-hidden z-0">

        {/* Frame — full viewport size, clipPath creates the small centered box look */}
        <div
          ref={frameRef}
          className="relative overflow-hidden bg-primary w-full h-full"
          style={{ willChange: "clip-path" }}
        >
          {/* Hero image — visible from the start, hidden behind rush track z-index */}
          <div
            ref={heroImageRef}
            className="absolute inset-0 w-full h-full"
          >
            {/* Ken Burns wrapper — only the image scales, overlays stay fixed */}
            <div
              ref={kenBurnsRef}
              className="absolute inset-0 w-full h-full"
              style={{ willChange: "transform" }}
            >
              <Image
                src={heroImage}
                alt="Ace Suasola, professional concert and wedding photographer based in Surrey, BC"
                fill
                className="object-cover"
                style={{ transform: "scaleX(-1)", objectPosition: "center 35%" }}
                priority
                quality={100}
                sizes="100vw"
                unoptimized
              />
            </div>
            {/* Gradient overlay for text readability — animates up from bottom */}
            <div
              ref={gradientRef}
              className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent z-[30]"
              style={{ opacity: 0 }}
            />
            <div className="absolute inset-0 bg-black/10 z-[25]" />
          </div>

          {/* Rush track — seamless images, hero is the final slide */}
          <div
            ref={rushTrackRef}
            className="absolute top-0 left-0 flex items-stretch will-change-transform z-[80]"
            style={{ width: "fit-content", height: "100%" }}
          >
            <div className="relative flex-shrink-0 bg-primary w-screen" style={{ height: "100%" }} />
            {RUSH_IMAGES.map((src, index) => (
              <div key={index} className="relative flex-shrink-0 w-[70vw] md:w-[50vw]" style={{ height: "100%" }}>
                <img src={src} alt="" className="w-full h-full object-cover" loading="eager" />
              </div>
            ))}
            {/* Hero — last image in the rush, fills viewport when frame is fully expanded */}
            <div ref={rushHeroRef} className="relative flex-shrink-0 w-screen" style={{ height: "100%" }}>
              <img
                src={heroImage}
                alt=""
                className="w-full h-full object-cover"
                style={{ transform: "scaleX(-1)", objectPosition: "center 35%" }}
                loading="eager"
              />
            </div>
          </div>
        </div>

        {/* Name overlay — centered on mobile, lower-left on desktop */}
        <div className="absolute inset-0 flex items-center justify-center md:items-end md:justify-start p-4 sm:p-8 md:p-16 md:pb-[20vh] z-[40] pointer-events-none">
          <div className="text-center md:text-left">
            <div ref={nameRef} className="opacity-0">
              {/* One line on mobile, stacked on desktop */}
              <h1 className="font-body font-extrabold tracking-tight leading-[0.85] text-white">
                <span className="md:hidden text-[clamp(2.2rem,11vw,14rem)]">ACE SUASOLA</span>
                <span className="hidden md:block text-[clamp(3.5rem,15vw,14rem)]">ACE</span>
              </h1>
              <h1 className="hidden md:block font-body text-[clamp(2rem,8vw,7rem)] font-extrabold tracking-tight leading-[0.85] text-white -mt-2">
                SUASOLA
              </h1>
            </div>
            <div ref={subtitleRef} className="opacity-0 mt-4 sm:mt-6 md:mt-8 flex flex-col md:flex-row md:items-center gap-1 md:gap-6">
              <p className="font-body text-xs sm:text-sm md:text-lg text-yellow-500/70 tracking-widest uppercase">
                Concert &amp; Wedding Photography
              </p>
              <span className="hidden md:block w-px h-4 bg-yellow-500/40" />
              <p className="font-body text-xs sm:text-sm md:text-lg text-yellow-500/70 tracking-widest uppercase">
                Surrey, BC
              </p>
            </div>
          </div>
        </div>

        {/* Scroll indicator — bottom right, hidden on small mobile */}
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
