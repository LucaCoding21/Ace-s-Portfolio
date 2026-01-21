"use client";

import { useRef, useLayoutEffect, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { secondAceImage } from "@/lib/imagePreloader";
import { prefersReducedMotion } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

interface SecondAceSectionProps {
  isVisible: boolean;
}

// Scatter images
const scatterImages = [
  { id: "scatter-1", src: "/images/optimized/new-photos/25.jpg" },
  { id: "scatter-2", src: "/images/optimized/new-photos/leonthomas.jpg" },
  { id: "scatter-3", src: "/images/optimized/new-photos/dj-photo.jpg" },
  { id: "scatter-4", src: "/images/optimized/new-photos/42.jpg" },
  { id: "scatter-5", src: "/images/optimized/new-photos/facetowel.jpg" },
];

// Entry positions (burst from outside) - in pixels
const entryOffsets: Record<string, { x: number; y: number }> = {
  "main":      { x: -400, y: -200 },
  "scatter-1": { x: 600, y: -200 },
  "scatter-2": { x: -500, y: 0 },
  "scatter-3": { x: 500, y: 0 },
  "scatter-4": { x: -400, y: 100 },
  "scatter-5": { x: 400, y: 0 },
};

// Final positions SPREAD OVER 200vh (y is percentage of container height)
// Top images positioned to be visible right after pin releases
const finalPositions: Record<string, { x: number; y: number; zIndex: number }> = {
  "main":      { x: 20, y: 2, zIndex: 20 },
  "scatter-1": { x: 68, y: 6, zIndex: 15 },
  "scatter-2": { x: 15, y: 28, zIndex: 17 },
  "scatter-3": { x: 65, y: 45, zIndex: 14 },
  "scatter-4": { x: 22, y: 62, zIndex: 16 },
  "scatter-5": { x: 60, y: 80, zIndex: 18 },
};

// Image dimensions
const imageDimensions: Record<string, { width: string; height: string }> = {
  "main":      { width: "clamp(300px, 38vw, 550px)", height: "clamp(200px, 26vw, 370px)" },
  "scatter-1": { width: "clamp(220px, 26vw, 380px)", height: "clamp(330px, 39vw, 570px)" },
  "scatter-2": { width: "clamp(300px, 35vw, 500px)", height: "clamp(200px, 24vw, 340px)" },
  "scatter-3": { width: "clamp(280px, 32vw, 460px)", height: "clamp(190px, 22vw, 320px)" },
  "scatter-4": { width: "clamp(200px, 24vw, 350px)", height: "clamp(280px, 33vw, 480px)" },
  "scatter-5": { width: "clamp(260px, 30vw, 430px)", height: "clamp(180px, 21vw, 300px)" },
};

export default function SecondAceSection({ isVisible }: SecondAceSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const concertsTextRef = useRef<HTMLDivElement>(null);
  const scatterSectionRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<Map<string, HTMLDivElement>>(new Map());

  const setImageRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
    if (el) imagesRef.current.set(id, el);
  }, []);

  useLayoutEffect(() => {
    if (!isVisible || !sectionRef.current || !heroContainerRef.current || !scatterSectionRef.current) return;

    const reducedMotion = prefersReducedMotion();
    const allImageIds = ["main", ...scatterImages.map(img => img.id)];

    const ctx = gsap.context(() => {
      // Set all scatter images at their positions, hidden with offsets
      allImageIds.forEach((id) => {
        const el = imagesRef.current.get(id);
        const final = finalPositions[id];
        const offset = entryOffsets[id];
        if (!el || !final) return;

        gsap.set(el, {
          left: `${final.x}vw`,
          top: `${final.y}%`,
          xPercent: -50,
          yPercent: -50,
          opacity: 0,
          scale: 0.5,
          x: offset?.x || 0,
          y: offset?.y || 0,
          zIndex: final.zIndex,
        });
      });

      if (reducedMotion) {
        if (heroImageRef.current) gsap.set(heroImageRef.current, { opacity: 0 });
        if (concertsTextRef.current) gsap.set(concertsTextRef.current, { opacity: 0 });
        allImageIds.forEach((id) => {
          const el = imagesRef.current.get(id);
          if (el) gsap.set(el, { opacity: 1, scale: 1, x: 0, y: 0 });
        });
        return;
      }

      // PIN: True scroll lock, zoom, shrink, BURST
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroContainerRef.current,
          start: "bottom bottom",
          end: "+=50%",
          pin: true,
          pinSpacing: true,
          scrub: 1.5, // Slower, smoother scrub
          anticipatePin: 1,
        },
      });

      // Zoom in - slower (0 - 0.4)
      heroTl.to(heroImageRef.current, {
        scale: 1.06,
        duration: 0.4,
        ease: "power1.out",
      }, 0);

      // Fade out CONCERTS text (0.2 - 0.5)
      heroTl.to(concertsTextRef.current, {
        opacity: 0,
        duration: 0.3,
      }, 0.2);

      // Shrink/minimize and fade out - slower (0.5 - 1.0)
      heroTl.to(heroImageRef.current, {
        scale: 0.35,
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
      }, 0.5);

      // BURST after pin releases
      const burstTl = gsap.timeline({
        scrollTrigger: {
          trigger: scatterSectionRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });

      allImageIds.forEach((id, index) => {
        const el = imagesRef.current.get(id);
        if (!el) return;

        burstTl.to(el, {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        }, index * 0.05);
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <section ref={sectionRef} className="relative">
      {/* Top gradient fade */}
      <div
        className="absolute top-0 left-0 right-0 h-[20vh] pointer-events-none z-10"
        style={{
          background: "linear-gradient(to bottom, rgb(28, 28, 28) 0%, transparent 100%)"
        }}
      />

      {/* HERO - Concert photo that shrinks on scroll */}
      <div ref={heroContainerRef} className="relative w-full bg-[#0a0a0a] overflow-hidden"
        style={{ aspectRatio: "16 / 14" }}
      >
        <div
          ref={heroImageRef}
          className="absolute inset-0 w-full h-full origin-center"
        >
          <Image
            src={secondAceImage}
            alt="Concert Photography"
            fill
            className="object-cover object-center"
            quality={100}
            priority
            unoptimized
          />
        </div>
        <div
          ref={concertsTextRef}
          className="absolute inset-x-0 top-[12%] flex justify-center pointer-events-none z-10"
        >
          <h2 className="font-display text-[clamp(2rem,8vw,6rem)] text-white font-black tracking-tight">
            CONCERTS
          </h2>
        </div>
      </div>

      {/* SCATTER SECTION - 200vh tall, photos spread out */}
      <div
        ref={scatterSectionRef}
        className="relative w-full bg-[#0a0a0a]"
        style={{ height: "200vh" }}
      >
        {/* Main image */}
        <div
          ref={setImageRef("main")}
          className="absolute"
          style={{
            width: imageDimensions["main"].width,
            height: imageDimensions["main"].height,
            boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
          }}
        >
          <div className="w-full h-full relative overflow-hidden rounded-sm">
            <Image
              src={secondAceImage}
              alt="Concert Photography"
              fill
              className="object-cover object-center"
              quality={100}
              unoptimized
            />
          </div>
        </div>

        {/* Scatter images */}
        {scatterImages.map((img) => {
          const dimensions = imageDimensions[img.id];
          return (
            <div
              key={img.id}
              ref={setImageRef(img.id)}
              className="absolute"
              style={{
                width: dimensions.width,
                height: dimensions.height,
                boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
              }}
            >
              <div className="w-full h-full relative overflow-hidden rounded-sm">
                <Image
                  src={img.src}
                  alt="Concert photography"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 280px, 400px"
                  quality={85}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
