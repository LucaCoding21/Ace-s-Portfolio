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

  const navLinks = [
    { href: "/", label: "Work" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Fixed header */}
      <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group opacity-0 transition-colors duration-500" ref={logoRef}>
          <span className={`font-display text-xl md:text-2xl tracking-tight transition-colors duration-500 ${isScrolled ? "text-white" : "text-[#F39C32]"}`}>
            ACE
          </span>
          <span className={`font-display text-xl md:text-2xl ml-2 tracking-tight transition-colors duration-500 ${isScrolled ? "text-white/60 group-hover:text-white" : "text-[#F39C32]/60 group-hover:text-[#F39C32]"}`}>
            SUASOLA
          </span>
        </Link>

        {/* Menu toggle button */}
        <button
          ref={menuButtonRef}
          onClick={toggleMenu}
          className="relative z-[60] w-10 h-10 flex flex-col items-center justify-center gap-1.5 group opacity-0"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          data-cursor-hover
        >
          <span
            className={`w-6 h-0.5 transition-all duration-300 ${isScrolled ? "bg-white" : "bg-[#F39C32]"} ${
              isMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 transition-all duration-300 ${isScrolled ? "bg-white" : "bg-[#F39C32]"} ${
              isMenuOpen ? "opacity-0 scale-0" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 transition-all duration-300 ${isScrolled ? "bg-white" : "bg-[#F39C32]"} ${
              isMenuOpen ? "-rotate-45 -translate-y-2" : ""
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
        <nav className="flex flex-col items-center gap-8">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              ref={(el) => {
                if (el) menuItemsRef.current[index] = el;
              }}
              onClick={() => setIsMenuOpen(false)}
              className={`font-display text-5xl md:text-7xl lg:text-8xl tracking-tight transition-colors duration-300 ${
                pathname === link.href
                  ? "text-white"
                  : "text-white/40 hover:text-white"
              }`}
              data-cursor-hover
            >
              {link.label}
            </Link>
          ))}

          {/* Social links */}
          <div className="flex items-center gap-8 mt-12 opacity-60">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm tracking-widest uppercase hover:text-white transition-colors"
              data-cursor-hover
            >
              Instagram
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm tracking-widest uppercase hover:text-white transition-colors"
              data-cursor-hover
            >
              Twitter
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
