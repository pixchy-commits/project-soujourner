import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "legacy-museum",
  "title": "One last look",
  "chapter": 5,
  "sourcePages": [
    94
  ],
  "sourceEdition": "v7",
  "status": "needs-script",
  "shots": [
    {
      "id": "museum",
      "kind": "illustration",
      "notes": "Final exhibit / Marie Curie reference scene. The PDF includes an optional fourth-wall idea; exact execution and spoken script remain unresolved.",
      "motion": "still",
      "art": "legacy-museum/museum"
    },
    {
      "id": "farewell",
      "kind": "illustration",
      "notes": "Final quiet frame and fade out. Final art and ending text pending.",
      "motion": "still",
      "exitTransition": "black",
      "art": "legacy-museum/farewell"
    }
  ]
} as const satisfies NarrativeScene;
