import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch04-last-signal",
  "title": "The last signal",
  "chapter": 4,
  "sourcePages": [
    75
  ],
  "sourceEdition": "v7",
  "status": "needs-script",
  "shots": [
    {
      "id": "opening-eyes",
      "kind": "illustration",
      "overlay": "ui/goggle-frame",
      "overlayScale": 1.16,
      "notes": "First-person blink: Sojo opens its eyes to see Pathfinder.",
      "motion": "still",
      "framing": "first-person",
      "art": "ch04-last-signal/opening-eyes"
    },
    {
      "id": "fading-energy",
      "kind": "illustration",
      "framing": "first-person",
      "overlay": "ui/goggle-frame",
      "overlayScale": 1.16,
      "notes": "Pathfinder grows quiet as its energy fades. Battery UI and exact technical interpretation remain placeholders.",
      "motion": "still",
      "art": "ch04-last-signal/fading-energy"
    },
    {
      "id": "quiet-pathfinder",
      "kind": "illustration",
      "framing": "first-person",
      "overlay": "ui/goggle-frame",
      "overlayScale": 1.16,
      "notes": "Pathfinder closes its eyes. The storyboard asks for this to connect to time passing, rather than happen suddenly.",
      "motion": "still",
      "art": "ch04-last-signal/quiet-pathfinder"
    }
  ]
} as const satisfies NarrativeScene;
