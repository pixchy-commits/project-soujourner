import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch04-earth-dot",
  "title": "A small light called home",
  "chapter": 4,
  "sourcePages": [
    77
  ],
  "sourceEdition": "v7",
  "status": "prototype",
  "shots": [
    {
      "id": "earth",
      "kind": "illustration",
      "notes": "Earth remains a tiny pale-blue point in the wide sky.",
      "motion": "still",
      "art": "ch04-earth-dot/earth",
      "dialogue": {
        "speaker": "NARRATOR",
        "text": "On that Martian night, Sojo looked back toward his birth planet with pride and joy."
      }
    },
    {
      "id": "eyes",
      "kind": "illustration",
      "notes": "Small symbolic Earth reflection in camera eye, per Jenny feedback.",
      "motion": "still",
      "art": "ch04-earth-dot/eyes",
      "dialogue": {
        "speaker": "NARRATOR",
        "text": "Then he returned to Ares Vallis, where Pathfinder was taking a nap..."
      }
    }
  ]
} as const satisfies NarrativeScene;
