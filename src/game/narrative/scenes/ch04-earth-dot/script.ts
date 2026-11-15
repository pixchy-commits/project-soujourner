import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch04-earth-dot",
  "title": "A small light called home",
  "chapter": 4,
  "sourcePages": [
    77
  ],
  "sourceEdition": "v7",
  "status": "needs-script",
  "shots": [
    {
      "id": "earth",
      "kind": "illustration",
      "notes": "Sojo looks toward Earth as a tiny dot in the sky. Leave the frame spacious; final artwork and narration pending.",
      "motion": "still",
      "art": "ch04-earth-dot/earth"
    },
    {
      "id": "eyes",
      "kind": "illustration",
      "notes": "Close view of Sojo looking toward home. Expression art pending.",
      "motion": "still",
      "art": "ch04-earth-dot/eyes"
    }
  ]
} as const satisfies NarrativeScene;
