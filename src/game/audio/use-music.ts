"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Howl } from "howler";
export function useMusic(volume: number, duck: boolean) {
 const [muted, setMuted] = useState(true);
 const audio = useRef<Howl | null>(null);
 const level = volume * (duck ? .35 : 1);
 useEffect(() => { audio.current?.volume(level); }, [level]);
 useEffect(() => () => { audio.current?.unload(); }, []);
 const toggle = useCallback(() => {
  if (!audio.current) audio.current = new Howl({ src: ["/audio/mars-ambient.wav"], loop: true, volume: level });
  if (audio.current.playing()) { audio.current.pause(); setMuted(true); }
  else { audio.current.play(); setMuted(false); }
 }, [level]);
 return { muted, toggle };
}
