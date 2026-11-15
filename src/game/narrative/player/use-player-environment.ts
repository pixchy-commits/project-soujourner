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

// Automatic scene focus must not be mistaken for the player choosing keyboard input.
export function useInputMethod(target: RefObject<HTMLElement | null>) {
 useEffect(() => {
  const set = (method: string) => {
   if (target.current && target.current.dataset.input !== method) target.current.dataset.input = method;
  };
  set(window.matchMedia("(pointer: coarse)").matches ? "touch" : "mouse");
  const pointer = (event: PointerEvent) => set(event.pointerType === "touch" || event.pointerType === "pen" ? "touch" : "mouse");
  const keyboard = (event: KeyboardEvent) => {
   if (["Tab", "Enter", " ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) set("keyboard");
  };
  document.addEventListener("pointerdown", pointer, true);
  document.addEventListener("pointermove", pointer, { passive: true });
  document.addEventListener("keydown", keyboard, true);
  return () => {
   document.removeEventListener("pointerdown", pointer, true);
   document.removeEventListener("pointermove", pointer);
   document.removeEventListener("keydown", keyboard, true);
  };
 }, [target]);
}
