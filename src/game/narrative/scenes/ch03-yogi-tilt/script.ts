import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch03-yogi-tilt",
  "title": "An awkward position",
  "chapter": 3,
  "sourcePages": [
    58
  ],
  "sourceEdition": "v7",
  "status": "needs-script",
  "shots": [
    {
      "id": "backwards-approach",
      "kind": "illustration",
      "notes": "Sojo attempts to maneuver backward near Yogi. Exact geometry and historical details await approved reference.",
      "motion": "still",
      "art": "ch03-yogi-tilt/backwards-approach"
    },
    {
      "id": "tilted-rover",
      "kind": "illustration",
      "notes": "Jenny feedback: rear wheels stranded high on the steep curved Yogi boulder, front low on sand. Narrative illustration; no gameplay.",
      "motion": "still",
      "art": "ch03-yogi-tilt/tilted-rover"
    }
  ]
} as const satisfies NarrativeScene;
