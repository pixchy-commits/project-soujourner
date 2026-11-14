import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch01-lander-unfolding",
  "title": "Arrival — a vast new world",
  "chapter": 1,
  "sourcePages": [
    9
  ],
  "status": "storyboard",
  "shots": [
    {
      "id": "landed-capsule",
      "kind": "illustration",
      "art": "ch01-lander-unfolding/landed-capsule",
      "motion": "still"
    },
    {
      "id": "open-petals",
      "kind": "illustration",
      "art": "ch01-lander-unfolding/open-petals",
      "framing": "overhead",
      "hotspot": { "label": "Select Sojo", "x": 44, "y": 21, "width": 12, "height": 24 },
      "motion": "still"
    }
  ]
} as const satisfies NarrativeScene;
