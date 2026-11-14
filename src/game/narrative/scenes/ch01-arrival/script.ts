import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch01-arrival",
  "title": "Arrival on Mars",
  "chapter": 1,
  "sourcePages": [
    5
  ],
  "status": "prototype",
  "shots": [
    {
      "id": "chapter-card",
      "kind": "chapter",
      "art": "arrival-card",
      "number": 1,
      "title": "ARRIVAL ON MARS",
      "date": "JULY 4, 1997"
    }
  ]
} as const satisfies NarrativeScene;
