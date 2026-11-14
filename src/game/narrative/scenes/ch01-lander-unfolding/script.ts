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
      "motion": "still"
    }
  ]
} as const satisfies NarrativeScene;
