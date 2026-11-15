import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch03-yogi-reflection",
  "title": "Trying another approach",
  "chapter": 3,
  "sourcePages": [
    58
  ],
  "status": "needs-script",
  "shots": [
    {
      "id": "explanation",
      "kind": "illustration",
      "placeholder": "Sojo explains why the first analysis attempt failed and resolves to try another approach. Spoken explanation remains empty until approved research/script arrives.",
      "motion": "still",
      "art": "ch03-yogi-reflection/explanation"
    }
  ]
} as const satisfies NarrativeScene;
