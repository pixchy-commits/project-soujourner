import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch04-shared-memories",
  "title": "Remembering a friend",
  "chapter": 4,
  "sourcePages": [
    76
  ],
  "sourceEdition": "v7",
  "status": "prototype",
  "shots": [
    {
      "id": "memories",
      "kind": "illustration",
      "art": "ch04-shared-memories/memories",
      "motion": "still",
      "memoryMontage": [
        "ch04-shared-memories/memories",
        "ch04-shared-memories/laughter",
        "ch04-shared-memories/discovery",
        "ch04-shared-memories/sunset",
        "ch04-shared-memories/homecoming"
      ],
      "notes": "Jenny feedback: a quick, warm montage of happy memories. No spoken line."
    }
  ]
} as const satisfies NarrativeScene;
