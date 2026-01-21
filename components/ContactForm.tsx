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
  { value: "", label: "Select type of shoot" },
  { value: "concert", label: "Concert / Live Event" },
  { value: "festival", label: "Festival" },
  { value: "promo", label: "Artist Promo" },
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
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Form submitted:", formData);

    // Show success state
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  // Success animation
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
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.3,
          ease: "power3.out",
        }
      );
    },
    { dependencies: [isSubmitted] }
  );

  if (isSubmitted) {
    return (
      <div
        ref={successRef}
        className="text-center py-16 opacity-0"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-white flex items-center justify-center">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="font-display text-3xl text-white mb-4">Message Sent</h3>
        <p className="text-secondary max-w-md mx-auto">
          Thanks for reaching out. I&apos;ll get back to you as soon as possible.
        </p>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setFormData({ name: "", email: "", shootType: "", message: "" });
          }}
          className="mt-8 text-white/60 hover:text-white underline underline-offset-4 transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
      {/* Name field */}
      <div className="relative">
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          onFocus={() => setFocusedField("name")}
          onBlur={() => setFocusedField(null)}
          required
          className="form-input peer"
          placeholder=" "
        />
        <label
          htmlFor="name"
          className={`absolute left-0 transition-all duration-300 pointer-events-none ${
            formData.name || focusedField === "name"
              ? "text-xs -top-4 text-white"
              : "text-base top-4 text-secondary"
          }`}
        >
          Name
        </label>
        <div
          className={`absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-300 ${
            focusedField === "name" ? "w-full" : "w-0"
          }`}
        />
      </div>

      {/* Email field */}
      <div className="relative">
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          onFocus={() => setFocusedField("email")}
          onBlur={() => setFocusedField(null)}
          required
          className="form-input peer"
          placeholder=" "
        />
        <label
          htmlFor="email"
          className={`absolute left-0 transition-all duration-300 pointer-events-none ${
            formData.email || focusedField === "email"
              ? "text-xs -top-4 text-white"
              : "text-base top-4 text-secondary"
          }`}
        >
          Email
        </label>
        <div
          className={`absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-300 ${
            focusedField === "email" ? "w-full" : "w-0"
          }`}
        />
      </div>

      {/* Shoot type dropdown */}
      <div className="relative">
        <select
          name="shootType"
          id="shootType"
          value={formData.shootType}
          onChange={handleChange}
          onFocus={() => setFocusedField("shootType")}
          onBlur={() => setFocusedField(null)}
          required
          className="form-input peer appearance-none cursor-pointer"
        >
          {shootTypes.map((type) => (
            <option
              key={type.value}
              value={type.value}
              className="bg-primary text-white"
            >
              {type.label}
            </option>
          ))}
        </select>
        <label
          htmlFor="shootType"
          className={`absolute left-0 transition-all duration-300 pointer-events-none ${
            formData.shootType || focusedField === "shootType"
              ? "text-xs -top-4 text-white"
              : "text-base top-4 text-secondary"
          }`}
        >
          Type of Shoot
        </label>
        <svg
          className="absolute right-0 top-4 w-5 h-5 text-secondary pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 9l-7 7-7-7"
          />
        </svg>
        <div
          className={`absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-300 ${
            focusedField === "shootType" ? "w-full" : "w-0"
          }`}
        />
      </div>

      {/* Message field */}
      <div className="relative">
        <textarea
          name="message"
          id="message"
          value={formData.message}
          onChange={handleChange}
          onFocus={() => setFocusedField("message")}
          onBlur={() => setFocusedField(null)}
          required
          rows={4}
          className="form-input peer resize-none"
          placeholder=" "
        />
        <label
          htmlFor="message"
          className={`absolute left-0 transition-all duration-300 pointer-events-none ${
            formData.message || focusedField === "message"
              ? "text-xs -top-4 text-white"
              : "text-base top-4 text-secondary"
          }`}
        >
          Message
        </label>
        <div
          className={`absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-300 ${
            focusedField === "message" ? "w-full" : "w-0"
          }`}
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="relative w-full py-4 bg-white text-black font-body text-sm tracking-widest uppercase overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed transition-opacity"
      >
        <span
          className={`inline-flex items-center gap-2 transition-transform duration-300 ${
            isSubmitting ? "-translate-y-10" : "translate-y-0"
          }`}
        >
          Send Message
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </span>
        <span
          className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${
            isSubmitting ? "translate-y-0" : "translate-y-10"
          }`}
        >
          <svg
            className="w-5 h-5 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>

        {/* Hover effect */}
        <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      </button>
    </form>
  );
}
