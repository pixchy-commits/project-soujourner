"use client";
import { useEffect, type RefObject } from "react";
import { useGameHost } from "./GameHostContext";
export function useGameFrame(frame: RefObject<HTMLIFrameElement | null>, paused: boolean) {
 const host = useGameHost();
 const embedded = host !== null;
 const soundVolume = host?.soundVolume ?? 1;
 useEffect(() => {
  frame.current?.contentWindow?.postMessage({ type: "sojo-host-state", paused, embedded, soundVolume }, window.location.origin);
 }, [frame, paused, embedded, soundVolume]);
 return () => frame.current?.contentWindow?.postMessage({ type: "sojo-host-state", paused, embedded, soundVolume }, window.location.origin);
}
