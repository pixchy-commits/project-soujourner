"use client";

import "./rover.css";
import { useEffect, useRef } from "react";
import { useGameStore } from "@/lib/game-store";
import { ROVER_ASSETS, type RoverAssets } from "@/lib/rover/assets";
import { createRoverEngine } from "./engine";
import RoverMarkup from "./RoverMarkup";

type Props = {
  /** Called when the player finishes the last mission. */
  onComplete: () => void;
  /** Optional: shows a small BACK button. */
  onExit?: () => void;
  reducedMotion?: boolean;
  /** Art slots. Defaults to ROVER_ASSETS in src/lib/rover/assets.ts. */
  assets?: RoverAssets;
};

export default function RoverGame({ onComplete, onExit, reducedMotion = false, assets = ROVER_ASSETS }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const latest = useRef(onComplete);
  useEffect(() => { latest.current = onComplete; });
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    return createRoverEngine(el, {
      assets,
      reducedMotion,
      initialProgress: useGameStore.getState().roverProgress,
      onProgress: (progress) => useGameStore.getState().setRoverProgress(progress),
      onComplete: () => latest.current(),
    });
  }, [assets, reducedMotion]);
  return (
    <div className="rv" ref={root}>
      <RoverMarkup />
      {onExit && <button type="button" className="rv-exit" onClick={onExit}>‹ BACK</button>}
    </div>
  );
}
