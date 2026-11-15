import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "legacy-title",
  "title": "The Legacy",
  "chapter": 5,
  "sourcePages": [
    88
  ],
  "sourceEdition": "v7",
  "status": "needs-script",
  "shots": [
    {
      "id": "title",
      "kind": "illustration",
      "caption": "THE LEGACY · Present Time",
      "notes": "THE LEGACY — Present Time. Dedicated title artwork pending.",
      "motion": "still",
      "art": "legacy-title/title"
    }
  ]
} as const satisfies NarrativeScene;
