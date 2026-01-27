"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface AnimatedButtonProps {
  href: string;
  children: string;
  className?: string;
}

export default function AnimatedButton({ href, children, className = "" }: AnimatedButtonProps) {
  // Custom easing for that professional "Awwwards" feel
  const smoothEase: [number, number, number, number] = [0.76, 0, 0.24, 1];

  return (
    <Link href={href} className={className}>
      <motion.div
        initial="initial"
        whileHover="hovered"
        className="relative overflow-hidden px-6 py-2.5 rounded-full bg-white cursor-pointer"
        data-cursor-hover
      >
        {/* Expanding background circle */}
        <motion.div
          variants={{
            initial: { scale: 0 },
            hovered: { scale: 3 },
          }}
          transition={{ duration: 0.5, ease: smoothEase }}
          className="absolute rounded-full bg-yellow-500"
          style={{
            top: "50%",
            left: "50%",
            width: "100%",
            height: "200%",
            x: "-50%",
            y: "-50%",
          }}
        />

        {/* Sliding text container */}
        <div className="relative z-10 overflow-hidden">
          <div className="relative">
            {/* First text - slides up and out */}
            <motion.span
              variants={{
                initial: { y: 0 },
                hovered: { y: "-100%" },
              }}
              transition={{ duration: 0.4, ease: smoothEase }}
              className="block text-sm font-medium tracking-wide text-black whitespace-nowrap"
            >
              {children}
            </motion.span>

            {/* Second text - positioned below, slides up into view */}
            <motion.span
              variants={{
                initial: { y: 0 },
                hovered: { y: "-100%" },
              }}
              transition={{ duration: 0.4, ease: smoothEase }}
              className="absolute top-full left-0 block text-sm font-medium tracking-wide text-black whitespace-nowrap"
            >
              {children}
            </motion.span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
