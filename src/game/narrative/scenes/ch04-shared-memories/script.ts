import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch04-shared-memories",
  "title": "Remembering a friend",
  "chapter": 4,
  "sourcePages": [
    76
  ],
  "sourceEdition": "v7",
  "status": "needs-script",
  "shots": [
    {
      "id": "memories",
      "kind": "illustration",
      "notes": "Sojo recalls good memories with Pathfinder during its final mission. Final memory selection and dialogue pending.",
      "motion": "still",
      "transition": "memory",
      "art": "ch04-shared-memories/memories"
    }
  ]
} as const satisfies NarrativeScene;
