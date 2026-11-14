"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./RescueSojo.module.css";

/** Independent minigame: does not read or write the pathfinding/Zustand store. */
export type RescueSojoProps = {
  onComplete?: () => void;
  className?: string;
};

type RescueState = {
  distance: number;
  active: boolean;
  done: boolean;
  lastPush: number;
  dust: number;
};

const START_X = 222;
const END_X = 472;
const TRAVEL_DISTANCE = END_X - START_X;
const percentFromDistance = (distance: number) => (distance / TRAVEL_DISTANCE) * 100;

const STAGES = [
  { until: 40, gain: 6.2, drain: 13 },
  { until: 75, gain: 5.4, drain: 18 },
  { until: 101, gain: 4.7, drain: 23 },
] as const;
const initial = (): RescueState => ({ distance: 0, active: false, done: false, lastPush: -10000, dust: 0 });
const stageFor = (progress: number) => STAGES.find((stage) => progress < stage.until) ?? STAGES[2];

export default function RescueSojo({ onComplete, className = "" }: RescueSojoProps) {
  const stateRef = useRef<RescueState>(initial());
  const completeRef = useRef(onComplete);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);
  const [display, setDisplay] = useState<RescueState>(() => initial());
  useEffect(() => { completeRef.current = onComplete; }, [onComplete]);

  const push = useCallback(() => {
    const state = stateRef.current;
    if (state.done) return;
    const now = performance.now();
    const percent = percentFromDistance(state.distance);
    const distance = Math.min(TRAVEL_DISTANCE, state.distance + (stageFor(percent).gain / 100) * TRAVEL_DISTANCE);
    const done = distance >= TRAVEL_DISTANCE;
    stateRef.current = { distance, active: true, done, lastPush: now, dust: 0.7 };
    setDisplay({ ...stateRef.current });
    if (done) completeRef.current?.();
  }, []);

  const restart = useCallback((event?: React.MouseEvent<HTMLButtonElement>) => {
    event?.stopPropagation();
    stateRef.current = initial();
    lastFrameRef.current = null;
    setDisplay({ ...stateRef.current });
  }, []);

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (event.code !== "Space" || event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;
      if (target?.closest("input, textarea, select, button, [contenteditable='true']")) return;
      event.preventDefault();
      push();
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [push]);

  useEffect(() => {
    const frame = (now: number) => {
      const previous = lastFrameRef.current ?? now;
      const dt = Math.min(0.07, Math.max(0, (now - previous) / 1000));
      lastFrameRef.current = now;
      const state = stateRef.current;
      if (state.active && !state.done) state.distance = Math.max(0, state.distance - (stageFor(percentFromDistance(state.distance)).drain / 100) * TRAVEL_DISTANCE * dt);
      state.dust = Math.max(0, state.dust - dt * 2);
      setDisplay({ ...state });
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, []);

  const fraction = display.distance / TRAVEL_DISTANCE;
  const percent = Math.floor(percentFromDistance(display.distance));
  const tilt = Math.round(19 * (1 - fraction));
  const shaking = display.active && !display.done && display.dust > 0
    ? Math.sin(display.distance * 1.2) * display.dust * 1.5 : 0;
  const roverLeft = 30 + fraction * 46;
  const roverTilt = 19 * (1 - fraction) + shaking;

  return (
    <section className={`${styles.game} ${className}`} aria-label="Rescue Sojo game">
      <div className={styles.scene} onPointerDown={(event) => { if (event.button === 0 || event.pointerType === "touch") push(); }} role="button" tabIndex={0} aria-label="Press scene to rescue Sojo" onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); push(); } }}>
        <div className={styles.landscape} aria-hidden="true" />
        <img className={styles.safeGround} src="/assets/rescue-sojo/rescue-sojo-safe-ground.png" alt="" draggable={false} />
        <div
          className={styles.roverPosition}
          style={{ left: `${roverLeft}%` }}
          aria-hidden="true"
        >
          <img
            className={styles.roverImage}
            src="/assets/rescue-sojo/sojo.png"
            alt=""
            draggable={false}
            style={{ transform: `rotate(${roverTilt}deg)` }}
          />
          <div className={styles.dustCloud} style={{ opacity: display.dust }} />
        </div>
        <div className={styles.top}>
          <span className={styles.progressLabel}>RESCUE PROGRESS</span>
          <div className={styles.track} role="progressbar" aria-label="Rescue progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
            <div className={styles.fill} style={{ transform: `scaleX(${Math.max(0, Math.min(1, fraction))})` }}/><i style={{ left: "40%" }}/><i style={{ left: "75%" }}/>
          </div>
          <strong className={styles.percent}>{percent}%</strong>
        </div>
        <div className={`${styles.status} ${display.done ? styles.safe : ""}`} aria-live="polite">{display.done ? "✓ SOJO IS SAFE!" : "⚠ SOJO IS STUCK!"}</div>
        <div className={styles.angle}>TILT ANGLE <strong>{tilt}°</strong></div>
        <div className={styles.instruction}>{display.done ? "Sojo rescued!" : "Press scene or space bar to rescue Sojo"}</div>
        {display.done && <button className={styles.restart} type="button" onPointerDown={(event) => event.stopPropagation()} onClick={restart}>↻ Restart</button>}
      </div>
    </section>
  );
}
