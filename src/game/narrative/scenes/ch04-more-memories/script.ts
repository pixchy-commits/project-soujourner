import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch04-more-memories",
  "title": "More memories to make",
  "chapter": 4,
  "sourcePages": [
    73
  ],
  "sourceEdition": "v7",
  "status": "needs-script",
  "shots": [
    {
      "id": "waking",
      "kind": "illustration",
      "notes": "Sojo wakes after the planned mission with no next assignment. It still wants to explore and bring back more data.",
      "motion": "still",
      "art": "ch04-more-memories/waking"
    },
    {
      "id": "companions",
      "kind": "illustration",
      "notes": "Sojo and Pathfinder celebrate their friendship and the completed primary mission. PDF dialogue is explicitly a demo, so leave it empty.",
      "motion": "still",
      "art": "ch04-more-memories/companions"
    },
    {
      "id": "new-hopes",
      "kind": "illustration",
      "notes": "Sojo wants more good memories and missions together. Final script is pending.",
      "motion": "still",
      "art": "ch04-more-memories/new-hopes"
    }
  ]
} as const satisfies NarrativeScene;
