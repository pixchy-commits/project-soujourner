import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch01-first-look",
  "title": "A brand-new world",
  "chapter": 1,
  "sourcePages": [
    11
  ],
  "status": "storyboard",
  "shots": [
    {
      "id": "rover-view",
      "kind": "illustration",
      "art": "ch01-first-look/rover-view",
      "framing": "first-person",
      "motion": "still",
      "dialogue": {
        "speaker": "MISSION ARCHIVE",
        "text": "Fifteen giant bounces later, the airbags deflate and Pathfinder unfolds its petals like a metal flower. Sunlight warms Sojourner’s solar panel. As the little rover looks out at a brand-new world, a warm memory flashes behind its camera eyes…"
      }
    },
    {
      "id": "camera-eyes",
      "kind": "illustration",
      "art": "ch01-first-look/camera-eyes",
      "framing": "wide",
      "motion": "still"
    }
  ]
} as const satisfies NarrativeScene;
