import { create } from "zustand";
import { persist } from "zustand/middleware";
import { legacyCheckpoints, type ActivityResult, type Checkpoint } from "../flow/story";

type Preferences = {
 volume: number; soundVolume: number; reducedMotion: boolean;
 narrationEnabled: boolean; narrationVoice: string; narrationVolume: number;
};
type GameData = Preferences & {
 checkpoint: Checkpoint | null;
 completed: boolean;
 activityResults: Record<string, ActivityResult["outcome"]>;
 saveCheckpoint: (checkpoint: Checkpoint) => void;
 recordActivity: (result: ActivityResult) => void;
 finish: () => void;
 setVolume: (volume: number) => void;
 setSoundVolume: (volume: number) => void;
 setReducedMotion: (enabled: boolean) => void;
 setNarrationEnabled: (enabled: boolean) => void;
 setNarrationVoice: (voice: string) => void;
 setNarrationVolume: (volume: number) => void;
};
export const useGameStore = create<GameData>()(persist((set) => ({
 checkpoint: null, completed: false, activityResults: {},
 volume: .45, soundVolume: .55, reducedMotion: false,
 narrationEnabled: false, narrationVoice: "", narrationVolume: .8,
 saveCheckpoint: (checkpoint) => set({ checkpoint }),
 recordActivity: ({ activityId, outcome }) => set((state) => ({ activityResults: { ...state.activityResults, [activityId]: outcome } })),
 finish: () => set({ completed: true }),
 setVolume: (volume) => set({ volume }),
 setSoundVolume: (soundVolume) => set({ soundVolume }),
 setReducedMotion: (reducedMotion) => set({ reducedMotion }),
 setNarrationEnabled: (narrationEnabled) => set({ narrationEnabled }),
 setNarrationVoice: (narrationVoice) => set({ narrationVoice }),
 setNarrationVolume: (narrationVolume) => set({ narrationVolume }),
}), {
 name: "sojourner-v1", version: 1, skipHydration: true,
 partialize: ({ checkpoint, completed, activityResults, volume, soundVolume, reducedMotion, narrationEnabled, narrationVoice, narrationVolume }) => ({ checkpoint, completed, activityResults, volume, soundVolume, reducedMotion, narrationEnabled, narrationVoice, narrationVolume }),
 migrate: (persisted) => {
  const old = (persisted && typeof persisted === "object" ? persisted : {}) as Record<string, unknown>;
  const legacyIndex = typeof old.chapter === "number" ? Math.max(0, Math.min(legacyCheckpoints.length - 1, Math.trunc(old.chapter))) : 0;
  const volume = (value: unknown, fallback: number) => typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : fallback;
  return {
   checkpoint: legacyCheckpoints[legacyIndex] ?? legacyCheckpoints[0], completed: false, activityResults: {},
   volume: volume(old.volume, .45), soundVolume: volume(old.soundVolume, .55),
   reducedMotion: old.reducedMotion === true, narrationEnabled: old.narrationEnabled === true,
   narrationVoice: typeof old.narrationVoice === "string" ? old.narrationVoice : "",
   narrationVolume: volume(old.narrationVolume, .8),
  };
 },
}));
