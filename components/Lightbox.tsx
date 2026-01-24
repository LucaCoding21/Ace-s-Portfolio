"use client";

import { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface LightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  categoryLink?: string;
  categoryLabel?: string;
}

export default function Lightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  categoryLink,
  categoryLabel,
}: LightboxProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          if (currentIndex > 0) {
            onNavigate(currentIndex - 1);
          }
          break;
        case "ArrowRight":
          if (currentIndex < images.length - 1) {
            onNavigate(currentIndex + 1);
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Prevent body scroll
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  // Animation for open/close
  useGSAP(
    () => {
      if (!overlayRef.current || !imageRef.current) return;

      if (isOpen) {
        gsap.to(overlayRef.current, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.fromTo(
          imageRef.current,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" }
        );
      }
    },
    { dependencies: [isOpen] }
  );

  // Animation for image change
  useGSAP(
    () => {
      if (!imageRef.current || !isOpen) return;

      gsap.fromTo(
        imageRef.current,
        { opacity: 0.5, x: 20 },
        { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }
      );
    },
    { dependencies: [currentIndex] }
  );

  const handleClose = useCallback(() => {
    if (!overlayRef.current || !imageRef.current) {
      onClose();
      return;
    }

    gsap.to(imageRef.current, {
      scale: 0.9,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: onClose,
    });
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center opacity-0"
      onClick={handleClose}
    >
      {/* Close button - larger touch target on mobile */}
      <button
        onClick={handleClose}
        className="absolute top-4 sm:top-6 right-4 sm:right-6 z-10 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center text-white/60 hover:text-white transition-colors touch-manipulation"
        aria-label="Close lightbox"
      >
        <svg
          className="w-7 h-7 sm:w-8 sm:h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Navigation arrows - larger touch targets */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(currentIndex - 1);
          }}
          className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center text-white/60 hover:text-white transition-colors touch-manipulation"
          aria-label="Previous image"
        >
          <svg
            className="w-7 h-7 sm:w-8 sm:h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {currentIndex < images.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(currentIndex + 1);
          }}
          className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center text-white/60 hover:text-white transition-colors touch-manipulation"
          aria-label="Next image"
        >
          <svg
            className="w-7 h-7 sm:w-8 sm:h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}

      {/* Image container - responsive sizing */}
      <div
        ref={imageRef}
        className="relative w-[95vw] sm:w-[90vw] h-[70vh] sm:h-[75vh] md:h-[80vh] max-w-6xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[currentIndex]}
          alt={`Gallery image ${currentIndex + 1}`}
          fill
          className="object-contain"
          sizes="100vw"
          quality={100}
          priority
        />
      </div>

      {/* Bottom bar with counter and gallery link - improved mobile layout */}
      <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 px-4">
        <div className="text-white/60 text-xs sm:text-sm font-mono">
          {currentIndex + 1} / {images.length}
        </div>
        {categoryLink && (
          <Link
            href={categoryLink}
            className="px-4 py-2 border border-white/30 text-white text-[10px] sm:text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 touch-manipulation"
            onClick={(e) => e.stopPropagation()}
          >
            View All {categoryLabel || "Gallery"}
          </Link>
        )}
      </div>
    </div>
  );
}
