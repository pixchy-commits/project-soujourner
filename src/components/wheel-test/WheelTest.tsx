"use client";

import { useEffect, useRef } from "react";
import styles from "./WheelTest.module.css";

export type WheelTestResult = { sitesTested: number; wheelsTested: number };

type WheelTestProps = {
  onComplete?: (result: WheelTestResult) => void;
  onHome?: () => void;
  onNext?: () => void;
  className?: string;
};

export default function WheelTest({ onComplete, onHome, onNext, className }: WheelTestProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const callbacks = useRef({ onComplete, onHome, onNext });
  useEffect(() => { callbacks.current = { onComplete, onHome, onNext }; }, [onComplete, onHome, onNext]);

  useEffect(() => {
    function receive(event: MessageEvent) {
      if (event.origin !== window.location.origin || event.source !== frameRef.current?.contentWindow) return;
      const data = event.data;
      if (!data || data.source !== "sojourner-wheel-test") return;
      if (data.type === "complete") callbacks.current.onComplete?.({
        sitesTested: Number(data.sitesTested) || 3,
        wheelsTested: Number(data.wheelsTested) || 18,
      });
      else if (data.type === "home") callbacks.current.onHome?.();
      else if (data.type === "next") callbacks.current.onNext?.();
    }
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, []);

  return <div className={`${styles.root} ${className ?? ""}`}>
    <iframe ref={frameRef} className={styles.frame} src="/games/wheel-test.html" title="Sojourner Sol 4 — Soil Detective" allow="autoplay" />
  </div>;
}
