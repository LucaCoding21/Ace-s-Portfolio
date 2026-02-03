"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

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
  const successRef = useRef<HTMLDivElement>(null);
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

  useGSAP(
    () => {
      if (!isSubmitted || !successRef.current || !formRef.current) return;

      gsap.to(formRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: "power2.in",
      });

      gsap.fromTo(
        successRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: "power3.out" }
      );
    },
    { dependencies: [isSubmitted] }
  );

  if (isSubmitted) {
    return (
      <div ref={successRef} className="py-12 opacity-0">
        <div className="w-12 h-12 mb-6 rounded-full border border-white/30 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display text-2xl font-bold text-white mb-3">Message Sent</h3>
        <p className="font-body text-white/50 mb-8">
          Thanks for reaching out. I'll get back to you soon.
        </p>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setFormData({ name: "", email: "", shootType: "", message: "" });
          }}
          className="font-mono text-xs text-white/50 hover:text-white transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
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
  );
}
