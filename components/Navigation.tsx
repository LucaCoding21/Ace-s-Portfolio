"use client";

import { useRef, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import AnimatedButton from "./AnimatedButton";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWorkExpanded, setIsWorkExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<(HTMLAnchorElement | HTMLButtonElement | null)[]>([]);
  const workSubMenuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Reset work expanded state when menu closes
  useEffect(() => {
    if (!isMenuOpen) {
      setIsWorkExpanded(false);
    }
  }, [isMenuOpen]);

  // Animate work submenu
  useEffect(() => {
    if (!workSubMenuRef.current) return;

    if (isWorkExpanded) {
      gsap.to(workSubMenuRef.current, {
        height: "auto",
        opacity: 1,
        duration: 0.4,
        ease: "power3.out",
      });
      // Stagger in the sub-items
      gsap.fromTo(
        workSubMenuRef.current.querySelectorAll("a"),
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.3,
          delay: 0.1,
          ease: "power2.out",
        }
      );
    } else {
      gsap.to(workSubMenuRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power3.inOut",
      });
    }
  }, [isWorkExpanded]);

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
          clipPath: "circle(150% at 2.5rem 2.5rem)",
          duration: 0.8,
          ease: "power3.inOut",
        });

        // Stagger in menu items
        gsap.fromTo(
          menuItemsRef.current.filter(Boolean),
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
          clipPath: "circle(0% at 2.5rem 2.5rem)",
          duration: 0.6,
          ease: "power3.inOut",
        });
      }
    },
    { dependencies: [isMenuOpen] }
  );

  const workSubLinks = [
    { href: "/show/concerts", label: "Concerts" },
    { href: "/show/weddings", label: "Weddings" },
    { href: "/show/projects", label: "Projects" },
  ];

  const isWorkActive = pathname.startsWith("/show/") || pathname === "/work";

  return (
    <>
      {/* Fixed header - improved mobile spacing */}
      <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-transparent pointer-events-none -z-10" />
        {/* Menu toggle button - white circle on the left */}
        <button
          ref={menuButtonRef}
          onClick={toggleMenu}
          className="relative z-[60] w-11 h-11 sm:w-12 sm:h-12 flex flex-col items-center justify-center gap-[5px] group opacity-0 touch-manipulation rounded-full bg-white transition-all duration-300 hover:scale-105"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          data-cursor-hover
        >
          {/* Top line - slides right on hover, rotates when open */}
          <span
            className={`h-[2px] bg-black transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] origin-center ${
              isMenuOpen
                ? "w-5 rotate-45 translate-y-[7px]"
                : "w-5 group-hover:w-4 group-hover:translate-x-0.5"
            }`}
          />
          {/* Middle line - width changes on hover, disappears when open */}
          <span
            className={`h-[2px] bg-black transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              isMenuOpen
                ? "w-0 opacity-0"
                : "w-3 group-hover:w-5"
            }`}
          />
          {/* Bottom line - slides left on hover, rotates when open */}
          <span
            className={`h-[2px] bg-black transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] origin-center ${
              isMenuOpen
                ? "w-5 -rotate-45 -translate-y-[7px]"
                : "w-5 group-hover:w-4 group-hover:-translate-x-0.5"
            }`}
          />
        </button>

        {/* Logo centered */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = "/";
          }}
          className="group absolute left-1/2 -translate-x-1/2 px-4 py-2 border border-white/30 transition-all duration-300 hover:border-white hover:bg-white/5"
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

        {/* Get in Touch button - on the right */}
        <AnimatedButton href="/contact">
          Get in Touch
        </AnimatedButton>
      </header>

      {/* Fullscreen menu overlay */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-[55] bg-primary flex items-center justify-center"
        style={{
          clipPath: "circle(0% at 2.5rem 2.5rem)",
        }}
      >
        {/* Close button - white circle matching hamburger */}
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-4 sm:top-6 left-4 sm:left-6 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center group touch-manipulation rounded-full bg-white transition-all duration-300 hover:scale-105"
          aria-label="Close menu"
          data-cursor-hover
        >
          <span className="absolute w-5 h-[2px] bg-black rotate-45 transition-all duration-300 ease-out" />
          <span className="absolute w-5 h-[2px] bg-black -rotate-45 transition-all duration-300 ease-out" />
        </button>

        <nav className="flex flex-col items-center gap-2 sm:gap-3 md:gap-4">
          {/* Home */}
          <Link
            href="/"
            ref={(el) => { menuItemsRef.current[0] = el; }}
            onClick={() => setIsMenuOpen(false)}
            className={`font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight transition-all duration-300 touch-manipulation ${
              pathname === "/"
                ? "text-white"
                : "text-white/40 hover:text-white"
            }`}
            data-cursor-hover
          >
            Home
          </Link>

          {/* Work with expandable submenu */}
          <div className="flex flex-col items-center">
            <button
              ref={(el) => { menuItemsRef.current[1] = el; }}
              onClick={() => setIsWorkExpanded(!isWorkExpanded)}
              className={`font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight transition-all duration-300 touch-manipulation flex items-center gap-2 sm:gap-3 ${
                isWorkActive
                  ? "text-white"
                  : "text-white/40 hover:text-white"
              }`}
              data-cursor-hover
            >
              Work
              <span
                className={`inline-block transition-transform duration-300 text-xl sm:text-2xl md:text-3xl ${
                  isWorkExpanded ? "rotate-45" : "rotate-0"
                }`}
              >
                +
              </span>
            </button>

            {/* Submenu */}
            <div
              ref={workSubMenuRef}
              className="overflow-hidden h-0 opacity-0"
            >
              <div className="flex flex-col items-center gap-1 sm:gap-2 pt-2 sm:pt-3">
                {workSubLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`font-display text-lg sm:text-xl md:text-2xl tracking-wide transition-all duration-300 touch-manipulation ${
                      pathname === link.href
                        ? "text-white"
                        : "text-white/50 hover:text-white hover:tracking-widest"
                    }`}
                    data-cursor-hover
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Contact */}
          <Link
            href="/contact"
            ref={(el) => { menuItemsRef.current[2] = el; }}
            onClick={() => setIsMenuOpen(false)}
            className={`font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight transition-all duration-300 touch-manipulation ${
              pathname === "/contact"
                ? "text-white"
                : "text-white/40 hover:text-white"
            }`}
            data-cursor-hover
          >
            Contact
          </Link>

          {/* Book Now */}
          <Link
            href="/contact"
            ref={(el) => { menuItemsRef.current[3] = el; }}
            onClick={() => setIsMenuOpen(false)}
            className="mt-2 sm:mt-4 px-6 sm:px-8 py-2 sm:py-3 border-2 border-yellow-500/60 bg-transparent text-yellow-500/60 font-display text-base sm:text-lg md:text-xl tracking-wide uppercase transition-all duration-300 hover:bg-yellow-500/60 hover:text-white touch-manipulation"
            data-cursor-hover
          >
            Book Now
          </Link>

          {/* Social links - responsive layout */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4 sm:mt-6 opacity-60 px-4">
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
              href="https://www.youtube.com/channel/UCS7vf4Riw92qyM1gF7L6t_A"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm tracking-widest uppercase text-white/60 hover:text-white transition-colors py-2 touch-manipulation"
              data-cursor-hover
            >
              YouTube
            </a>
            <a
              href="https://www.linkedin.com/in/ace-suasola-02a137255/"
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
