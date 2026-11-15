import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";

// Keep persistence available even when the browser blocks localStorage.
const safeStorage: StateStorage = {
  getItem: (name) => {
    try { return typeof window === "undefined" ? null : window.localStorage.getItem(name); }
    catch { return null; }
  },
  setItem: (name, value) => {
    try { if (typeof window !== "undefined") window.localStorage.setItem(name, value); }
    catch { /* The game can still run without saved progress. */ }
  },
  removeItem: (name) => {
    try { if (typeof window !== "undefined") window.localStorage.removeItem(name); }
    catch { /* Storage is optional. */ }
  },
};

type GameData = {
  chapter: number;
  completed: boolean;
  roverProgress: Record<string, { stars: number; best: number }>;
  setRoverProgress: (progress: Record<string, { stars: number; best: number }>) => void;
  volume: number;
  soundVolume: number;
  reducedMotion: boolean;
  narrationEnabled: boolean;
  narrationVoice: string;
  narrationVolume: number;
  setNarrationEnabled: (enabled: boolean) => void;
  setNarrationVoice: (voice: string) => void;
  setNarrationVolume: (volume: number) => void;
  saveChapter: (chapter: number) => void;
  finish: () => void;
  setVolume: (volume: number) => void;
  setSoundVolume: (soundVolume: number) => void;
  setReducedMotion: (enabled: boolean) => void;
};
export const useGameStore = create<GameData>()(persist((set) => ({
  roverProgress: {},
  setRoverProgress: (roverProgress) => set({ roverProgress }),
  chapter: 0, completed: false, volume: 0.45, soundVolume: 0.55, reducedMotion: false,
  narrationEnabled: false, narrationVoice: "", narrationVolume: .8,
  setNarrationEnabled: (narrationEnabled) => set({ narrationEnabled }),
  setNarrationVoice: (narrationVoice) => set({ narrationVoice }),
  setNarrationVolume: (narrationVolume) => set({ narrationVolume }),
  saveChapter: (chapter) => set({ chapter }),
  finish: () => set({ completed: true }),
  setVolume: (volume) => set({ volume }),
  setSoundVolume: (soundVolume) => set({ soundVolume }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
}), { name: "sojourner-v1", storage: createJSONStorage(() => safeStorage), partialize: ({ chapter, completed, roverProgress, volume, soundVolume, reducedMotion, narrationEnabled, narrationVoice, narrationVolume }) => ({ chapter, completed, roverProgress, volume, soundVolume, reducedMotion, narrationEnabled, narrationVoice, narrationVolume }), skipHydration: true }));
