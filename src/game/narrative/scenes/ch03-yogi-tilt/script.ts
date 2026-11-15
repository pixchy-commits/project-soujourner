import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch03-yogi-tilt",
  "title": "An awkward position",
  "chapter": 3,
  "sourcePages": [
    55
  ],
  "status": "needs-script",
  "shots": [
    {
      "id": "backwards-approach",
      "kind": "illustration",
      "placeholder": "Sojo attempts to maneuver backward near Yogi. Exact geometry and historical details await approved reference.",
      "motion": "still",
      "art": "ch03-yogi-tilt/backwards-approach"
    },
    {
      "id": "tilted-rover",
      "kind": "illustration",
      "placeholder": "Sojo accidentally climbs the rock and becomes tilted. Keep this as a draft narrative placeholder; do not invent danger dialogue or technical claims.",
      "motion": "still",
      "art": "ch03-yogi-tilt/tilted-rover"
    }
  ]
} as const satisfies NarrativeScene;
