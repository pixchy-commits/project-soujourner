import { scene as scene0 } from "./scenes/ch01-arrival/script";
import { scene as scene1 } from "./scenes/ch01-atmospheric-entry/script";
import { scene as scene2 } from "./scenes/ch01-first-look/script";
import { scene as scene3 } from "./scenes/ch01-lander-unfolding/script";
import { scene as scene4 } from "./scenes/ch01-pathfinder-friendship/script";
import { scene as scene5 } from "./scenes/ch01-window-transition/script";
import { scene as scene6 } from "./scenes/ch02-baby-steps/script";
import { scene as scene7 } from "./scenes/ch02-celebration/script";
import { scene as scene8 } from "./scenes/ch02-earth-flashback/script";
import { scene as scene9 } from "./scenes/ch02-mission-briefing/script";
import { scene as scene10 } from "./scenes/ch02-mission-introduction/script";
import { scene as scene11 } from "./scenes/prologue-archive/script";
import { scene as scene12 } from "./scenes/prologue-identification/script";
import type { NarrativeScene } from "./types";

export const scenes = {
  "ch01-arrival": scene0,
  "ch01-atmospheric-entry": scene1,
  "ch01-first-look": scene2,
  "ch01-lander-unfolding": scene3,
  "ch01-pathfinder-friendship": scene4,
  "ch01-window-transition": scene5,
  "ch02-baby-steps": scene6,
  "ch02-celebration": scene7,
  "ch02-earth-flashback": scene8,
  "ch02-mission-briefing": scene9,
  "ch02-mission-introduction": scene10,
  "prologue-archive": scene11,
  "prologue-identification": scene12,
} as const satisfies Record<string, NarrativeScene>;
export type SceneId = keyof typeof scenes;
export function getScene(id: SceneId): NarrativeScene { return scenes[id]; }
