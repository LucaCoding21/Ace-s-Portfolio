// Animation configurations
export const animationConfig = {
  cursor: {
    duration: 0.2,
    ease: "power2.out",
  },
};

// Check for reduced motion preference
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
