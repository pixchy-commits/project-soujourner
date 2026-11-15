import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch04-resting-together",
  "title": "By your side",
  "chapter": 4,
  "sourcePages": [
    78
  ],
  "sourceEdition": "v7",
  "status": "prototype",
  "shots": [
    {
      "id": "leaning",
      "kind": "illustration",
      "notes": "Jenny feedback: closed eyes, warm cinematic backlight, peaceful ending.",
      "motion": "still",
      "art": "ch04-resting-together/leaning",
      "dialogue": {
        "speaker": "NARRATOR",
        "text": "And then... the two friends rested side by side, beneath the first stars."
      }
    },
    {
      "id": "wide-rest",
      "kind": "illustration",
      "notes": "Jenny feedback: closed eyes, warm cinematic backlight, peaceful ending.",
      "motion": "still",
      "exitTransition": "black",
      "art": "ch04-resting-together/wide-rest",
      "dialogue": {
        "speaker": "NARRATOR",
        "text": "After their long mission, these little pioneers could finally rest beneath the Martian sky. To their creators back on Earth, they were heroes."
      }
    }
  ]
} as const satisfies NarrativeScene;
