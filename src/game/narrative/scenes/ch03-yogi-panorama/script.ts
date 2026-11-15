import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch03-yogi-panorama",
  "title": "The way to Yogi",
  "chapter": 3,
  "sourcePages": [
    46
  ],
  "status": "needs-script",
  "shots": [
    {
      "id": "panorama",
      "kind": "illustration",
      "placeholder": "First-person panorama reveals the terrain around Yogi and how difficult the approach will be. Panorama artwork and final narration are pending.",
      "motion": "pan",
      "framing": "first-person",
      "art": "ch03-yogi-panorama/panorama"
    }
  ]
} as const satisfies NarrativeScene;
