"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { shows } from "@/lib/shows";
import Navigation from "@/components/Navigation";
import CustomCursor from "@/components/CustomCursor";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const categoryDescriptions: Record<string, string> = {
  concerts: "Live music photography",
  weddings: "Timeless moments",
  projects: "Creative work",
};

export default function WorkPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLAnchorElement[]>([]);
  const ctaSectionRef = useRef<HTMLDivElement>(null);
  const ctaImageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      // Simple fade in for title
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 }
        );
      }

      // Stagger cards
      if (cardsRef.current.length > 0) {
        gsap.fromTo(
          cardsRef.current,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: "power3.out", delay: 0.4 }
        );
      }

      // CTA parallax
      if (ctaImageRef.current && ctaSectionRef.current) {
        gsap.fromTo(
          ctaImageRef.current,
          { yPercent: -30 },
          {
            yPercent: 30,
            ease: "none",
            scrollTrigger: {
              trigger: ctaSectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
            },
          }
        );
      }
    },
    { scope: containerRef }
  );

  return (
    <main ref={containerRef} className="relative min-h-screen bg-primary">
      <CustomCursor />
      <Navigation />

      {/* Header */}
      <section className="pt-32 sm:pt-40 pb-12 sm:pb-16 px-4 sm:px-8 md:px-16">
        <h1
          ref={titleRef}
          className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight opacity-0"
        >
          Work
        </h1>
        <p className="font-body text-white/50 text-base sm:text-lg mt-4 max-w-xl">
          A collection of moments captured through the lens.
        </p>
      </section>

      {/* Category Cards - Full width stacked */}
      <section className="px-4 sm:px-8 md:px-16 pb-24 sm:pb-32">
        <div className="flex flex-col gap-4 sm:gap-6">
          {shows.map((show, index) => (
            <Link
              key={show.slug}
              href={`/show/${show.slug}`}
              ref={(el) => { if (el) cardsRef.current[index] = el; }}
              className="group relative h-[40vh] sm:h-[50vh] md:h-[60vh] overflow-hidden cursor-pointer opacity-0"
              data-cursor-text="View"
            >
              {/* Background Image */}
              <Image
                src={show.coverImage}
                alt={show.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="100vw"
                quality={90}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-500" />

              {/* Content */}
              <div className="absolute inset-0 flex items-end p-6 sm:p-10 md:p-14">
                <div>
                  <span className="font-body text-yellow-500/80 text-xs sm:text-sm tracking-widest uppercase">
                    {categoryDescriptions[show.slug]}
                  </span>
                  <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mt-2 transition-transform duration-500 group-hover:translate-x-2">
                    {show.title}
                  </h2>
                </div>

                {/* Arrow */}
                <div className="absolute right-6 sm:right-10 md:right-14 bottom-6 sm:bottom-10 md:bottom-14 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                  <svg
                    className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaSectionRef} className="relative h-[60vh] sm:h-[70vh] overflow-hidden">
        <div ref={ctaImageRef} className="absolute inset-0 h-[160%] -top-[30%]">
          <Image
            src="/images/optimized/new-photos/58.jpg"
            alt="Book a session"
            fill
            className="object-cover object-[center_70%]"
            sizes="100vw"
            quality={90}
          />
        </div>
        {/* Gradient overlays for smooth fade */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-primary to-transparent" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Ready to capture your moment?
          </h2>
          <p className="font-body text-white/60 text-sm sm:text-base mt-4 max-w-md">
            Let&apos;s create something memorable together.
          </p>
          <Link
            href="/contact"
            className="mt-8 px-8 sm:px-10 py-4 bg-white text-primary font-display text-sm sm:text-base tracking-widest uppercase hover:bg-white/90 transition-colors"
          >
            Book Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 sm:py-8">
        <div className="px-4 sm:px-8 md:px-16 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/40 text-xs sm:text-sm">
          <span>&copy; {new Date().getFullYear()} Ace Suasola</span>
          <Link href="/contact" className="hover:text-white transition-colors">
            Get in Touch
          </Link>
        </div>
      </footer>
    </main>
  );
}
