"use client";

import { useRef, useLayoutEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { allPhotos, newPhotos } from "@/lib/shows";
import { prefersReducedMotion } from "@/lib/animations";
import Lightbox from "./Lightbox";

gsap.registerPlugin(ScrollTrigger);

interface SecondAceSectionProps {
  isVisible: boolean;
}

// Featured concert photos
const concertPhotos = [
  { src: "/images/newpics/guitarist.jpg", caption: "Stage Presence" },
  { src: "/images/optimized/new-photos/25.jpg", caption: "The Jam" },
  { src: "/images/optimized/new-photos/40.jpg", caption: "The Crowd" },
  { src: "/images/newpics/DJ.jpg", caption: "Party Vibes" },
  { src: "/images/optimized/new-photos/49.jpg", caption: "Performance" },
];

// Wedding photos section
const weddingPhotos = [
  { src: "/images/newpics/wedding9.jpg", caption: "First Dance" },
  { src: "/images/newpics/wedding8.jpg", caption: "The Bride" },
  { src: "/images/newpics/wedding1.jpg", caption: "Golden Hour" },
  { src: "/images/newpics/wedding3.jpg", caption: "Celebration" },
  { src: "/images/newpics/wedding2.jpg", caption: "Forever" },
];

// Project photos with custom positioning
const projectPhotos = newPhotos.projects.map((src, i) => ({
  src,
  caption: ["Project I", "Project II", "Project III", "Project IV", "Project V"][i],
  objectPosition: [undefined, "center 85%", undefined, "center 70%", undefined][i], // Project II and IV positioned lower
}));

// Horizontal scroll photos - 5 photos with category links
const horizontalPhotos = [
  { src: allPhotos[35], category: "concerts", label: "Concerts" },
  { src: newPhotos.weddings[4], category: "weddings", label: "Weddings" },
  { src: allPhotos[40], category: "concerts", label: "Concerts" },
  { src: newPhotos.projects[4], category: "projects", label: "Projects" },
  { src: allPhotos[45], category: "concerts", label: "Concerts" },
];

export default function SecondAceSection({ isVisible }: SecondAceSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const entranceRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);
  const scrollRevealRef = useRef<HTMLDivElement>(null);
  const scrollRevealTextRef = useRef<HTMLDivElement>(null);
  const scrollRevealImagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const concertRefs = useRef<(HTMLDivElement | null)[]>([]);
  const weddingRefs = useRef<(HTMLDivElement | null)[]>([]);
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);
  const feelEnergyRef = useRef<HTMLHeadingElement>(null);
  const hasAnimatedEntrance = useRef(false);
  const [hoveredIndex, setHoveredIndex] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxCategory, setLightboxCategory] = useState<{ link: string; label: string } | null>(null);

  const openLightbox = (images: string[], index: number, category: { link: string; label: string }) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxCategory(category);
    setLightboxOpen(true);
  };

  useLayoutEffect(() => {
    if (!isVisible || !sectionRef.current) return;

    const reducedMotion = prefersReducedMotion();

    const ctx = gsap.context(() => {
      // Entrance animation for the section - slide up smoothly
      if (entranceRef.current && !hasAnimatedEntrance.current) {
        hasAnimatedEntrance.current = true;

        if (reducedMotion) {
          gsap.set(entranceRef.current, { opacity: 1, y: 0 });
        } else {
          // Set initial state
          gsap.set(entranceRef.current, { opacity: 0, y: 80 });

          // Animate entrance with a smooth slide up
          gsap.to(entranceRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            delay: 0.1,
          });
        }
      }
      // Animate gallery sections
      const animateGallery = (refs: (HTMLDivElement | null)[]) => {
        refs.forEach((el, index) => {
          if (!el) return;

          gsap.set(el, { opacity: 0, scale: 0.9, y: 80 });

          if (reducedMotion) {
            gsap.set(el, { opacity: 1, scale: 1, y: 0 });
            return;
          }

          ScrollTrigger.create({
            trigger: el,
            start: "top 85%",
            onEnter: () => {
              gsap.to(el, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 1.2,
                delay: index * 0.08,
                ease: "power3.out",
              });
            },
          });

          const img = el.querySelector('.gallery-image');
          if (img) {
            gsap.to(img, {
              yPercent: 15,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5,
              },
            });
          }
        });
      };

      animateGallery(concertRefs.current);
      animateGallery(weddingRefs.current);
      animateGallery(projectRefs.current);

      // Animate "Feel the Energy" text to yellow on scroll
      if (feelEnergyRef.current && !reducedMotion) {
        // Create a gradient mask animation effect - yellow fills from bottom to top
        gsap.fromTo(feelEnergyRef.current,
          {
            backgroundImage: "linear-gradient(to top, rgb(234 179 8 / 0.7) 0%, white 0%)",
          },
          {
            backgroundImage: "linear-gradient(to top, rgb(234 179 8 / 0.7) 100%, white 100%)",
            scrollTrigger: {
              trigger: feelEnergyRef.current,
              start: "top 80%",
              end: "top 30%",
              scrub: 1,
            },
          }
        );
      }

      // Scroll reveal section - only on desktop (hidden on mobile)
      const isMobileView = window.innerWidth < 768;

      if (scrollRevealRef.current && scrollRevealTextRef.current && !reducedMotion && !isMobileView) {
        // Pin the text in the center
        ScrollTrigger.create({
          trigger: scrollRevealRef.current,
          start: "top top",
          end: "bottom bottom",
          pin: scrollRevealTextRef.current,
          pinSpacing: false,
        });

        // Animate images appearing from sides
        scrollRevealImagesRef.current.forEach((img, index) => {
          if (!img) return;
          const isLeft = index % 2 === 0;

          gsap.fromTo(img,
            {
              x: isLeft ? -100 : 100,
              opacity: 0,
              scale: 0.8
            },
            {
              x: 0,
              opacity: 1,
              scale: 1,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: img,
                start: "top 80%",
                end: "top 30%",
                scrub: 1,
              },
            }
          );
        });
      }

      // Horizontal scroll section
      if (horizontalRef.current && horizontalTrackRef.current && !reducedMotion) {
        const track = horizontalTrackRef.current;
        const isMobileView = window.innerWidth < 768;
        const totalWidth = track.scrollWidth - window.innerWidth;

        gsap.to(track, {
          x: -totalWidth,
          ease: "none",
          scrollTrigger: {
            trigger: horizontalRef.current,
            start: "top top",
            end: () => `+=${totalWidth}`,
            scrub: isMobileView ? 1 : 1.5,
            pin: true,
            anticipatePin: 1,
            pinSpacing: true,
            invalidateOnRefresh: true,
          },
        });
      }

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [isVisible]);

  if (!isVisible) return null;

  const renderGalleryItem = (
    photo: { src: string; caption: string; objectPosition?: string },
    index: number,
    sectionKey: string,
    refs: React.MutableRefObject<(HTMLDivElement | null)[]>,
    isLarge: boolean,
    category: string,
    allSectionPhotos: { src: string; caption: string }[]
  ) => {
    const key = `${sectionKey}-${index}`;
    const categoryLabels: Record<string, string> = {
      concerts: "Concerts",
      weddings: "Weddings",
      projects: "Projects",
    };
    return (
      <div
        key={key}
        ref={(el) => { refs.current[index] = el; }}
        className={`relative overflow-hidden group block cursor-pointer ${
          isLarge ? 'md:col-span-2 aspect-[16/9]' : 'aspect-[4/5] md:aspect-[3/4]'
        }`}
        data-cursor-text="View"
        onMouseEnter={() => setHoveredIndex(key)}
        onMouseLeave={() => setHoveredIndex(null)}
        onClick={() => openLightbox(
          allSectionPhotos.map(p => p.src),
          index,
          { link: `/show/${category}`, label: categoryLabels[category] }
        )}
      >
        <div className="gallery-image absolute inset-0 w-full h-[120%] -top-[10%]">
          <Image
            src={photo.src}
            alt={photo.caption}
            fill
            className={`object-cover transition-transform duration-700 ease-out ${
              hoveredIndex === key ? 'scale-[1.02]' : 'scale-100'
            }`}
            style={photo.objectPosition ? { objectPosition: photo.objectPosition } : undefined}
            sizes="100vw"
            quality={100}
          />
        </div>
        <div
          className={`absolute inset-0 bg-black/20 transition-opacity duration-500 ${
            hoveredIndex === key ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {/* Hover content */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-6 md:p-8 transition-all duration-500 ${
            hoveredIndex === key ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <span className="font-display text-xl md:text-2xl font-bold text-white">
            {photo.caption}
          </span>
        </div>
      </div>
    );
  };

  return (
    <section ref={sectionRef} className="relative bg-primary">
      {/* Entrance wrapper for smooth transition */}
      <div ref={entranceRef} style={{ opacity: 0 }}>
        {/* Gradient transition from hero */}
        <div
          className="absolute top-0 left-0 right-0 h-[30vh] pointer-events-none z-30 -translate-y-full"
          style={{ background: "linear-gradient(to top, rgb(10, 10, 10) 0%, transparent 100%)" }}
        />

        {/* Concerts Section */}
        <div className="relative py-16 sm:py-24 md:py-40 bg-primary">
        <div className="px-4 sm:px-8 md:px-16 mb-12 sm:mb-16 md:mb-24">
          <h2 className="font-display text-[clamp(2.5rem,8vw,6rem)] font-bold text-white tracking-tight">
            Concerts
          </h2>
          <p className="font-body text-yellow-500/60 text-sm md:text-base tracking-widest uppercase mt-4">
            Live Music Photography
          </p>
          <p className="font-body text-white/40 text-base md:text-lg mt-6 max-w-2xl leading-relaxed">
            Capturing the raw energy and emotion of live performances. From intimate venues to massive festivals, every show tells a unique story.
          </p>
        </div>

        <div className="px-4 md:px-8 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 max-w-[1800px] mx-auto">
            {concertPhotos.slice(0, 4).map((photo, index) => {
              const isLarge = index === 0 || index === 3;
              return renderGalleryItem(photo, index, 'concert', concertRefs, isLarge, 'concerts', concertPhotos);
            })}
            {/* Text - hidden on mobile, right-aligned on desktop */}
            <div className="hidden md:flex flex-col justify-center items-end p-4 sm:p-8 md:p-12">
              <h3
                ref={feelEnergyRef}
                className="font-display text-[clamp(2rem,8vw,12rem)] font-bold tracking-tight leading-none text-right uppercase bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(to top, rgb(234 179 8 / 0.7) 0%, white 0%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Feel<br />the<br />Energy
              </h3>
            </div>
            {renderGalleryItem(concertPhotos[4], 4, 'concert', concertRefs, false, 'concerts', concertPhotos)}
          </div>
        </div>
      </div>
      </div>

      {/* Weddings Section */}
      <div className="relative py-16 sm:py-24 md:py-40 bg-primary-light/30">
        <div className="px-4 sm:px-8 md:px-16 mb-12 sm:mb-16 md:mb-24">
          <h2 className="font-display text-[clamp(2.5rem,8vw,6rem)] font-bold text-white tracking-tight">
            Weddings
          </h2>
          <p className="font-body text-yellow-500/60 text-sm md:text-base tracking-widest uppercase mt-4">
            Timeless Moments
          </p>
          <p className="font-body text-white/40 text-base md:text-lg mt-6 max-w-2xl leading-relaxed">
            Preserving the beauty and emotion of your special day. Every glance, every smile, every tear of joy, captured forever.
          </p>
        </div>

        <div className="px-4 md:px-8 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 max-w-[1800px] mx-auto">
            {/* First Dance - large */}
            {renderGalleryItem(weddingPhotos[0], 0, 'wedding', weddingRefs, true, 'weddings', weddingPhotos)}
            {/* The Vows photo on left, text on right */}
            {renderGalleryItem(weddingPhotos[1], 1, 'wedding', weddingRefs, false, 'weddings', weddingPhotos)}
            {/* Your Story - hidden on mobile */}
            <div className="hidden md:flex flex-col justify-center items-start p-4 sm:p-8 md:p-12">
              <h3 className="font-display text-[clamp(2.5rem,10vw,10rem)] font-bold text-white tracking-tight leading-none text-left uppercase">
                Your<br />Story
              </h3>
              <p className="font-serif italic text-yellow-500/60 text-xl md:text-2xl mt-4 sm:mt-6">
                Begins here.
              </p>
            </div>
            {/* Rest of wedding photos */}
            {weddingPhotos.slice(2).map((photo, index) => {
              const actualIndex = index + 2;
              const isLarge = actualIndex === 2;
              return renderGalleryItem(photo, actualIndex, 'wedding', weddingRefs, isLarge, 'weddings', weddingPhotos);
            })}
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="relative py-16 sm:py-24 md:py-40">
        <div className="px-4 md:px-8 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 max-w-[1800px] mx-auto">
            {/* First row: Project I (left) + Content (right) on desktop */}
            {/* On mobile: Content first, then Project I below */}
            <div className="order-2 md:order-none">
              {renderGalleryItem(projectPhotos[0], 0, 'project', projectRefs, false, 'projects', projectPhotos)}
            </div>
            <div className="flex flex-col justify-center p-4 sm:p-8 md:p-12 order-1 md:order-none">
              <h2 className="font-display text-[clamp(2.5rem,8vw,6rem)] font-bold text-white tracking-tight">
                Projects
              </h2>
              <p className="font-body text-yellow-500/60 text-sm md:text-base tracking-widest uppercase mt-4">
                Creative Work
              </p>
              <p className="font-body text-white/50 text-base md:text-lg mt-6 leading-relaxed">
                This portfolio is a concise preview of my growth within the world of photography. It showcases my development and ability to look at different aspects and angles of events and places in order to capture a moment worth hundreds of words.
              </p>
            </div>
            {/* Rest of the projects below */}
            {projectPhotos.slice(1).map((photo, index) => {
              const actualIndex = index + 1;
              const isLarge = actualIndex === 1 || actualIndex === 4;
              return (
                <div key={`project-${actualIndex}`} className={`order-3 md:order-none ${isLarge ? 'md:col-span-2' : ''}`}>
                  {renderGalleryItem(photo, actualIndex, 'project', projectRefs, isLarge, 'projects', projectPhotos)}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scroll Reveal Section - Hidden on mobile, only visible on desktop */}
      <div ref={scrollRevealRef} className="hidden md:block relative bg-primary-light/20 min-h-[300vh]">
        {/* Pinned center text */}
        <div
          ref={scrollRevealTextRef}
          className="relative h-screen flex items-center justify-center z-10"
        >
          <div className="text-center max-w-2xl px-8">
            <h2 className="font-display text-[clamp(2rem,6vw,5rem)] font-bold text-white tracking-tight leading-tight">
              Every Frame<br />
              <span className="font-serif italic font-normal text-yellow-500/60">Tells a Story</span>
            </h2>
            <p className="font-body text-white/40 text-base md:text-lg mt-8 leading-relaxed">
              From the electric atmosphere of live concerts to the intimate moments of a wedding day, I capture the emotions that make each event unique.
            </p>
            <a
              href="/contact"
              className="inline-block mt-10 px-10 py-4 border-2 border-yellow-500/60 text-yellow-500/60 font-display text-lg tracking-wide uppercase transition-all duration-300 hover:bg-yellow-500/60 hover:text-white"
            >
              Book a Session
            </a>
          </div>
        </div>

        {/* Images that appear on scroll */}
        {/* Image 1 - Left - Concert */}
        <div
          ref={(el) => { scrollRevealImagesRef.current[0] = el; }}
          className="absolute -left-8 top-[12%] w-[22vw] aspect-[3/4] overflow-hidden z-0"
        >
          <Image
            src={allPhotos[5]}
            alt="Concert"
            fill
            className="object-cover"
            sizes="22vw"
          />
        </div>

        {/* Image 2 - Right - Wedding */}
        <div
          ref={(el) => { scrollRevealImagesRef.current[1] = el; }}
          className="absolute -right-8 top-[22%] w-[24vw] aspect-[4/3] overflow-hidden z-0"
        >
          <Image
            src="/images/newpics/wedding5.jpg"
            alt="Wedding"
            fill
            className="object-cover"
            sizes="24vw"
          />
        </div>

        {/* Image 3 - Left - Project */}
        <div
          ref={(el) => { scrollRevealImagesRef.current[2] = el; }}
          className="absolute -left-4 top-[45%] w-[20vw] aspect-square overflow-hidden z-0"
        >
          <Image
            src={newPhotos.projects[2]}
            alt="Project"
            fill
            className="object-cover"
            sizes="20vw"
          />
        </div>

        {/* Image 4 - Right - Concert */}
        <div
          ref={(el) => { scrollRevealImagesRef.current[3] = el; }}
          className="absolute -right-4 top-[60%] w-[22vw] aspect-[3/4] overflow-hidden z-0"
        >
          <Image
            src={allPhotos[25]}
            alt="Concert"
            fill
            className="object-cover"
            sizes="22vw"
          />
        </div>
      </div>

      {/* Horizontal Scroll Gallery */}
      <div ref={horizontalRef} className="relative h-screen bg-primary overflow-hidden">
        {/* Scroll to explore - hidden on mobile */}
        <div className="hidden md:block absolute bottom-8 right-8 md:right-16 z-20">
          <p className="font-mono text-xs text-white/40 tracking-widest uppercase">
            Scroll to explore
          </p>
        </div>

        <div
          ref={horizontalTrackRef}
          className="absolute top-0 left-0 h-full flex items-center gap-3 sm:gap-4 md:gap-8 px-4 sm:px-8 md:px-16 will-change-transform"
          style={{ width: "fit-content" }}
        >
          {/* "More Work" intro panel */}
          <div className="flex-shrink-0 w-[85vw] sm:w-[80vw] md:w-[40vw] h-[60vh] sm:h-[70vh] flex items-center justify-center">
            <div className="text-center px-4">
              <h3 className="font-display text-[clamp(1.75rem,5vw,4rem)] font-bold text-white mb-2 sm:mb-4">
                More Work
              </h3>
              <p className="font-body text-white/50 text-xs sm:text-sm tracking-widest uppercase">
                Keep scrolling
              </p>
            </div>
          </div>

          {horizontalPhotos.map((photo, index) => (
            <div
              key={index}
              className="flex-shrink-0 relative w-[75vw] sm:w-[70vw] md:w-[35vw] h-[55vh] sm:h-[65vh] md:h-[70vh] overflow-hidden group cursor-pointer"
            >
              <Image
                src={photo.src}
                alt={`Gallery photo ${index + 1}`}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                sizes="100vw"
                quality={100}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="font-mono text-sm text-white/80">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
            </div>
          ))}

          {/* "Get in Touch" outro panel */}
          <div className="flex-shrink-0 w-[85vw] sm:w-[80vw] md:w-[40vw] h-[60vh] sm:h-[70vh] flex items-center justify-center">
            <div className="text-center px-4">
              <p className="font-body text-white/50 text-xs sm:text-sm tracking-widest uppercase mb-2 sm:mb-4">
                Want to work together?
              </p>
              <h3 className="font-display text-[clamp(1.75rem,5vw,4rem)] font-bold text-white">
                Get in Touch
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Footer section with background image */}
      <div className="relative py-20 sm:py-32 md:py-48 px-4 sm:px-8 md:px-16 min-h-[80vh] sm:min-h-screen flex items-center">
        {/* Gradient overlay at top for smooth transition from horizontal scroll */}
        <div className="absolute top-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-b from-primary to-transparent z-[5] pointer-events-none" />

        {/* Background image - positioned left on mobile */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/optimized/new-photos/36.jpg"
            alt="Ace Suasola"
            fill
            className="object-cover object-[25%_center] md:object-center"
            style={{ transform: "scaleX(-1)" }}
            quality={100}
          />
          {/* Darker overlay on mobile for text readability */}
          <div className="absolute inset-0 bg-black/40 md:bg-black/20" />
        </div>

        <div className="relative z-10 max-w-4xl">
          <h2 className="font-display text-[clamp(1.75rem,6vw,5rem)] font-bold text-white leading-tight">
            Capturing moments that matter.
          </h2>
          <p className="font-body text-white/60 text-sm sm:text-base md:text-lg lg:text-xl mt-6 sm:mt-8 max-w-2xl leading-relaxed">
            Based in Vancouver, available worldwide. Specializing in concert photography,
            weddings, and capturing the raw energy of live performances.
          </p>

          {/* Contact Info */}
          <div className="mt-10 sm:mt-14">
            <a
              href="mailto:acesuasola@gmail.com"
              className="font-body text-sm text-yellow-500/90 tracking-widest uppercase hover:text-yellow-400 transition-colors"
            >
              acesuasola@gmail.com
            </a>
          </div>

          {/* Social Links */}
          <div className="mt-6 sm:mt-8 flex flex-wrap gap-4 sm:gap-6">
            <a
              href="https://instagram.com/acesuasola"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-white text-sm tracking-widest uppercase border-b border-white/30 pb-1 hover:border-white transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://youtube.com/@AceSuasola"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-white text-sm tracking-widest uppercase border-b border-white/30 pb-1 hover:border-white transition-colors"
            >
              YouTube
            </a>
            <a
              href="https://linkedin.com/in/acesuasola"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-white text-sm tracking-widest uppercase border-b border-white/30 pb-1 hover:border-white transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        images={lightboxImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setLightboxIndex}
        categoryLink={lightboxCategory?.link}
        categoryLabel={lightboxCategory?.label}
      />
    </section>
  );
}
