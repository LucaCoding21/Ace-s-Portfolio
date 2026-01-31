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
  const progressRef = useRef<HTMLDivElement>(null);
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

  // Animate the counter and progress bar smoothly
  useEffect(() => {
    const counter = { value: 0 };

    counterAnimRef.current = gsap.to(counter, {
      value: 100,
      duration: MIN_COUNTER_DURATION / 1000,
      ease: "power2.inOut",
      onUpdate: () => {
        setDisplayPercent(Math.round(counter.value));
        if (progressRef.current) {
          progressRef.current.style.width = `${counter.value}%`;
        }
      },
    });

    return () => {
      counterAnimRef.current?.kill();
    };
  }, []);

  // Exit animation — clean fade, no jarring horizontal slide
  useGSAP(
    () => {
      if (!isLoadingComplete || !containerRef.current || !loaderGroupRef.current) return;

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
      tl.to({}, { duration: 0.3 });

      // Fade out loader content with subtle upward drift
      tl.to(loaderGroupRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: "power2.in",
      });

      // Fade out entire container
      tl.to(containerRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
      }, "-=0.15");

      // Signal completion when container is nearly invisible
      tl.call(onComplete, [], "-=0.1");
    },
    { scope: containerRef, dependencies: [isLoadingComplete] }
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-primary overflow-hidden"
    >
      {/* Thin progress line at the bottom of the screen */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10">
        <div
          ref={progressRef}
          className="h-full bg-white/20"
          style={{ width: 0 }}
        />
      </div>

      {/* Loader group — positioned bottom right */}
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
      </div>
    </div>
  );
}
