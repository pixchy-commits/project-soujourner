"use client";
import { useEffect, useSyncExternalStore, type RefObject } from "react";
function subscribe(callback: () => void) {
 const query = window.matchMedia("(prefers-reduced-motion: reduce)");
 query.addEventListener("change", callback);
 return () => query.removeEventListener("change", callback);
}
function snapshot() { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
export function useReducedMotion(preference: boolean) {
 return useSyncExternalStore(subscribe, snapshot, () => false) || preference;
}
export function usePageVisibility() {
 return useSyncExternalStore(
  (callback) => { document.addEventListener("visibilitychange", callback); return () => document.removeEventListener("visibilitychange", callback); },
  () => !document.hidden,
  () => true,
 );
}
export function useSceneFocus(key: string, busy: boolean, target: RefObject<HTMLElement | null>) {
 useEffect(() => { if (!busy) target.current?.querySelector<HTMLElement>(".dialogue-box, [data-scene-advance]")?.focus({ preventScroll: true }); }, [key, busy, target]);
}
