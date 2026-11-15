import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch03-yogi-observation",
  "title": "Something about this rock",
  "chapter": 3,
  "sourcePages": [
    56
  ],
  "sourceEdition": "v7",
  "status": "needs-script",
  "shots": [
    {
      "id": "uneasy-rock",
      "kind": "illustration",
      "notes": "Sojo observes Yogi and feels something is unusual. Foreshadow the later positioning problem; final monologue is missing.",
      "motion": "still",
      "framing": "wide",
      "art": "ch03-yogi-observation/uneasy-rock"
    }
  ]
} as const satisfies NarrativeScene;
