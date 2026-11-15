import type manifest from "./art/manifest.json";
export type ArtId = keyof typeof manifest;
export type DialogueLine = { speaker: string; text: string };
type ShotBase = {
 id: string;
 intertitle?: string;
 timeLabel?: string;
 memoryMontage?: readonly ArtId[];
 dialogue?: DialogueLine;
 caption?: string;
 transition?: "black" | "memory";
 motion?: "still" | "drift" | "push-in" | "pan";
 notes?: string;
 placeholder?: string;
 exitTransition?: "black";
 /** Transparent foreground art; shares the illustration's 16:9 coordinate space. */
 overlay?: ArtId;
 /** Enlarge the lens opening without altering the supplied frame asset. */
 overlayScale?: number;
 /** Pictures inside a painted archive wall, in the same 16:9 coordinates. */
 screenGallery?: readonly { art: ArtId; x: number; y: number; width: number; height: number }[];
};
export type SceneShot = ShotBase & (
 | { kind: "illustration"; art: ArtId; framing?: "wide" | "closeup" | "first-person" | "overhead"; confetti?: boolean; terrainNotes?: readonly { id: string; title: string; text: string; x: number; y: number; targetX: number; targetY: number }[]; hotspot?: { label: string; x: number; y: number; width: number; height: number }; missionSheet?: { title: string; duration: string; note?: string; items: readonly string[] } }
 | { kind: "archive"; art: ArtId; montage?: readonly ArtId[]; label: string; date: string }
 | { kind: "chapter"; art: ArtId; number: number; title: string; date: string }
);
export type NarrativeScene = {
 id: string;
 title: string;
 chapter: 0 | 1 | 2 | 3 | 4 | 5;
 sourcePages: readonly number[];
 sourceEdition?: "v6" | "v7";
 status: "prototype" | "storyboard" | "needs-script";
 shots: readonly [SceneShot, ...SceneShot[]];
};
