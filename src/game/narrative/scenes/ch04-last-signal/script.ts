import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch04-last-signal",
  "title": "The last signal",
  "chapter": 4,
  "sourcePages": [
    75
  ],
  "sourceEdition": "v7",
  "status": "prototype",
  "shots": [
    {
      "id": "opening-eyes",
      "kind": "illustration",
      "overlay": "ui/goggle-frame",
      "overlayScale": 1.16,
      "notes": "Storybook personification adapted from Jenny feedback; technical history is a separate team handoff.",
      "motion": "still",
      "framing": "first-person",
      "art": "ch04-last-signal/opening-eyes",
      "dialogue": {
        "speaker": "NARRATOR",
        "text": "At Ares Vallis, one sol passed, and then another. Sojo kept exploring, with his trusty friend Pathfinder always waiting for his return."
      }
    },
    {
      "id": "fading-energy",
      "kind": "illustration",
      "framing": "first-person",
      "overlay": "ui/goggle-frame",
      "overlayScale": 1.16,
      "notes": "Storybook personification adapted from Jenny feedback; technical history is a separate team handoff.",
      "motion": "still",
      "art": "ch04-last-signal/fading-energy",
      "dialogue": {
        "speaker": "NARRATOR",
        "text": "As the Martian nights grew colder, Pathfinder's energy began to fade."
      }
    },
    {
      "id": "quiet-pathfinder",
      "kind": "illustration",
      "framing": "first-person",
      "overlay": "ui/goggle-frame",
      "overlayScale": 1.16,
      "notes": "Storybook personification adapted from Jenny feedback; technical history is a separate team handoff.",
      "motion": "still",
      "art": "ch04-last-signal/quiet-pathfinder",
      "dialogue": {
        "speaker": "NARRATOR",
        "text": "Then, one day, Pathfinder finally fell asleep, resting after a long, long mission, with all the good memories they had made together."
      }
    }
  ]
} as const satisfies NarrativeScene;
