"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  stages,
  LAND_TIME,
  OPEN_LIMIT,
  RESULT_DELAY,
  type CraftPhase,
} from "./stages";
type Phase = "briefing" | "tutorial" | "playing" | "result";
type Snapshot = {
  phase: Phase;
  stage: number;
  value: number;
  stageTime: number;
  locked: boolean;
  stable: boolean;
  finished: boolean;
  feedback: string;
  craft: CraftPhase;
  holding: boolean;
  holdProgress: number;
};
const initial = (): Snapshot => ({
  phase: "briefing",
  stage: 0,
  value: stages[0].high,
  stageTime: 0,
  locked: false,
  stable: false,
  finished: false,
  feedback: "",
  craft: "entry",
  holding: false,
  holdProgress: 0,
});
export function useLandingGame() {
  const [view, setView] = useState<Snapshot>(initial);
  const current = useRef<Snapshot>(view);
  const raf = useRef(0);
  const last = useRef(0);
  const holdStart = useRef<number | null>(null);
  const transition = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nudgeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const publish = useCallback((next: Snapshot) => {
    current.current = next;
    setView(next);
  }, []);
  const reset = useCallback(() => {
    if (transition.current) clearTimeout(transition.current);
    if (nudgeTimer.current) clearTimeout(nudgeTimer.current);
    holdStart.current = null;
    publish(initial());
  }, [publish]);
  const resolve = useCallback(
    (pressed: boolean) => {
      const v = current.current;
      if (v.locked || v.finished || v.phase !== "playing") return;
      const s = stages[v.stage];
      if (pressed && v.stage < 3 && v.value > s.winHigh) {
        publish({
          ...v,
          feedback: "Not yet! Wait for the ring to turn green.",
          holding: false,
          holdProgress: 0,
        });
        holdStart.current = null;
        if (nudgeTimer.current) clearTimeout(nudgeTimer.current);
        nudgeTimer.current = setTimeout(
          () => publish({ ...current.current, feedback: "" }),
          1800,
        );
        return;
      }
      if (pressed && v.stage === 3 && !v.stable) {
        publish({ ...v, feedback: "Not yet! Wait until it stops bouncing." });
        return;
      }
      holdStart.current = null;
      const message =
        v.stage === 3
          ? pressed
            ? "Great job! The lander is open! ⭐"
            : "Time to open up! Here we go…"
          : !pressed
            ? "The computer helped this time. Moving on…"
            : v.value < s.winLow
              ? "A little late, but we made it!"
              : "Great timing! ⭐";
      publish({
        ...v,
        locked: true,
        holding: false,
        holdProgress: 0,
        feedback: message,
        craft: (["chute", "airbags", "rockets", "stable"] as CraftPhase[])[
          v.stage
        ],
      });
      transition.current = setTimeout(() => {
        const old = current.current;
        if (old.stage === 3) {
          publish({ ...old, phase: "result", finished: true });
          return;
        }
        const stage = old.stage + 1;
        publish({
          ...old,
          stage,
          value: stages[stage].high,
          stageTime: 0,
          locked: false,
          stable: false,
          feedback: "",
          craft: stages[stage].craft,
        });
      }, RESULT_DELAY);
    },
    [publish],
  );
  const press = useCallback(() => {
    const v = current.current;
    if (v.phase !== "playing" || v.locked) return;
    const s = stages[v.stage];
    if (s.holdMs) {
      if (holdStart.current === null) {
        holdStart.current = performance.now();
        publish({ ...v, holding: true });
      }
    } else resolve(true);
  }, [publish, resolve]);
  const release = useCallback(() => {
    holdStart.current = null;
    const v = current.current;
    if (v.holding) publish({ ...v, holding: false, holdProgress: 0 });
  }, [publish]);
  useEffect(() => {
    if (view.phase !== "playing" || view.finished) return;
    last.current = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last.current) / 1000, 0.05);
      last.current = now;
      const v = current.current;
      if (v.phase !== "playing" || v.finished) return;
      let next = v;
      if (!v.locked) {
        const s = stages[v.stage];
        const stageTime = v.stageTime + dt;
        const value =
          v.stage === 3
            ? Math.max(0, s.high - stageTime * s.rate)
            : Math.max(s.low, v.value - s.rate * dt);
        const stable = v.stage === 3 && stageTime >= LAND_TIME;
        next = {
          ...v,
          stageTime,
          value,
          stable,
          craft: v.stage === 3 && stable ? "stable" : v.craft,
        };
        if (holdStart.current !== null) {
          const progress = Math.min(1, (now - holdStart.current) / s.holdMs);
          next = { ...next, holdProgress: progress };
          if (progress >= 1) {
            publish(next);
            resolve(true);
            raf.current = requestAnimationFrame(tick);
            return;
          }
        }
        publish(next);
        if (
          (v.stage === 3 && stageTime >= OPEN_LIMIT) ||
          (v.stage !== 3 && value <= s.low)
        ) {
          resolve(false);
        }
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [view.phase, view.finished, publish, resolve]);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat || current.current.phase !== "playing")
        return;
      if ((e.target as HTMLElement)?.closest("button")) return;
      e.preventDefault();
      press();
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "Space") release();
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("pointerup", release);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("pointerup", release);
    };
  }, [press, release]);
  useEffect(
    () => () => {
      if (transition.current) clearTimeout(transition.current);
      if (nudgeTimer.current) clearTimeout(nudgeTimer.current);
    },
    [],
  );
  const startBriefing = () =>
    publish({ ...current.current, phase: "tutorial" });
  const startPlaying = () => publish({ ...current.current, phase: "playing" });
  const s = stages[view.stage];
  const ready =
    view.phase === "playing" &&
    !view.locked &&
    (view.stage === 3
      ? view.stable
      : view.value <= s.winHigh && view.value >= s.winLow);
  const approach = Math.max(
    0,
    Math.min(
      1,
      view.stage === 3
        ? view.stageTime / LAND_TIME
        : (s.high - view.value) / (s.high - s.winHigh),
    ),
  );
  const remaining =
    view.stage === 3
      ? Math.max(0, OPEN_LIMIT - view.stageTime)
      : Math.max(0, (view.value - s.low) / s.rate);
  const progress =
    [0, 0.3, 0.62, 0.86][view.stage] +
    [0.3, 0.32, 0.24, 0.14][view.stage] *
      Math.max(0, Math.min(1, (s.high - view.value) / (s.high - s.low)));
  return {
    view,
    stage: s,
    ready,
    approach,
    remaining,
    progress,
    late: view.stage !== 3 && view.value < s.winLow,
    press,
    release,
    reset,
    startBriefing,
    startPlaying,
  };
}
