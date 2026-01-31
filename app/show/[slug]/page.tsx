"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { getShowBySlug, shows } from "@/lib/shows";
import Navigation from "@/components/Navigation";
import CustomCursor from "@/components/CustomCursor";
import Lightbox from "@/components/Lightbox";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function ShowPage() {
  const params = useParams();
  const slug = params.slug as string;
  const show = getShowBySlug(slug);

  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement[]>([]);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Redirect if show not found
  useEffect(() => {
    if (!show) {
      notFound();
    }
  }, [show]);

  useGSAP(
    () => {
      if (!containerRef.current || !heroRef.current || !show) return;

      // Hero parallax
      gsap.to(heroRef.current, {
        yPercent: 30,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Title animation
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            delay: 0.2,
          }
        );
      }

      // Gallery images stagger animation
      if (imagesRef.current.length > 0) {
        gsap.fromTo(
          imagesRef.current,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: galleryRef.current,
              start: "top 80%",
            },
          }
        );
      }
    },
    { scope: containerRef, dependencies: [show] }
  );

  if (!show) {
    return null;
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Find adjacent shows for navigation
  const currentIndex = shows.findIndex((s) => s.slug === slug);
  const prevShow = currentIndex > 0 ? shows[currentIndex - 1] : null;
  const nextShow =
    currentIndex < shows.length - 1 ? shows[currentIndex + 1] : null;

  return (
    <main ref={containerRef} className="relative min-h-screen bg-primary">
      <CustomCursor />
      <Navigation />

      {/* Hero Section - responsive height */}
      <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-hidden">
        <div
          ref={heroRef}
          className="absolute inset-0"
        >
          <Image
            src={show.coverImage}
            alt={`${show.title} photography by Ace Suasola, ${show.venue}, Vancouver BC`}
            fill
            className="object-cover"
            sizes="100vw"
            quality={100}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-primary" />
        </div>

        {/* Hero content */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 sm:pb-12 md:pb-16 px-4 sm:px-8">
          <h1
            ref={titleRef}
            className="font-display text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-white text-center tracking-tight"
          >
            {show.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-3 sm:mt-4 text-secondary">
            <span className="text-xs sm:text-sm tracking-widest uppercase">{show.date}</span>
            {show.venue && (
              <>
                <span className="text-white/30 hidden sm:inline">/</span>
                <span className="text-xs sm:text-sm tracking-widest uppercase">{show.venue}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Gallery Grid - improved mobile spacing */}
      <section ref={galleryRef} className="px-3 sm:px-4 md:px-8 py-12 sm:py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6">
            {show.images.map((image, index) => (
              <div
                key={index}
                ref={(el) => {
                  if (el) imagesRef.current[index] = el;
                }}
                className="relative aspect-[3/4] cursor-pointer group overflow-hidden"
                onClick={() => openLightbox(index)}
                data-cursor-text="View"
              >
                <Image
                  src={image}
                  alt={`${show.title.toLowerCase()} photography in Vancouver, photo ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  sizes="100vw"
                  quality={100}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Show navigation - improved mobile layout */}
      <section className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 sm:py-12 md:py-16">
          {/* Mobile: Stack vertically, Desktop: Horizontal */}
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-4">
            {/* Previous show */}
            <div className="flex-1 w-full sm:w-auto order-2 sm:order-1">
              {prevShow ? (
                <Link
                  href={`/show/${prevShow.slug}`}
                  className="group inline-flex flex-col items-center sm:items-start w-full sm:w-auto"
                >
                  <span className="text-secondary text-[10px] sm:text-xs tracking-widest uppercase mb-1 sm:mb-2">
                    Previous
                  </span>
                  <span className="font-display text-lg sm:text-xl md:text-2xl text-white group-hover:text-white/70 transition-colors text-center sm:text-left">
                    {prevShow.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
            </div>

            {/* Back to gallery */}
            <Link
              href="/work"
              className="order-1 sm:order-2 px-5 sm:px-6 py-2.5 sm:py-3 border border-white/20 text-white text-xs sm:text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-colors touch-manipulation"
            >
              All Work
            </Link>

            {/* Next show */}
            <div className="flex-1 w-full sm:w-auto flex justify-center sm:justify-end order-3">
              {nextShow ? (
                <Link
                  href={`/show/${nextShow.slug}`}
                  className="group inline-flex flex-col items-center sm:items-end w-full sm:w-auto"
                >
                  <span className="text-secondary text-[10px] sm:text-xs tracking-widest uppercase mb-1 sm:mb-2">
                    Next
                  </span>
                  <span className="font-display text-lg sm:text-xl md:text-2xl text-white group-hover:text-white/70 transition-colors text-center sm:text-right">
                    {nextShow.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between text-secondary text-xs sm:text-sm">
          <span>&copy; {new Date().getFullYear()} Ace Suasola</span>
          <Link
            href="/contact"
            className="hover:text-white transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </footer>

      {/* Lightbox */}
      <Lightbox
        images={show.images}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setLightboxIndex}
      />
    </main>
  );
}
