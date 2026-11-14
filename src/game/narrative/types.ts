import type manifest from "./art/manifest.json";
export type ArtId = keyof typeof manifest;
export type DialogueLine = { speaker: string; text: string };
type ShotBase = {
 id: string;
 dialogue?: DialogueLine;
 caption?: string;
 transition?: "black" | "memory";
 motion?: "still" | "drift" | "push-in" | "pan";
 notes?: string;
};
export type SceneShot = ShotBase & (
 | { kind: "illustration"; art: ArtId; framing?: "wide" | "closeup" | "first-person" | "overhead"; confetti?: boolean; hotspot?: { label: string; x: number; y: number; width: number; height: number }; missionSheet?: { title: string; duration: string; note?: string; items: readonly string[] } }
 | { kind: "archive"; art: ArtId; montage?: readonly ArtId[]; label: string; date: string }
 | { kind: "chapter"; art: ArtId; number: number; title: string; date: string }
);
export type NarrativeScene = {
 id: string;
 title: string;
 chapter: 0 | 1 | 2;
 sourcePages: readonly number[];
 status: "prototype" | "storyboard" | "needs-script";
 shots: readonly [SceneShot, ...SceneShot[]];
};
