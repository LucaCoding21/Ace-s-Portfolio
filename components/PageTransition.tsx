"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTransition } from "@/context/TransitionContext";

export default function PageTransition() {
  const { isTransitioning } = useTransition();

  return (
    <AnimatePresence>
      {isTransitioning && (
        <>
          {/* First curtain - slides in */}
          <motion.div
            className="fixed inset-0 z-[9999] bg-primary origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.76, 0, 0.24, 1],
            }}
            style={{ transformOrigin: "left" }}
          />
          {/* Second curtain - follows and reveals */}
          <motion.div
            className="fixed inset-0 z-[9998] bg-primary-light origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.76, 0, 0.24, 1],
              delay: 0.1,
            }}
            style={{ transformOrigin: "left" }}
          />
        </>
      )}
    </AnimatePresence>
  );
}
