import { create } from "zustand";
import { persist } from "zustand/middleware";

type GameData = {
  chapter: number;
  completed: boolean;
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
}), { name: "sojourner-v1", partialize: ({ chapter, completed, volume, soundVolume, reducedMotion, narrationEnabled, narrationVoice, narrationVolume }) => ({ chapter, completed, volume, soundVolume, reducedMotion, narrationEnabled, narrationVoice, narrationVolume }), skipHydration: true }));

