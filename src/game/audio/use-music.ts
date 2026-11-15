"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import { score, type ScoreCue } from "./score";

export function useMusic(volume: number, duck: boolean, cue: ScoreCue, suspended: boolean) {
 const [muted, setMuted] = useState(true);
 const bank = useRef(new Map<string, Howl>());
 const active = useRef<Howl | null>(null);
 const finished = useRef(new WeakSet<Howl>());
 const selected = score[cue];
 const level = volume * selected.gain * (duck ? .28 : 1);
 useEffect(() => {
  const sounds = bank.current;
  return () => { sounds.forEach(sound => sound.unload()); sounds.clear(); active.current = null; };
 }, []);
 useEffect(() => {
  if (muted || suspended) { bank.current.forEach(sound => sound.pause()); return; }
  let cancelled = false;
  const outgoing = active.current;
  if (!selected.src) {
   active.current = null;
   if (outgoing) outgoing.fade(outgoing.volume(), 0, 1100);
   const timer = window.setTimeout(() => bank.current.forEach(sound => { if (sound !== active.current) sound.pause(); }), 1150);
   return () => window.clearTimeout(timer);
  }
  let incoming = bank.current.get(selected.src);
  if (!incoming) {
   // Stream local MP3s instead of decoding six full cinematic tracks into RAM.
   incoming = new Howl({ src: [selected.src], html5: true, loop: false, preload: false, volume: 0 });
   const track = incoming;
   track.on("end", () => finished.current.add(track));
   bank.current.set(selected.src, incoming);
  }
  const track = incoming;
  const changed = outgoing !== track;
  active.current = track;
  if (outgoing && changed) outgoing.fade(outgoing.volume(), 0, 1400);
  // Return visits restart a track; volume/duck changes never restart it.
  if (changed) { finished.current.delete(track); track.seek(0); track.volume(0); }
  const fadeIn = () => {
   if (cancelled || active.current !== track) return;
   track.fade(track.volume(), level, 1100);
  };
  if (!track.playing() && !finished.current.has(track)) { track.once("play", fadeIn); track.play(); }
  else if (track.playing()) fadeIn();
  const timer = window.setTimeout(() => bank.current.forEach(sound => { if (sound !== active.current) sound.pause(); }), 1450);
  return () => {
   cancelled = true;
   window.clearTimeout(timer);
   track.off("play", fadeIn);
   if (track.state() !== "loaded") track.stop();
  };
 }, [selected.src, muted, suspended, level]);
 const toggle = useCallback(() => setMuted(value => !value), []);
 return { muted, toggle };
}
