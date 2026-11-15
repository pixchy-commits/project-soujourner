import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch03-viewpoint-rest",
  "title": "A pause between missions",
  "chapter": 3,
  "sourcePages": [
    46
  ],
  "sourceEdition": "v7",
  "status": "needs-script",
  "shots": [
    {
      "id": "closing-eyes",
      "kind": "illustration",
      "framing": "first-person",
      "overlay": "ui/goggle-frame",
      "overlayScale": 1.16,
      "notes": "Sojo slowly closes its eyes after the mission. Sleep transition; artwork pending.",
      "motion": "still",
      "exitTransition": "black",
      "art": "ch03-viewpoint-rest/closing-eyes"
    }
  ]
} as const satisfies NarrativeScene;
