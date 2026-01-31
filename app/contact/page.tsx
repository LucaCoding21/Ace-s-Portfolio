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
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const tl = gsap.timeline({ delay: 0.2 });

      if (headlineRef.current) {
        tl.fromTo(
          headlineRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
        );
      }

      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
          "-=0.5"
        );
      }

      if (contentRef.current) {
        tl.fromTo(
          contentRef.current,
          { y: 30, opacity: 0 },
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

      <div className="min-h-screen pt-24 sm:pt-32 pb-20 sm:pb-24 px-4 sm:px-8 md:px-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12 sm:mb-16 md:mb-20">
            <h1
              ref={headlineRef}
              className="font-display text-[clamp(2.5rem,10vw,8rem)] font-bold text-white tracking-tight leading-[0.95] opacity-0"
            >
              Let's Work
            </h1>
            <p
              ref={subtitleRef}
              className="font-body text-white/50 text-base sm:text-lg md:text-xl mt-4 sm:mt-6 max-w-lg opacity-0"
            >
              Have a project in mind? Whether it&#39;s a concert, wedding, or creative shoot in Vancouver, let&#39;s create something together.
            </p>
          </div>

          {/* Content */}
          <div ref={contentRef} className="opacity-0">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 sm:gap-16 lg:gap-24">
              {/* Form - takes 3 columns */}
              <div className="lg:col-span-3">
                <ContactForm />
              </div>

              {/* Contact info - takes 2 columns */}
              <div className="lg:col-span-2 space-y-8 sm:space-y-12">
                {/* Email */}
                <div>
                  <h3 className="font-mono text-[10px] sm:text-xs text-white/40 tracking-widest uppercase mb-3 sm:mb-4">
                    Email
                  </h3>
                  <a
                    href="mailto:acesuasola@gmail.com"
                    className="font-body text-white text-base sm:text-lg hover:text-white/70 transition-colors"
                  >
                    acesuasola@gmail.com
                  </a>
                </div>

                {/* Social */}
                <div>
                  <h3 className="font-mono text-[10px] sm:text-xs text-white/40 tracking-widest uppercase mb-3 sm:mb-4">
                    Social
                  </h3>
                  <div className="flex flex-wrap gap-4 sm:gap-0 sm:flex-col sm:space-y-3">
                    <a
                      href="https://instagram.com/acesuasola"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-white hover:text-white/70 transition-colors"
                    >
                      Instagram
                    </a>
                    <a
                      href="https://youtube.com/@AceSuasola"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-white hover:text-white/70 transition-colors"
                    >
                      YouTube
                    </a>
                    <a
                      href="https://linkedin.com/in/acesuasola"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-white hover:text-white/70 transition-colors"
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h3 className="font-mono text-[10px] sm:text-xs text-white/40 tracking-widest uppercase mb-3 sm:mb-4">
                    Based In
                  </h3>
                  <p className="font-body text-white">
                    Vancouver, British Columbia
                  </p>
                  <p className="font-body text-white/50 text-sm mt-1">
                    Available for events across BC and worldwide
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 px-4 sm:px-8 md:px-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-mono text-[10px] sm:text-xs text-white/30">
            © {new Date().getFullYear()} Ace Suasola
          </span>
          <Link
            href="/"
            className="font-mono text-[10px] sm:text-xs text-white/30 hover:text-white transition-colors"
          >
            Back to Work
          </Link>
        </div>
      </footer>
    </main>
  );
}
