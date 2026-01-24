"use client";

import { useRef } from "react";
import Image from "next/image";
import { useScroll, useTransform, motion } from "framer-motion";

interface ZoomParallaxProps {
  images: string[];
}

export default function ZoomParallax({ images }: ZoomParallaxProps) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  // Center image scales to completely fill screen (25vw -> 110vw needs ~4.4x)
  // Others scale faster so they move off screen before center fills
  const scaleCenter = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale7 = useTransform(scrollYProgress, [0, 1], [1, 7]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);
  const scale10 = useTransform(scrollYProgress, [0, 1], [1, 10]);

  // Fade out title as we scroll
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const pictures = [
    { src: images[0], scale: scaleCenter },
    { src: images[1], scale: scale6 },
    { src: images[2], scale: scale7 },
    { src: images[3], scale: scale6 },
    { src: images[4], scale: scale7 },
    { src: images[5], scale: scale9 },
    { src: images[6], scale: scale10 },
  ];

  return (
    <div ref={container} className="h-[200vh] md:h-[300vh] relative z-20">
      <div className="sticky top-0 h-screen bg-primary overflow-hidden">
        {/* Title overlay - fades out as you scroll */}
        <motion.div
          style={{ opacity: titleOpacity }}
          className="absolute bottom-8 left-4 sm:bottom-12 sm:left-8 md:bottom-16 md:left-16 z-20 pointer-events-none max-w-[90vw] sm:max-w-xl"
        >
          <p className="font-body text-white/50 text-xs sm:text-sm md:text-base tracking-widest uppercase mb-2 sm:mb-4">
            Live Music Photography
          </p>
          <h2 className="font-display text-[clamp(2rem,8vw,5rem)] font-bold text-white tracking-tight drop-shadow-lg">
            Concerts
          </h2>
          <p className="font-body text-white/40 text-xs sm:text-sm md:text-base mt-2 sm:mt-4 leading-relaxed drop-shadow-md">
            Capturing the raw energy and emotion of live performances. From intimate venues to massive festivals, every show tells a unique story.
          </p>
        </motion.div>

        {/* Images */}
        <div className="relative w-full h-full flex items-center justify-center">
          {pictures.map(({ src, scale }, index) => (
            <motion.div
              key={index}
              style={{ scale }}
              className="absolute w-full h-full top-0 left-0 flex items-center justify-center"
            >
              <div className="relative" style={getImageContainerStyle(index)}>
                <Image
                  src={src}
                  alt={`Parallax image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  quality={100}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Returns the positioning and size styles for each image container
// Mobile-optimized: larger center image, closer surrounding images
function getImageContainerStyle(index: number): React.CSSProperties {
  // Check if mobile (client-side only)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const mobileStyles: React.CSSProperties[] = [
    // Image 1 - center main (larger on mobile)
    {
      width: "40vw",
      height: "35vh",
    },
    // Image 2 - top
    {
      width: "28vw",
      height: "22vh",
      top: "-20vh",
      left: "0vw",
    },
    // Image 3 - left (closer on mobile)
    {
      width: "22vw",
      height: "30vh",
      top: "-5vh",
      left: "-16vw",
    },
    // Image 4 - right
    {
      width: "24vw",
      height: "20vh",
      left: "18vw",
    },
    // Image 5 - bottom center-right
    {
      width: "20vw",
      height: "18vh",
      top: "22vh",
      left: "5vw",
    },
    // Image 6 - bottom left
    {
      width: "22vw",
      height: "18vh",
      top: "22vh",
      left: "-14vw",
    },
    // Image 7 - bottom right
    {
      width: "16vw",
      height: "14vh",
      top: "18vh",
      left: "16vw",
    },
  ];

  const desktopStyles: React.CSSProperties[] = [
    // Image 1 - center main (25vw * 5 = 125vw, fully covers screen)
    {
      width: "25vw",
      height: "30vh",
    },
    // Image 2 - top left
    {
      width: "30vw",
      height: "25vh",
      top: "-28vh",
      left: "5vw",
    },
    // Image 3 - left
    {
      width: "18vw",
      height: "35vh",
      top: "-5vh",
      left: "-22vw",
    },
    // Image 4 - right
    {
      width: "22vw",
      height: "22vh",
      left: "25vw",
    },
    // Image 5 - bottom center-right
    {
      width: "18vw",
      height: "22vh",
      top: "25vh",
      left: "8vw",
    },
    // Image 6 - bottom left
    {
      width: "25vw",
      height: "22vh",
      top: "25vh",
      left: "-20vw",
    },
    // Image 7 - bottom right
    {
      width: "14vw",
      height: "14vh",
      top: "20vh",
      left: "22vw",
    },
  ];

  const styles = isMobile ? mobileStyles : desktopStyles;
  return styles[index] || styles[0];
}
