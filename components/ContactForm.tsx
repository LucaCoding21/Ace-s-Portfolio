"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { createPortal } from "react-dom";

gsap.registerPlugin(useGSAP);

interface FormData {
  name: string;
  email: string;
  shootType: string;
  message: string;
}

const shootTypes = [
  { value: "", label: "Select service" },
  { value: "concert", label: "Concert / Live Event" },
  { value: "wedding", label: "Wedding" },
  { value: "portrait", label: "Portrait / Headshots" },
  { value: "event", label: "Event Coverage" },
  { value: "other", label: "Other" },
];

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    shootType: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const checkRef = useRef<SVGCircleElement>(null);

  const closeModal = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsSubmitted(false);
        setFormData({ name: "", email: "", shootType: "", message: "" });
      },
    });
    tl.to(modalRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.25,
      ease: "power2.in",
    });
    tl.to(overlayRef.current, { opacity: 0, duration: 0.2 }, "<");
  };

  useEffect(() => {
    if (!isSubmitted || !overlayRef.current || !modalRef.current) return;

    const tl = gsap.timeline();

    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" }
    );
    tl.fromTo(
      modalRef.current,
      { opacity: 0, scale: 0.9, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" },
      "-=0.15"
    );

    if (checkRef.current) {
      const length = checkRef.current.getTotalLength?.() || 0;
      if (length) {
        gsap.set(checkRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
        tl.to(
          checkRef.current,
          { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" },
          "-=0.1"
        );
      }
    }
  }, [isSubmitted]);

  return (
    <>
    {isSubmitted &&
      createPortal(
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          onClick={closeModal}
          style={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            ref={modalRef}
            className="relative bg-[#111] border border-white/10 rounded-2xl p-8 sm:p-10 max-w-md w-full text-center"
            onClick={(e) => e.stopPropagation()}
            style={{ opacity: 0 }}
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-white/20 flex items-center justify-center">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                <path
                  ref={checkRef as React.Ref<SVGCircleElement>}
                  d="M5 13l4 4L19 7"
                  stroke="white"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
              Message Sent
            </h3>
            <p className="font-body text-white/50 mb-8 text-sm sm:text-base">
              Thanks for reaching out. I&apos;ll get back to you soon.
            </p>
            <button
              onClick={closeModal}
              className="w-full py-3 bg-white text-black font-body text-sm tracking-widest uppercase hover:bg-white/90 transition-colors rounded-lg"
            >
              Close
            </button>
          </div>
        </div>,
        document.body
      )}
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block font-mono text-[10px] sm:text-xs text-white/40 tracking-widest uppercase mb-2 sm:mb-3">
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full bg-transparent border-b border-white/20 py-3 font-body text-base sm:text-lg text-white placeholder:text-white/30 focus:outline-none focus:border-white/60 transition-colors"
          placeholder="Your name"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block font-mono text-[10px] sm:text-xs text-white/40 tracking-widest uppercase mb-2 sm:mb-3">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full bg-transparent border-b border-white/20 py-3 font-body text-base sm:text-lg text-white placeholder:text-white/30 focus:outline-none focus:border-white/60 transition-colors"
          placeholder="your@email.com"
        />
      </div>

      {/* Service type */}
      <div>
        <label htmlFor="shootType" className="block font-mono text-[10px] sm:text-xs text-white/40 tracking-widest uppercase mb-2 sm:mb-3">
          Service
        </label>
        <div className="relative">
          <select
            name="shootType"
            id="shootType"
            value={formData.shootType}
            onChange={handleChange}
            required
            className="w-full bg-transparent border-b border-white/20 py-3 font-body text-base sm:text-lg text-white appearance-none cursor-pointer focus:outline-none focus:border-white/60 transition-colors"
          >
            {shootTypes.map((type) => (
              <option key={type.value} value={type.value} className="bg-[#0a0a0a] text-white">
                {type.label}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block font-mono text-[10px] sm:text-xs text-white/40 tracking-widest uppercase mb-2 sm:mb-3">
          Message
        </label>
        <textarea
          name="message"
          id="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          className="w-full bg-transparent border-b border-white/20 py-3 font-body text-base sm:text-lg text-white placeholder:text-white/30 focus:outline-none focus:border-white/60 transition-colors resize-none"
          placeholder="Tell me about your project..."
        />
      </div>

      {/* Error */}
      {error && (
        <p className="font-body text-sm text-red-400">{error}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 sm:mt-8 w-full py-3 sm:py-4 bg-white text-black font-body text-sm tracking-widest uppercase hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all touch-manipulation"
      >
        {isSubmitting ? (
          <span className="inline-flex items-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Sending...
          </span>
        ) : (
          "Send Message"
        )}
      </button>
    </form>
    </>
  );
}
