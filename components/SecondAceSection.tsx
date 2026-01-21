"use client";

import { useRef, useLayoutEffect, useState, useCallback } from "react";
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

// Entry positions (outside viewport) - using pixel offsets that will be converted
const entryOffsets: Record<string, { x: number; y: number }> = {
  "scatter-1": { x: 800, y: -400 },   // From top-right
  "scatter-2": { x: -600, y: 0 },     // From left
  "scatter-3": { x: -600, y: 200 },   // From left-bottom
  "scatter-4": { x: 800, y: 100 },    // From right
  "scatter-5": { x: 800, y: 300 },    // From right-bottom
};

// Final positions (% of 200vh container height for y, vw for x)
const finalPositions: Record<string, { x: number; y: number; zIndex: number }> = {
  "main":      { x: 15, y: 2, zIndex: 20 },
  "scatter-1": { x: 62, y: 1, zIndex: 15 },
  "scatter-2": { x: 12, y: 18, zIndex: 17 },
  "scatter-3": { x: 60, y: 36, zIndex: 14 },
  "scatter-4": { x: 14, y: 52, zIndex: 16 },
  "scatter-5": { x: 58, y: 70, zIndex: 18 },
};

// Image dimensions
const imageDimensions: Record<string, { width: string; height: string }> = {
  "main":      { width: "clamp(250px, 30vw, 420px)", height: "clamp(170px, 20vw, 280px)" },
  "scatter-1": { width: "clamp(220px, 22vw, 340px)", height: "clamp(330px, 33vw, 500px)" },
  "scatter-2": { width: "clamp(300px, 30vw, 450px)", height: "clamp(200px, 20vw, 300px)" },
  "scatter-3": { width: "clamp(280px, 28vw, 420px)", height: "clamp(180px, 18vw, 270px)" },
  "scatter-4": { width: "clamp(200px, 20vw, 300px)", height: "clamp(280px, 28vw, 420px)" },
  "scatter-5": { width: "clamp(260px, 26vw, 400px)", height: "clamp(170px, 17vw, 260px)" },
};

export default function SecondAceSection({ isVisible }: SecondAceSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const concertsTextRef = useRef<HTMLDivElement>(null);
  const scatterContainerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const [isPinned, setIsPinned] = useState(false);

  const setImageRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
    if (el) imagesRef.current.set(id, el);
  }, []);

  useLayoutEffect(() => {
    if (!isVisible || !sectionRef.current || !heroRef.current || !scatterContainerRef.current) return;

    const reducedMotion = prefersReducedMotion();
    const allImageIds = ["main", ...scatterImages.map(img => img.id)];

    const ctx = gsap.context(() => {
      // Initial state: all images at final positions but hidden
      allImageIds.forEach((id) => {
        const el = imagesRef.current.get(id);
        const final = finalPositions[id];
        if (!el || !final) return;

        gsap.set(el, {
          left: `${final.x}vw`,
          top: `${final.y}%`,
          xPercent: -50,
          opacity: 0,
          scale: 0.3,
        });
      });

      if (reducedMotion) {
        if (heroImageRef.current) gsap.set(heroImageRef.current, { opacity: 0 });
        if (concertsTextRef.current) gsap.set(concertsTextRef.current, { opacity: 0 });
        allImageIds.forEach((id) => {
          const el = imagesRef.current.get(id);
          if (el) gsap.set(el, { opacity: 1, scale: 1 });
        });
        return;
      }

      // Create the pinned animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "bottom bottom",
          end: "+=100%",
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          onEnter: () => setIsPinned(true),
          onLeave: () => setIsPinned(false),
          onEnterBack: () => setIsPinned(true),
          onLeaveBack: () => setIsPinned(false),
        },
      });

      // Fade out hero image and text
      if (heroImageRef.current) {
        tl.to(heroImageRef.current, { opacity: 0, duration: 0.25 }, 0);
      }
      if (concertsTextRef.current) {
        tl.to(concertsTextRef.current, { opacity: 0, duration: 0.15 }, 0);
      }

      // Main image scales up and fades in
      const mainEl = imagesRef.current.get("main");
      if (mainEl) {
        tl.to(mainEl, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
        }, 0.1);
      }

      // Scatter images burst in from their entry offsets
      scatterImages.forEach((img, index) => {
        const el = imagesRef.current.get(img.id);
        const offset = entryOffsets[img.id];
        const final = finalPositions[img.id];
        if (!el || !offset || !final) return;

        // Start from offset position (using x/y transforms)
        gsap.set(el, {
          x: offset.x,
          y: offset.y,
        });

        // Animate to center (x:0, y:0 removes the offset)
        tl.to(el, {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
        }, 0.1 + index * 0.08);
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <section ref={sectionRef} className="relative bg-primary">
      {/* Top gradient fade */}
      <div
        className="absolute top-0 left-0 right-0 h-[20vh] pointer-events-none z-10"
        style={{
          background: "linear-gradient(to bottom, rgb(28, 28, 28) 0%, transparent 100%)"
        }}
      />

      {/* HERO SECTION - Gets pinned during animation */}
      <div ref={heroRef} className="relative w-full bg-primary">
        <div
          ref={heroImageRef}
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: "2133 / 1920" }}
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
          <div
            ref={concertsTextRef}
            className="absolute inset-x-0 top-[8%] flex justify-center pointer-events-none z-10"
          >
            <h2 className="font-display text-[clamp(2rem,8vw,6rem)] text-white font-black tracking-tight">
              CONCERTS
            </h2>
          </div>
        </div>
      </div>

      {/* SCATTER CONTAINER - 200vh tall, images positioned absolutely within */}
      <div
        ref={scatterContainerRef}
        className="relative w-full bg-[#0a0a0a]"
        style={{ height: "200vh" }}
      >
        {/* Main image in scatter */}
        <div
          ref={setImageRef("main")}
          className="absolute"
          style={{
            width: imageDimensions["main"].width,
            height: imageDimensions["main"].height,
            boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
            zIndex: finalPositions["main"].zIndex,
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
          const final = finalPositions[img.id];
          return (
            <div
              key={img.id}
              ref={setImageRef(img.id)}
              className="absolute"
              style={{
                width: dimensions.width,
                height: dimensions.height,
                boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
                zIndex: final.zIndex,
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
