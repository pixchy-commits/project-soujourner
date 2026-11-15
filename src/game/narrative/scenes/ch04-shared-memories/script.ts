import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch04-shared-memories",
  "title": "Remembering a friend",
  "chapter": 4,
  "sourcePages": [
    73
  ],
  "status": "needs-script",
  "shots": [
    {
      "id": "memories",
      "kind": "illustration",
      "placeholder": "Sojo recalls good memories with Pathfinder during its final mission. Final memory selection and dialogue pending.",
      "motion": "still",
      "transition": "memory",
      "art": "ch04-shared-memories/memories"
    }
  ]
} as const satisfies NarrativeScene;
