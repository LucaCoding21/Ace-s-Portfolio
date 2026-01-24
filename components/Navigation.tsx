"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLAnchorElement[]>([]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Detect scroll to change nav color
  useEffect(() => {
    const handleScroll = () => {
      // Change color after scrolling past hero (roughly 100vh)
      setIsScrolled(window.scrollY > window.innerHeight * 0.8);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle body class for menu open state (to hide hero text)
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
    return () => document.body.classList.remove("menu-open");
  }, [isMenuOpen]);

  // Fade in on mount - same timing as hero text
  useGSAP(() => {
    if (!logoRef.current || !menuButtonRef.current) return;

    gsap.fromTo(
      [logoRef.current, menuButtonRef.current],
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: "power2.out" }
    );
  }, []);

  useGSAP(
    () => {
      if (!menuRef.current) return;

      if (isMenuOpen) {
        // Open menu animation
        gsap.to(menuRef.current, {
          clipPath: "circle(150% at calc(100% - 2.5rem) 2.5rem)",
          duration: 0.8,
          ease: "power3.inOut",
        });

        // Stagger in menu items
        gsap.fromTo(
          menuItemsRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.5,
            delay: 0.3,
            ease: "power3.out",
          }
        );
      } else {
        // Close menu animation
        gsap.to(menuRef.current, {
          clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)",
          duration: 0.6,
          ease: "power3.inOut",
        });
      }
    },
    { dependencies: [isMenuOpen] }
  );

  const navLinks: Array<{ href: string; label: string; isBooking?: boolean }> = [
    { href: "/", label: "Home" },
    { href: "/work", label: "Work" },
    { href: "/contact", label: "Contact" },
    { href: "/contact", label: "Book Now", isBooking: true },
  ];

  return (
    <>
      {/* Fixed header - improved mobile spacing */}
      <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
        {/* Logo with animated border */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = "/";
          }}
          className="group relative px-4 py-2 border border-white/30 transition-all duration-300 hover:border-white hover:bg-white/5"
          ref={logoRef}
        >
          <span className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white transition-all duration-300 group-hover:tracking-widest">
            ACE
          </span>
          {/* Animated corner accents on hover */}
          <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0" />
          <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0" />
          <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0" />
          <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0" />
        </a>

        {/* Menu toggle button - more visible on mobile with border */}
        <button
          ref={menuButtonRef}
          onClick={toggleMenu}
          className="relative z-[60] w-12 h-12 sm:w-12 sm:h-12 flex flex-col items-center justify-center gap-[6px] group opacity-0 touch-manipulation border border-white/40 md:border-transparent rounded-lg md:rounded-none bg-black/20 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          data-cursor-hover
        >
          {/* Top line - slides right on hover, rotates when open */}
          <span
            className={`h-[2px] bg-white transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] origin-center ${
              isMenuOpen
                ? "w-6 rotate-45 translate-y-[8px]"
                : "w-6 group-hover:w-5 group-hover:translate-x-1"
            }`}
          />
          {/* Middle line - width changes on hover, disappears when open */}
          <span
            className={`h-[2px] bg-white transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              isMenuOpen
                ? "w-0 opacity-0"
                : "w-4 group-hover:w-6"
            }`}
          />
          {/* Bottom line - slides left on hover, rotates when open */}
          <span
            className={`h-[2px] bg-white transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] origin-center ${
              isMenuOpen
                ? "w-6 -rotate-45 -translate-y-[8px]"
                : "w-6 group-hover:w-5 group-hover:-translate-x-1"
            }`}
          />
        </button>
      </header>

      {/* Fullscreen menu overlay */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-[55] bg-primary flex items-center justify-center"
        style={{
          clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)",
        }}
      >
        {/* Close button with motion design - improved touch target */}
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-4 sm:top-6 right-4 sm:right-6 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center group touch-manipulation"
          aria-label="Close menu"
          data-cursor-hover
        >
          <span className="absolute w-7 h-[2px] bg-white rotate-45 transition-all duration-300 ease-out group-hover:w-8 group-hover:rotate-[135deg]" />
          <span className="absolute w-7 h-[2px] bg-white -rotate-45 transition-all duration-300 ease-out group-hover:w-8 group-hover:rotate-[45deg]" />
        </button>

        <nav className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8">
          {navLinks.map((link, index) => (
            link.isBooking ? (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                ref={(el) => {
                  if (el) menuItemsRef.current[index] = el;
                }}
                onClick={() => setIsMenuOpen(false)}
                className="mt-4 sm:mt-8 px-8 sm:px-10 py-3 sm:py-4 border-2 border-yellow-500/60 bg-transparent text-yellow-500/60 font-display text-lg sm:text-xl md:text-2xl tracking-wide uppercase transition-all duration-300 hover:bg-yellow-500/60 hover:text-white touch-manipulation"
                data-cursor-hover
              >
                {link.label}
              </Link>
            ) : (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                ref={(el) => {
                  if (el) menuItemsRef.current[index] = el;
                }}
                onClick={() => setIsMenuOpen(false)}
                className={`font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl tracking-tight transition-all duration-300 touch-manipulation ${
                  pathname === link.href
                    ? "text-white"
                    : "text-white/40 hover:text-white"
                }`}
                data-cursor-hover
              >
                {link.label}
              </Link>
            )
          ))}

          {/* Social links - responsive layout */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-8 sm:mt-12 opacity-60 px-4">
            <a
              href="https://instagram.com/acesuasola"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm tracking-widest uppercase text-white/60 hover:text-white transition-colors py-2 touch-manipulation"
              data-cursor-hover
            >
              Instagram
            </a>
            <a
              href="https://youtube.com/@AceSuasola"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm tracking-widest uppercase text-white/60 hover:text-white transition-colors py-2 touch-manipulation"
              data-cursor-hover
            >
              YouTube
            </a>
            <a
              href="https://linkedin.com/in/acesuasola"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm tracking-widest uppercase text-white/60 hover:text-white transition-colors py-2 touch-manipulation"
              data-cursor-hover
            >
              LinkedIn
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
