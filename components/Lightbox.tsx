"use client";

import { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface LightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function Lightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
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
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center text-white/60 hover:text-white transition-colors"
        aria-label="Close lightbox"
      >
        <svg
          className="w-8 h-8"
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

      {/* Navigation arrows */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(currentIndex - 1);
          }}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          aria-label="Previous image"
        >
          <svg
            className="w-8 h-8"
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
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          aria-label="Next image"
        >
          <svg
            className="w-8 h-8"
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

      {/* Image container */}
      <div
        ref={imageRef}
        className="relative w-[90vw] h-[80vh] max-w-6xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[currentIndex]}
          alt={`Gallery image ${currentIndex + 1}`}
          fill
          className="object-contain"
          sizes="100vw"
          quality={90}
          priority
        />
      </div>

      {/* Image counter */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm font-mono">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
