"use client";

import { useEffect, useRef, useState } from "react";
import { createActor, createMachine } from "xstate";
import MissionAccomplished from "../MissionAccomplished";
import styles from "./LandingGame.module.css";

export type LandingResult = { stars: number; maxStars: number };
export type LandingGameProps = {
  onComplete?: (result: LandingResult) => void;
  onHome?: () => void;
  className?: string;
};

/** XState owns the host's landing lifecycle; the original Three.js game stays isolated. */
export const landingMachine = createMachine({
  id: "landing",
  initial: "ready",
  states: {
    ready: { on: { START: "playing", HOME: "ready" } },
    playing: { on: { COMPLETE: "completed", HOME: "ready", RESET: "ready" } },
    completed: { on: { START: "playing", HOME: "ready", RESET: "ready" } },
  },
});

export default function LandingGame({ onComplete, onHome, className }: LandingGameProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const actorRef = useRef<ReturnType<typeof createActor<typeof landingMachine>> | null>(null);
  const completeRef = useRef(onComplete);
  const homeRef = useRef(onHome);
  const [result, setResult] = useState<LandingResult | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState("ready");

  useEffect(() => { completeRef.current = onComplete; homeRef.current = onHome; }, [onComplete, onHome]);
  useEffect(() => {
    const actor = createActor(landingMachine);
    actorRef.current = actor;
    const subscription = actor.subscribe(snapshot => setStatus(String(snapshot.value)));
    actor.start();
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frameRef.current?.contentWindow) return;
      const message = event.data;
      if (!message || message.source !== "sojourner-landing") return;
      if (message.type === "START") actor.send({ type: "START" });
      if (message.type === "HOME") {
        actor.send({ type: "HOME" });
        homeRef.current?.();
      }
      if (message.type === "COMPLETE" && actor.getSnapshot().matches("playing")) {
        actor.send({ type: "COMPLETE" });
        setResult({ stars: Number(message.stars) || 0, maxStars: 24 });
      }
    };
    window.addEventListener("message", onMessage);
    return () => { window.removeEventListener("message", onMessage); subscription.unsubscribe(); actor.stop(); actorRef.current = null; };
  }, []);

  return (
    <main className={`${styles.fullscreen} ${className ?? ""}`} data-landing-state={status}>
      <iframe key={attempt} ref={frameRef} className={styles.frame} src="/games/landing.html"
        title="Sojourner — Landing on Mars" allow="autoplay; fullscreen" />
      {result && <MissionAccomplished mission="landing" metrics={[{ label: "stars earned", value: result.stars }]} onReplay={() => { setResult(null); actorRef.current?.send({ type: "RESET" }); setAttempt(value => value + 1); }} onContinue={() => { const completed = result; setResult(null); completeRef.current?.(completed); }} />}
    </main>
  );
}
