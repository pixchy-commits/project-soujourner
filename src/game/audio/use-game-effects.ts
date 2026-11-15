"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import { useGameStore } from "../state/game-store";

type EffectName = "click" | "type" | "rover" | "pathfinder" | "transition" | "rewind" | "chapter" | "memory" | "success" | "radio" | "montage-in" | "montage-shuffle";
const sources: Record<EffectName, string> = {
  click: "/audio/menu-click.wav",
  type: "/audio/type-tick.wav",
  rover: "/audio/rover-blip.wav",
  pathfinder: "/audio/pathfinder-blip.wav",
  transition: "/audio/scene-sweep.wav",
  rewind: "/audio/time-rewind.wav",
  chapter: "/audio/chapter-chime.wav",
  memory: "/audio/memory-chime.wav",
  success: "/audio/mission-success.wav",
  radio: "/audio/radio-connect.wav",
  "montage-in": "/audio/montage-in-v2.wav",
  "montage-shuffle": "/audio/montage-shuffle-v2.wav",
};
const levels: Record<EffectName, number> = { click: .32, type: .09, rover: .19, pathfinder: .21, transition: .3, rewind: .35, chapter: .38, memory: .28, success: .4, radio: .22, "montage-in": .7, "montage-shuffle": .65 };

export function useGameEffects() {
  const sounds = useRef<Partial<Record<EffectName, Howl>>>({});
  const activated = useRef(false);
  const [unlocked, setUnlocked] = useState(false);
  const lastType = useRef(0);
  const soundVolume = useGameStore((state) => state.soundVolume);

  const play = useCallback((name: EffectName) => {
    const volume = useGameStore.getState().soundVolume;
    if (!activated.current || volume === 0 || document.hidden) return;
    const typing = name === "type" || name === "rover" || name === "pathfinder";
    if (typing) {
      const now = performance.now();
      if (now - lastType.current < (name === "type" ? 95 : 120)) return;
      lastType.current = now;
    }
    const sound = sounds.current[name] ??= new Howl({ src: [sources[name]], preload: true, pool: 4 });
    sound.volume(volume * levels[name]);
    if (typing) sound.stop();
    const id = sound.play();
    if (typing) sound.rate(.94 + Math.random() * .12, id);
  }, []);

  const click = useCallback(() => { activated.current = true; setUnlocked(true); play("click"); }, [play]);

  useEffect(() => {
    for (const [name, sound] of Object.entries(sounds.current)) {
      if (!sound) continue;
      sound.volume(soundVolume * levels[name as EffectName]);
      if (soundVolume === 0) sound.stop();
    }
  }, [soundVolume]);
  useEffect(() => {
    const stop = () => { if (document.hidden) Object.values(sounds.current).forEach((sound) => sound?.stop()); };
    document.addEventListener("visibilitychange", stop);
    const bank = sounds.current;
    return () => { document.removeEventListener("visibilitychange", stop); Object.values(bank).forEach((sound) => sound?.unload()); sounds.current = {}; };
  }, []);
  return { play, click, unlocked };
}

