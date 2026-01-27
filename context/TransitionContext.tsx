"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface TransitionContextType {
  isTransitioning: boolean;
  startTransition: () => void;
  endTransition: () => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startTransition = useCallback(() => {
    setIsTransitioning(true);
  }, []);

  const endTransition = useCallback(() => {
    setIsTransitioning(false);
  }, []);

  return (
    <TransitionContext.Provider value={{ isTransitioning, startTransition, endTransition }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error("useTransition must be used within a TransitionProvider");
  }
  return context;
}
