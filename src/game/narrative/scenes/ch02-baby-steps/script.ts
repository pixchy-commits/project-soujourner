import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch02-baby-steps",
  "title": "Baby Steps",
  "chapter": 2,
  "sourcePages": [
    13
  ],
  "status": "prototype",
  "shots": [
    {
      "id": "chapter-card",
      "kind": "chapter",
      "art": "ch02-baby-steps/chapter-card",
      "number": 2,
      "title": "BABY STEPS",
      "date": "JULY 4, 1997"
    }
  ]
} as const satisfies NarrativeScene;
