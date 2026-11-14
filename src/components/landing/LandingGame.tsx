"use client";

import { useEffect, useRef } from "react";
import styles from "./LandingGame.module.css";

export type LandingGameProps = {
  onComplete?: (result: { stars: number }) => void;
  onHome?: () => void;
  className?: string;
};

/** Isolated Chapter 1 game. Does not touch the Pathfinding or Rescue Sojo state. */
export default function LandingGame({ onComplete, onHome, className = "" }: LandingGameProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const completeRef = useRef(onComplete);
  const homeRef = useRef(onHome);
  useEffect(() => { completeRef.current = onComplete; }, [onComplete]);
  useEffect(() => { homeRef.current = onHome; }, [onHome]);
  useEffect(() => {
    function receive(event: MessageEvent) {
      if (event.origin !== window.location.origin || event.source !== frameRef.current?.contentWindow) return;
      const message = event.data;
      if (!message || message.source !== "sojourner-landing") return;
      if (message.type === "complete") completeRef.current?.({ stars: Math.max(0, Math.min(3, Number(message.stars) || 0)) });
      if (message.type === "home") homeRef.current?.();
    }
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, []);
  return (
    <section className={`${styles.container} ${className}`} aria-label="Sojourner Chapter 1: Landing on Mars">
      <iframe
        ref={frameRef}
        className={styles.frame}
        src="/games/landing.html"
        title="Sojourner — Chapter 1: Landing on Mars"
        allow="autoplay"
      />
    </section>
  );
}
