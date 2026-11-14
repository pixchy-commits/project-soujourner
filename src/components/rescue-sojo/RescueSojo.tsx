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

const pebbles = Array.from({ length: 125 }, (_, i) => {
  // Deterministic positions, so server/client rendering matches.
  const random = (n: number) => ((Math.sin(n * 127.1 + 78.233) * 43758.5453) % 1 + 1) % 1;
  return { x: random(i * 4 + 1) * 680, y: 190 + random(i * 4 + 2) * 140, rx: 1 + random(i * 4 + 3) * 4, ry: 0.5 + random(i * 4 + 4) * 1.5 };
});

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
  const roverX = START_X + display.distance;
  const shaking = display.active && !display.done && display.dust > 0 ? Math.sin(display.distance * 1.2) * display.dust * 1.5 : 0;
  const roverTransform = `translate(${roverX} ${170 + shaking}) rotate(${19 * (1 - fraction) + shaking} 80 65)`;

  return (
    <section className={`${styles.game} ${className}`} aria-label="Rescue Sojo game">
      <div className={styles.scene} onPointerDown={(event) => { if (event.button === 0 || event.pointerType === "touch") push(); }} role="button" tabIndex={0} aria-label="Press scene to rescue Sojo" onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); push(); } }}>
        <svg className={styles.art} viewBox="0 0 680 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sojourner rover next to Yogi Rock on the surface of Mars">
          <defs>
            <linearGradient id="rescueSky" x2="0" y2="1"><stop stopColor="#865444"/><stop offset="1" stopColor="#e7b087"/></linearGradient>
            <linearGradient id="rescueSoil" x2=".1" y2="1"><stop stopColor="#b7835d"/><stop offset="1" stopColor="#78452f"/></linearGradient>
            <pattern id="rescueSolar" width="16" height="12" patternUnits="userSpaceOnUse"><rect width="16" height="12" fill="#273749"/><rect x="1" y="1" width="14" height="10" fill="#425b78" stroke="#8094a6" strokeWidth=".5"/></pattern>
          </defs>
          <rect width="680" height="400" fill="url(#rescueSky)"/>
          <path d="M0 180L90 140 145 161 238 122 350 172 443 140 580 161 680 130V400H0Z" fill="#99694f"/>
          <path d="M0 205L155 192 300 205 470 188 680 202V400H0Z" fill="url(#rescueSoil)"/>
          <g>{pebbles.map((p, i) => <ellipse key={i} cx={p.x} cy={p.y + 22} rx={p.rx} ry={p.ry} fill={i % 2 ? "#d5a27b" : "#633e2e"} opacity=".45" />)}</g>
          <ellipse cx="109" cy="270" rx="104" ry="13" fill="#58382c" opacity=".5"/>
          <path d="M19 254L28 187 75 131 132 113 190 144 221 216 209 261 81 275Z" fill="#a47c5e" stroke="#755039" strokeWidth="2"/>
          <path d="M28 187L132 113 94 197 81 275 19 254Z" fill="#b99172"/>
          <path d="M132 113L190 144 221 216 155 169 94 197Z" fill="#c5a082"/>
          <path d="M155 169L221 216 209 261 81 275Z" fill="#896249"/>
          <text x="118" y="98" fill="#fff0dc" fontSize="13" textAnchor="middle" fontWeight="600">YOGI ROCK</text>
          <path d="M199 289L216 261 239 250 258 272 265 294Z" fill="#98704d"/>
          <ellipse cx="558" cy="301" rx="93" ry="25" stroke="#c3e7ad" strokeDasharray="6 5" fill="none" strokeWidth="2"/>
          <ellipse cx={roverX + 80} cy="297" rx="92" ry="10" fill="#39271c" opacity=".5"/>
          <g fill="#eac198" opacity={display.dust}>{Array.from({ length: 7 }, (_, i) => <circle key={i} cx={roverX - 8 - i * 7} cy={292 - i % 3 * 4} r={3 + i * 1.4}/>)}</g>
          <g transform={roverTransform}>
            <g fill="#4c4840" stroke="#292925" strokeWidth="2"><ellipse cx="35" cy="63" rx="18" ry="22"/><ellipse cx="95" cy="63" rx="18" ry="22"/><ellipse cx="155" cy="63" rx="18" ry="22"/></g>
            <path d="M20 49L18 84 78 60 138 84 120 50" fill="none" stroke="#34312c" strokeWidth="5"/>
            <path d="M0 22L36 0H163L143 22Z" fill="url(#rescueSolar)" stroke="#aeb1a6" strokeWidth="2"/>
            <path d="M0 22H143V57H0Z" fill="#d3cebc" stroke="#56534b"/>
            <path d="M143 22L163 0V37L143 57Z" fill="#989589"/>
            <text x="85" y="45" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#3a3830">SOJOURNER</text>
            <path d="M114 12V-30" stroke="#dad4c4" strokeWidth="3"/>
            <path d="M0 45L-15 49V62" fill="none" stroke="#bbb8ad" strokeWidth="6"/><circle cx="-15" cy="62" r="7" fill="#b0a590"/>
            {[18, 78, 138].map((x) => <g key={x} transform={`translate(${x} 84)`}><g transform={`rotate(${display.distance * 4.8})`}><circle r="23" fill="#393832" stroke="#292923" strokeWidth="2"/><circle r="17" fill="#79766b" stroke="#b5ad9a"/>{Array.from({ length: 12 }, (_, j) => <path key={j} d="M-3 -23H3V-17H-3Z" fill="#b0ab9d" transform={`rotate(${j * 30})`}/>) }<circle r="6" fill="#45443d"/></g></g>)}
          </g>
        </svg>
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
