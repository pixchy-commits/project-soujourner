"use client";

import "./rover.css";
import { useEffect, useRef, useState } from "react";
import { ROVER_ASSETS, type RoverAssets } from "@/lib/rover/assets";
import { createRoverEngine } from "./engine";
import MissionAccomplished, { type MissionPopupName } from "../MissionAccomplished";
import { useGameHost } from "../GameHostContext";
import RoverMarkup from "./RoverMarkup";

type RoverProgress = Record<string, { stars: number; best: number }>;
const PROGRESS_KEY = "sojourner-rover-progress-v1";

function readRoverProgress(): RoverProgress {
  try {
    const value = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) ?? "{}");
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
}

function saveRoverProgress(progress: RoverProgress): void {
  try {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.warn("Could not save rover progress:", error);
  }
}

type Props = {
  /** Called when the player finishes the last mission. */
  onComplete?: () => void;
  missionNumber?: 1 | 2 | 3 | 4;
  onMissionComplete?: (missionNumber: number) => void;
  /** Optional: shows a small BACK button. */
  onExit?: () => void;
  reducedMotion?: boolean;
  paused?: boolean;
  /** Art slots. Defaults to ROVER_ASSETS in src/lib/rover/assets.ts. */
  assets?: RoverAssets;
};

export default function RoverGame({ onComplete, onMissionComplete, missionNumber, onExit, paused = false, reducedMotion = false, assets = ROVER_ASSETS }: Props) {
  const [completion, setCompletion] = useState<{ mission: MissionPopupName; sol: number; replay: () => void; proceed: () => void } | null>(null);
  const host = useGameHost();
  const audioRef = useRef(host?.soundVolume ?? 1);
  useEffect(() => { audioRef.current = host?.soundVolume ?? 1; }, [host?.soundVolume]);
  const root = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);
  useEffect(() => { pausedRef.current = paused; }, [paused]);
  const latest = useRef({ onComplete, onMissionComplete });
  useEffect(() => { latest.current = { onComplete, onMissionComplete }; });
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    return createRoverEngine(el, {
      assets,
      reducedMotion,
      isPaused: () => pausedRef.current,
      getSoundVolume: () => audioRef.current,
      initialProgress: readRoverProgress(),
      onProgress: saveRoverProgress,
      onSuccess: (sol, replay, proceed) => setCompletion({ mission: sol === 1 ? "barnacle" : "yogi", sol, replay, proceed }),
      missionNumber,
      onMissionComplete: (number) => latest.current.onMissionComplete?.(number),
      onComplete: () => latest.current.onComplete?.(),
    });
  }, [assets, reducedMotion, missionNumber]);
  return (
    <div className="rv" data-embedded={host ? "true" : undefined} ref={root}>
      <RoverMarkup />
      {completion && <MissionAccomplished mission={completion.mission} message={{title:completion.sol === 1 ? "Route to Barnacle Bill" : completion.sol === 2 ? "Route to the Yogi viewpoint" : completion.sol === 3 ? "Route to Yogi" : "Route around Yogi",feedback:"Great driving, explorer!",outcome:"Route completed!",text:"Sojo followed your commands safely."}} onReplay={() => { setCompletion(null); completion.replay(); }} onContinue={() => { setCompletion(null); completion.proceed(); }} />}
      {onExit && <button type="button" className="rv-exit" onClick={onExit}>‹ BACK</button>}
    </div>
  );
}
