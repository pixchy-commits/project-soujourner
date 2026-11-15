import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "legacy-title",
  "title": "The Legacy",
  "chapter": 5,
  "sourcePages": [
    84
  ],
  "status": "needs-script",
  "shots": [
    {
      "id": "title",
      "kind": "illustration",
      "placeholder": "THE LEGACY — Present Time. Dedicated title artwork pending.",
      "motion": "still",
      "art": "legacy-title/title"
    }
  ]
} as const satisfies NarrativeScene;
