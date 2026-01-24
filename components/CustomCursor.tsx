"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { animationConfig, prefersReducedMotion } from "@/lib/animations";

gsap.registerPlugin(useGSAP);

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLSpanElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check if touch device
    const checkTouchDevice = () => {
      setIsTouchDevice(
        "ontouchstart" in window || navigator.maxTouchPoints > 0
      );
    };
    checkTouchDevice();

    if (prefersReducedMotion() || isTouchDevice) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);

      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: animationConfig.cursor.duration,
        ease: animationConfig.cursor.ease,
      });

      gsap.to(cursorDotRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
      });
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Add hover listeners to interactive elements
    const handleElementHover = (e: Event) => {
      const target = e.target as HTMLElement;
      const hoverText = target.dataset.cursorText || "";

      setIsHovering(true);
      setCursorText(hoverText);
    };

    const handleElementLeave = () => {
      setIsHovering(false);
      setCursorText("");
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Add hover listeners to links and buttons
    const interactiveElements = document.querySelectorAll(
      'a, button, [data-cursor-hover], input, textarea, select, .show-image'
    );

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleElementHover);
      el.addEventListener("mouseleave", handleElementLeave);
    });

    // Add custom cursor class to body
    document.body.classList.add("custom-cursor-active");

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);

      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleElementHover);
        el.removeEventListener("mouseleave", handleElementLeave);
      });

      document.body.classList.remove("custom-cursor-active");
    };
  }, [isTouchDevice]);

  // Animation for hover state
  useGSAP(() => {
    if (!cursorRef.current) return;

    if (isHovering) {
      gsap.to(cursorRef.current, {
        width: cursorText ? 80 : 50,
        height: cursorText ? 80 : 50,
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        borderColor: "rgba(255, 255, 255, 0.8)",
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(cursorRef.current, {
        width: 40,
        height: 40,
        backgroundColor: "transparent",
        borderColor: "rgba(255, 255, 255, 0.6)",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [isHovering, cursorText]);

  // Don't render on touch devices or reduced motion
  if (isTouchDevice || prefersReducedMotion()) {
    return null;
  }

  return (
    <>
      {/* Main cursor circle */}
      <div
        ref={cursorRef}
        className={`fixed pointer-events-none z-[9999] rounded-full border -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          width: 40,
          height: 40,
          borderColor: "rgba(255, 255, 255, 0.6)",
        }}
      >
        <span
          ref={cursorTextRef}
          className={`text-[10px] font-body uppercase tracking-wider text-white transition-opacity duration-200 ${
            cursorText ? "opacity-100" : "opacity-0"
          }`}
        >
          {cursorText || "View"}
        </span>
      </div>

      {/* Cursor dot */}
      <div
        ref={cursorDotRef}
        className={`fixed pointer-events-none z-[9999] w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${
          isVisible && !isHovering ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}
