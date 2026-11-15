import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch03-viewpoint-rest",
  "title": "A pause between missions",
  "chapter": 3,
  "sourcePages": [
    43
  ],
  "status": "needs-script",
  "shots": [
    {
      "id": "closing-eyes",
      "kind": "illustration",
      "placeholder": "Sojo slowly closes its eyes after the mission. Sleep transition; artwork pending.",
      "motion": "still",
      "exitTransition": "black",
      "art": "ch03-viewpoint-rest/closing-eyes"
    }
  ]
} as const satisfies NarrativeScene;
