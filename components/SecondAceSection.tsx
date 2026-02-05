"use client";

import { useRef, useLayoutEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { allPhotos, newPhotos, shows } from "@/lib/shows";
import { prefersReducedMotion } from "@/lib/animations";
import Lightbox from "./Lightbox";

gsap.registerPlugin(ScrollTrigger);

// Clickable section title component
function SectionTitle({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="font-display text-[clamp(2.5rem,8vw,6rem)] font-bold text-white tracking-tight inline-block relative group"
    >
      {children}
      <span className="absolute bottom-0 left-0 w-full h-[2px] md:h-[3px] bg-yellow-500/70 origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
    </Link>
  );
}

interface SecondAceSectionProps {
  isVisible: boolean;
}

// Featured concert photos
const concertPhotos = [
  { src: "/images/newpics/guitarist.jpg", caption: "Stage Presence", alt: "Guitarist performing live on stage in Vancouver" },
  { src: "/images/optimized/new-photos/25.jpg", caption: "The Jam", alt: "Live jam session captured at a Vancouver music venue" },
  { src: "/images/optimized/new-photos/40.jpg", caption: "The Crowd", alt: "Concert crowd energy during a live show in Vancouver" },
  { src: "/images/newpics/DJ.jpg", caption: "Party Vibes", alt: "DJ performing at a Vancouver nightlife event" },
  { src: "/images/optimized/new-photos/49.jpg", caption: "Performance", alt: "Artist performing live at a music event in Vancouver, BC" },
];

// Wedding photos section
const weddingPhotos = [
  { src: "/images/newpics/wedding9.jpg", caption: "First Dance", alt: "Couple sharing their first dance at a Vancouver wedding" },
  { src: "/images/newpics/wedding8.jpg", caption: "The Bride", alt: "Bridal portrait captured on a wedding day in Vancouver" },
  { src: "/images/newpics/wedding1.jpg", caption: "Golden Hour", alt: "Golden hour wedding portrait in Vancouver, BC" },
  { src: "/images/newpics/wedding3.jpg", caption: "Celebration", alt: "Wedding celebration moment at a Vancouver venue" },
  { src: "/images/newpics/wedding2.jpg", caption: "Forever", alt: "Intimate wedding moment photographed in Vancouver" },
];

// Project photos with custom positioning
const projectAlts = [
  "Creative photography project by Ace Suasola in Vancouver",
  "Portrait and editorial photography project in BC",
  "Vancouver-based creative photography work",
  "Commissioned photography project in Vancouver, BC",
  "Creative visual project by a Vancouver photographer",
];
const projectPhotos = newPhotos.projects.map((src, i) => ({
  src,
  caption: ["Project I", "Project II", "Project III", "Project IV", "Project V"][i],
  alt: projectAlts[i],
  objectPosition: [undefined, "center 85%", undefined, "center 70%", undefined][i], // Project II and IV positioned lower
}));

// Featured cafe photos
const cafeShow = shows.find(s => s.slug === "cafes");
const cafeAlts = [
  "Busy specialty coffee shop interior with customers in Vancouver",
  "Barista making coffee with dreamy bokeh in warm golden light",
  "Overhead view of latte art heart design with monstera leaves",
  "Golden hour cafe interior with people socializing and hanging plants",
  "Bohemian cafe interior with string lights and guitar decor",
];
const cafePhotos = newPhotos.cafes.map((src, i) => ({
  src,
  caption: ["The Scene", "The Craft", "Latte Art", "Golden Hour", "The Vibe"][i],
  alt: cafeAlts[i],
}));

// Horizontal scroll photos - 5 photos with category links
const horizontalPhotos = [
  { src: allPhotos[35], category: "concerts", label: "Concerts", alt: "Concert performance photographed in Vancouver" },
  { src: newPhotos.weddings[4], category: "weddings", label: "Weddings", alt: "Wedding moment captured by a Vancouver photographer" },
  { src: allPhotos[40], category: "concerts", label: "Concerts", alt: "Live music photography at a Vancouver venue" },
  { src: newPhotos.projects[4], category: "projects", label: "Projects", alt: "Creative photography project in Vancouver, BC" },
  { src: allPhotos[45], category: "concerts", label: "Concerts", alt: "High-energy concert photo from a Vancouver show" },
  { src: newPhotos.cafes[0], category: "cafes", label: "Cafes", alt: "Specialty coffee shop interior in Vancouver" },
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
  const cafeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const feelEnergyRef = useRef<HTMLHeadingElement>(null);
  const hasAnimatedEntrance = useRef(false);
  const [hoveredIndex, setHoveredIndex] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxCategory, setLightboxCategory] = useState<{ link: string; label: string } | null>(null);
  const [ctaHovered, setCtaHovered] = useState(false);
  const [scrollCtaHovered, setScrollCtaHovered] = useState(false);

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
      animateGallery(cafeRefs.current);

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
          refreshPriority: 1,
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
        // On mobile, reduce the vertical scroll distance so the gallery
        // doesn't create excessive scroll space. The horizontal content
        // scrolls faster relative to vertical scroll as a result.
        const scrollEnd = isMobileView ? totalWidth * 0.6 : totalWidth;

        // Force GPU layer creation before animation starts
        gsap.set(track, { force3D: true });

        gsap.to(track, {
          x: -totalWidth,
          ease: "none",
          scrollTrigger: {
            trigger: horizontalRef.current,
            start: "top top",
            end: () => `+=${scrollEnd}`,
            scrub: isMobileView ? 0.3 : 0.5, // Reduced scrub for snappier response
            pin: true,
            anticipatePin: 1,
            pinSpacing: true,
            invalidateOnRefresh: true,
            fastScrollEnd: true,
            refreshPriority: 1, // Higher priority so it calculates earlier
          },
        });
      }

      // Delayed refresh to ensure proper calculations after layout settles
      const refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);

      // Also refresh when all images are loaded
      const handleLoad = () => {
        ScrollTrigger.refresh();
      };
      window.addEventListener('load', handleLoad);

      // Additional refresh after images in this section load
      const images = sectionRef.current?.querySelectorAll('img');
      let loadedCount = 0;
      const totalImages = images?.length || 0;

      const onImageLoad = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          ScrollTrigger.refresh();
        }
      };

      images?.forEach((img) => {
        if (img.complete) {
          loadedCount++;
        } else {
          img.addEventListener('load', onImageLoad);
        }
      });

      // If all images were already loaded
      if (loadedCount === totalImages && totalImages > 0) {
        ScrollTrigger.refresh();
      }

      return () => {
        clearTimeout(refreshTimeout);
        window.removeEventListener('load', handleLoad);
        images?.forEach((img) => {
          img.removeEventListener('load', onImageLoad);
        });
      };
    }, sectionRef);

    return () => ctx.revert();
  }, [isVisible]);

  if (!isVisible) return null;

  const renderGalleryItem = (
    photo: { src: string; caption: string; alt?: string; objectPosition?: string },
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
      cafes: "Cafes",
    };
    return (
      <div
        key={key}
        ref={(el) => { refs.current[index] = el; }}
        className={`relative overflow-hidden group block cursor-pointer ${isLarge ? 'md:col-span-2 aspect-[16/9]' : 'aspect-[4/5] md:aspect-[3/4]'
          }`}
        data-cursor-text="View"
        data-photo-caption={photo.caption}
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
            alt={photo.alt || photo.caption}
            fill
            className={`object-cover transition-transform duration-700 ease-out ${hoveredIndex === key ? 'scale-[1.02]' : 'scale-100'
              }`}
            style={photo.objectPosition ? { objectPosition: photo.objectPosition } : undefined}
            sizes="100vw"
            quality={100}
          />
        </div>
        <div
          className={`absolute inset-0 bg-black/20 transition-opacity duration-500 ${hoveredIndex === key ? 'opacity-100' : 'opacity-0'
            }`}
        />
        {/* Hover content */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-6 md:p-8 transition-all duration-500 ${hoveredIndex === key ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
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
          <div className="px-4 sm:px-8 md:px-16 mb-12 sm:mb-16 md:mb-24 text-right ml-auto">
            <h2>
              <SectionTitle href="/show/concerts">Concerts</SectionTitle>
            </h2>
            <div className="mt-4">
              <p className="font-body text-yellow-500/60 text-sm md:text-base tracking-widest uppercase">
                Live Music Photography
              </p>
            </div>
            <p className="font-body text-white/40 text-base md:text-lg mt-6 max-w-2xl leading-relaxed ml-auto">
              Capturing the raw energy and emotion of live performances across Vancouver and beyond. From intimate venues to outdoor festivals, every show tells a story worth reliving.
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
          <h2>
            <SectionTitle href="/show/weddings">Weddings</SectionTitle>
          </h2>
          <div className="mt-4">
            <p className="font-body text-yellow-500/60 text-sm md:text-base tracking-widest uppercase">
              Timeless Moments
            </p>
          </div>
          <p className="font-body text-white/40 text-base md:text-lg mt-6 max-w-2xl leading-relaxed">
            Documenting the beauty and emotion of your wedding day in Vancouver and across British Columbia. Every glance, every smile, every tear of joy, preserved forever.
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
              <h2>
                <SectionTitle href="/show/projects">Projects</SectionTitle>
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
              From the electric atmosphere of live concerts in Vancouver to the intimate moments of a wedding celebration, I photograph the emotions that make each event one of a kind.
            </p>
            <motion.a
              href="/contact"
              className="inline-block mt-10 relative cursor-pointer"
              onMouseEnter={() => setScrollCtaHovered(true)}
              onMouseLeave={() => setScrollCtaHovered(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              data-cursor-hover
            >
              {/* White pill container */}
              <div className="relative px-8 py-3 rounded-full bg-white overflow-hidden">
                {/* Solid yellow fill on hover */}
                <motion.div
                  className="absolute inset-0 bg-yellow-500"
                  initial={{ x: "-100%" }}
                  animate={{ x: scrollCtaHovered ? "0%" : "-100%" }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />

                {/* Text with character stagger */}
                <div className="relative z-10 flex justify-center">
                  {"Get in touch".split("").map((char, i) => (
                    <motion.span
                      key={i}
                      className="font-display text-base tracking-wide text-black"
                      animate={{
                        y: scrollCtaHovered ? [0, -3, 0] : 0,
                      }}
                      transition={{
                        y: { duration: 0.4, delay: i * 0.02, ease: [0.22, 1, 0.36, 1] },
                      }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.a>
          </div>
        </div>

        {/* Images that appear on scroll */}
        {/* Image 1 - Left - Concert */}
        <div
          ref={(el) => { scrollRevealImagesRef.current[0] = el; }}
          className="absolute left-8 top-[12%] w-[22vw] aspect-[3/4] overflow-hidden z-0 rounded-sm shadow-2xl"
        >
          <Image
            src={allPhotos[5]}
            alt="Live concert photography by Ace Suasola in Vancouver"
            fill
            className="object-cover"
            sizes="22vw"
          />
        </div>

        {/* Image 2 - Right - Wedding */}
        <div
          ref={(el) => { scrollRevealImagesRef.current[1] = el; }}
          className="absolute right-8 top-[22%] w-[24vw] aspect-[4/3] overflow-hidden z-0 rounded-sm shadow-2xl"
        >
          <Image
            src="/images/newpics/wedding5.jpg"
            alt="Wedding photography moment captured in Vancouver, BC"
            fill
            className="object-cover"
            sizes="24vw"
          />
        </div>

        {/* Image 3 - Left - Project */}
        <div
          ref={(el) => { scrollRevealImagesRef.current[2] = el; }}
          className="absolute left-12 top-[45%] w-[20vw] aspect-square overflow-hidden z-0 rounded-sm shadow-2xl"
        >
          <Image
            src={newPhotos.projects[2]}
            alt="Creative photography project by a Vancouver photographer"
            fill
            className="object-cover"
            sizes="20vw"
          />
        </div>

        {/* Image 4 - Right - Concert */}
        <div
          ref={(el) => { scrollRevealImagesRef.current[3] = el; }}
          className="absolute right-12 top-[60%] w-[22vw] aspect-[3/4] overflow-hidden z-0 rounded-sm shadow-2xl"
        >
          <Image
            src={allPhotos[25]}
            alt="Musician performing live at a Vancouver music venue"
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
          style={{ width: "fit-content", transform: "translateX(0)" }}
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
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 75vw, 35vw"
                quality={100}
                priority={index < 3} // Preload first 3 images to prevent layout shift
                loading={index < 3 ? undefined : "eager"} // Load remaining images eagerly
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="font-mono text-sm text-white/80">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
            </div>
          ))}

          {/* "Get in Touch" outro panel - CTA with image reveal */}
          <div className="flex-shrink-0 w-[85vw] sm:w-[80vw] md:w-[50vw] h-[60vh] sm:h-[70vh] flex items-center justify-center">
            <div className="text-center px-4">
              <p className="font-body text-white/50 text-xs sm:text-sm tracking-widest uppercase mb-4 sm:mb-6">
                Want to work together?
              </p>
              <a
                href="/contact"
                className="group inline-flex flex-col items-center justify-center cursor-pointer"
                data-cursor-hover
                onMouseEnter={() => setCtaHovered(true)}
                onMouseLeave={() => setCtaHovered(false)}
              >
                <div className="inline-flex items-center justify-center">
                  <span className="font-display text-[clamp(1.75rem,5vw,4rem)] font-bold text-white">
                    Get in
                  </span>
                  <motion.div
                    className="overflow-hidden mx-2"
                    initial={{ width: 0 }}
                    animate={{ width: ctaHovered ? "auto" : 0 }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <div className="w-[15vw] sm:w-[10vw] md:w-[7vw] aspect-[3/4] relative rounded-sm overflow-hidden">
                      <Image
                        src="/acephoto.jpg"
                        alt="Ace Suasola, Vancouver-based photographer"
                        fill
                        className="object-cover"
                        sizes="20vw"
                      />
                    </div>
                  </motion.div>
                  <span className="font-display text-[clamp(1.75rem,5vw,4rem)] font-bold text-white">
                    Touch
                  </span>
                </div>
                {/* Animated underline */}
                <div className="relative w-full h-[2px] mt-2 overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-white"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: ctaHovered ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    style={{ transformOrigin: "left" }}
                  />
                  <div className="absolute inset-0 bg-white/30" />
                </div>
              </a>
              <p className="font-body text-white/30 text-xs tracking-wide mt-6">
                Click to start a conversation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Footer Reveal */}
      <div
        className="relative h-[60vh] md:h-screen bg-black"
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        <div className="fixed bottom-0 left-0 right-0 h-[60vh] md:h-screen w-full">
          {/* Footer content */}
          <div className="relative h-full px-4 sm:px-8 md:px-16 flex items-center">
            {/* Background image - positioned left on mobile */}
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src="/images/footer.jpg"
                alt="Ace Suasola, Vancouver photographer, on location"
                fill
                className="object-cover object-[25%_center] md:object-center"
                style={{ transform: "scaleX(-1)" }}
                quality={100}
              />
              {/* Gradient overlay for text readability - stronger on left */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            </div>

            <div className="relative z-10 max-w-4xl">
              <h2 className="font-display text-[clamp(1.75rem,6vw,5rem)] font-bold text-white leading-tight">
                Capturing moments that matter.
              </h2>
              <p className="font-body text-white/60 text-sm sm:text-base md:text-lg lg:text-xl mt-6 sm:mt-8 max-w-2xl leading-relaxed">
                Based in Vancouver, BC and available for bookings worldwide. From concert stages to wedding ceremonies, I capture the moments that move you.
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
                  href="https://www.youtube.com/channel/UCS7vf4Riw92qyM1gF7L6t_A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-white text-sm tracking-widest uppercase border-b border-white/30 pb-1 hover:border-white transition-colors"
                >
                  YouTube
                </a>
                <a
                  href="https://www.linkedin.com/in/ace-suasola-02a137255/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-white text-sm tracking-widest uppercase border-b border-white/30 pb-1 hover:border-white transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </div>
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
