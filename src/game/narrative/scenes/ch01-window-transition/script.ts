import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch01-window-transition",
  "title": "A vast new world",
  "chapter": 1,
  "sourcePages": [
    7
  ],
  "status": "storyboard",
  "shots": [
    {
      "id": "window-glass",
      "kind": "illustration",
      "art": "ch01-window-transition/window-glass",
      "motion": "still",
      "notes": "User-directed revision: vast surface-level Mars arrival reveal, after landing. Keep Sojourner small at the edge. No invented dialogue."
    }
  ]
} as const satisfies NarrativeScene;
