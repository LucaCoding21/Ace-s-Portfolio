"use client";

import { useState, useCallback } from "react";
import Loader from "@/components/Loader";
import HeroSequence from "@/components/HeroSequence";
import SecondAceSection from "@/components/SecondAceSection";
import Navigation from "@/components/Navigation";
import CustomCursor from "@/components/CustomCursor";

type LoadingPhase = "loading" | "sequence" | "complete";

export default function Home() {
  const [phase, setPhase] = useState<LoadingPhase>("loading");

  const handleLoaderComplete = useCallback(() => {
    setPhase("sequence");
  }, []);

  const handleRushComplete = useCallback(() => {
    setPhase("complete");
  }, []);

  return (
    <main className="relative min-h-screen bg-primary">
      {/* Custom cursor */}
      <CustomCursor />

      {/* Navigation - visible after rush completes */}
      {phase === "complete" && <Navigation />}

      {/* Loading sequence */}
      {phase === "loading" && <Loader onComplete={handleLoaderComplete} />}

      {/* Hero Sequence - Rush animation only, no scatter */}
      <HeroSequence
        isActive={phase === "sequence" || phase === "complete"}
        onRushComplete={handleRushComplete}
      />

      {/* SecondAce Section - scroll locks, scatter animation */}
      <SecondAceSection isVisible={phase === "complete"} />

    </main>
  );
}
