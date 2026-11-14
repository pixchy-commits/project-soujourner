import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch02-celebration",
  "title": "Baby steps complete",
  "chapter": 2,
  "sourcePages": [
    19
  ],
  "status": "storyboard",
  "shots": [
    {
      "id": "scientists",
      "kind": "illustration",
      "art": "ch02-celebration/scientists",
      "confetti": true,
      "dialogue": {
        "speaker": "MISSION CONTROL",
        "text": "Congratulations! Sojo has successfully completed its baby steps!"
      }
    }
  ]
} as const satisfies NarrativeScene;
