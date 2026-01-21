"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { preloadAllImages } from "@/lib/imagePreloader";
import { prefersReducedMotion } from "@/lib/animations";

gsap.registerPlugin(useGSAP);

// Minimum duration for the counter animation (ms)
const MIN_COUNTER_DURATION = 2500;

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaderGroupRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [displayPercent, setDisplayPercent] = useState(0);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  const counterAnimRef = useRef<gsap.core.Tween | null>(null);

  // Preload images
  useEffect(() => {
    let isMounted = true;
    const startTime = Date.now();

    const loadImages = async () => {
      await preloadAllImages(() => {});

      if (isMounted) {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, MIN_COUNTER_DURATION - elapsed);

        setTimeout(() => {
          if (isMounted) {
            setIsLoadingComplete(true);
          }
        }, remaining);
      }
    };

    loadImages();

    return () => {
      isMounted = false;
    };
  }, []);

  // Animate the counter smoothly
  useEffect(() => {
    const counter = { value: 0 };

    counterAnimRef.current = gsap.to(counter, {
      value: 100,
      duration: MIN_COUNTER_DURATION / 1000,
      ease: "power2.inOut",
      onUpdate: () => {
        setDisplayPercent(Math.round(counter.value));
      },
    });

    return () => {
      counterAnimRef.current?.kill();
    };
  }, []);

  // Animate out when loading is complete - slide left with line following
  useGSAP(
    () => {
      if (!isLoadingComplete || !containerRef.current || !loaderGroupRef.current || !lineRef.current) return;

      const reducedMotion = prefersReducedMotion();

      if (reducedMotion) {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.3,
          onComplete,
        });
        return;
      }

      const tl = gsap.timeline();

      // Brief pause at 100%
      tl.to({}, { duration: 0.2 });

      // Animate line extending from the right of the percentage to the right edge
      tl.to(lineRef.current, {
        width: "100vw",
        duration: 0.5,
        ease: "power2.inOut",
      });

      // Slide the loader group to the left while line follows
      // Also fade out the container background so rush shows through
      tl.to(loaderGroupRef.current, {
        x: "-100vw",
        duration: 0.6,
        ease: "power2.inOut",
      }, "-=0.2");

      tl.to(containerRef.current, {
        backgroundColor: "transparent",
        duration: 0.3,
      }, "-=0.4");

      // Signal completion early so rush starts while loader is exiting
      tl.call(onComplete, [], "-=0.5");
    },
    { scope: containerRef, dependencies: [isLoadingComplete] }
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-primary overflow-hidden"
    >
      {/* Loader group - positioned bottom right */}
      <div
        ref={loaderGroupRef}
        className="absolute bottom-12 right-12 flex items-center gap-4"
      >
        {/* Loading text */}
        <span className="font-mono text-sm tracking-[0.2em] text-white/60 uppercase">
          Loading
        </span>

        {/* Percentage */}
        <span
          className="font-mono text-5xl md:text-6xl font-bold text-white tabular-nums"
        >
          {displayPercent}%
        </span>

        {/* Line that extends to the right */}
        <div
          ref={lineRef}
          className="h-[2px] bg-white/40"
          style={{ width: 0 }}
        />
      </div>
    </div>
  );
}
