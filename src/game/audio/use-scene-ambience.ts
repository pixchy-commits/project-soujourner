"use client";
import { useEffect, useRef } from "react";
import { Howl } from "howler";

type Ambience = "archive-room" | "mars-wind" | "entry-rumble" | "earth-lab";
export function ambienceFor(step: string): Ambience {
 if (step.startsWith("prologue")) return "archive-room";
 if (step === "ch01-atmospheric-entry" || step === "landing") return "entry-rumble";
 if (step === "ch02-earth-flashback" || step === "ch02-celebration") return "earth-lab";
 return "mars-wind";
}

export function useSceneAmbience(cue: Ambience, enabled: boolean, volume: number, duck: boolean) {
 const bank = useRef<Partial<Record<Ambience, Howl>>>({});
 const active = useRef<Howl | null>(null);
 useEffect(() => {
  const sounds = bank.current;
  return () => { Object.values(sounds).forEach(sound => sound?.unload()); bank.current = {}; active.current = null; };
 }, []);
 useEffect(() => {
  if (!enabled || volume === 0) { Object.values(bank.current).forEach(sound => sound?.pause()); return; }
  const next = bank.current[cue] ??= new Howl({ src: [`/audio/${cue}.wav`], loop:true, volume:0 });
  if (active.current && active.current !== next) active.current.fade(active.current.volume(), 0, 1200);
  active.current = next;
  if (!next.playing()) next.play();
  next.fade(next.volume(), volume * (duck ? .1 : .22), 1200);
  const timer = window.setTimeout(() => Object.values(bank.current).forEach(sound => { if (sound !== active.current) sound?.pause(); }), 1250);
  return () => window.clearTimeout(timer);
 }, [cue, enabled, volume, duck]);
}
