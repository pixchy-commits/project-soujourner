import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch03-ready-to-scan",
  "title": "Ready to try again",
  "chapter": 3,
  "sourcePages": [
    61,
    62
  ],
  "status": "needs-script",
  "shots": [
    {
      "id": "ready",
      "kind": "illustration",
      "placeholder": "Sojo reaches a suitable position and is ready to start analysis. Pages 61 and 62 repeat this beat; use one shared placeholder until the team distinguishes them.",
      "motion": "still",
      "art": "ch03-ready-to-scan/ready"
    }
  ]
} as const satisfies NarrativeScene;
