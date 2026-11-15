import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch04-time-passing",
  "title": "Time moves forward",
  "chapter": 4,
  "sourcePages": [
    74
  ],
  "sourceEdition": "v7",
  "status": "needs-script",
  "shots": [
    {
      "id": "early-days",
      "kind": "illustration",
      "notes": "The first view of Sojo during the time-passing montage. Final artwork and approved timestamps pending.",
      "motion": "still",
      "art": "ch04-time-passing/early-days"
    },
    {
      "id": "weathering",
      "kind": "illustration",
      "notes": "Later view: the wheels show more weathering. Match the same composition as the preceding shot for a dissolve.",
      "motion": "still",
      "art": "ch04-time-passing/weathering"
    },
    {
      "id": "late-days",
      "kind": "illustration",
      "notes": "Final view of the time-passing montage. The storyboard calls for increasingly rusty wheels; historical visual treatment needs confirmation.",
      "motion": "still",
      "exitTransition": "black",
      "art": "ch04-time-passing/late-days"
    }
  ]
} as const satisfies NarrativeScene;
