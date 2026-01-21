"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Navigation from "@/components/Navigation";
import CustomCursor from "@/components/CustomCursor";
import ContactForm from "@/components/ContactForm";

gsap.registerPlugin(useGSAP);

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const tl = gsap.timeline({ delay: 0.2 });

      // Animate headline
      if (headlineRef.current) {
        tl.fromTo(
          headlineRef.current,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
        );
      }

      // Animate subtitle
      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
          "-=0.4"
        );
      }

      // Animate form
      if (formContainerRef.current) {
        tl.fromTo(
          formContainerRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
          "-=0.3"
        );
      }
    },
    { scope: containerRef }
  );

  return (
    <main ref={containerRef} className="relative min-h-screen bg-primary">
      <CustomCursor />
      <Navigation />

      <div className="min-h-screen flex flex-col justify-center px-6 md:px-8 py-32">
        <div className="max-w-4xl mx-auto w-full">
          {/* Header */}
          <div className="mb-16 md:mb-24">
            <h1
              ref={headlineRef}
              className="font-display text-5xl md:text-7xl lg:text-8xl text-white tracking-tight mb-6 opacity-0"
            >
              Let&apos;s Work
            </h1>
            <p
              ref={subtitleRef}
              className="text-secondary text-lg md:text-xl max-w-xl opacity-0"
            >
              Have a show coming up? Looking to capture your next festival or event?
              Let&apos;s talk about bringing your vision to life.
            </p>
          </div>

          {/* Two column layout on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Contact form */}
            <div ref={formContainerRef} className="opacity-0">
              <ContactForm />
            </div>

            {/* Contact info */}
            <div className="space-y-12">
              {/* Direct contact */}
              <div>
                <h3 className="text-xs text-secondary tracking-widest uppercase mb-4">
                  Direct Contact
                </h3>
                <a
                  href="mailto:hello@acesuasola.com"
                  className="block font-display text-2xl text-white hover:text-white/70 transition-colors"
                >
                  hello@acesuasola.com
                </a>
              </div>

              {/* Social */}
              <div>
                <h3 className="text-xs text-secondary tracking-widest uppercase mb-4">
                  Follow
                </h3>
                <div className="flex flex-col gap-3">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-white/70 transition-colors inline-flex items-center gap-2"
                  >
                    Instagram
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-white/70 transition-colors inline-flex items-center gap-2"
                  >
                    Twitter / X
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-xs text-secondary tracking-widest uppercase mb-4">
                  Based In
                </h3>
                <p className="text-white">
                  Los Angeles, CA
                  <br />
                  <span className="text-secondary">Available worldwide</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 border-t border-white/10 py-6">
        <div className="max-w-4xl mx-auto px-6 md:px-8 flex items-center justify-between text-secondary text-sm">
          <span>&copy; {new Date().getFullYear()} Ace Suasola</span>
          <Link href="/" className="hover:text-white transition-colors">
            Back to Work
          </Link>
        </div>
      </footer>
    </main>
  );
}
