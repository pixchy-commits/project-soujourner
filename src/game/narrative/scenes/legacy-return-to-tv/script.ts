import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "legacy-return-to-tv",
  "title": "Back to the archive",
  "chapter": 5,
  "sourcePages": [
    89,
    90
  ],
  "sourceEdition": "v7",
  "status": "needs-script",
  "shots": [
    {
      "id": "pull-back",
      "kind": "archive",
      "label": "MISSION ARCHIVE",
      "date": "PRESENT TIME",
      "notes": "Reuse the actual introductory CRT and archive room. The final Mars shot plays inside that same screen.",
      "motion": "still",
      "art": "ch04-resting-together/wide-rest"
    },
    {
      "id": "television-wall",
      "kind": "illustration",
      "screenGallery": [
        { "art": "legacy-rover-evolution/sojourner", "x": 19, "y": 12, "width": 15, "height": 11 },
        { "art": "legacy-rover-evolution/later-rovers", "x": 38, "y": 12, "width": 11, "height": 11 },
        { "art": "ch04-resting-together/wide-rest", "x": 19.5, "y": 30, "width": 29.5, "height": 26 },
        { "art": "legacy-rover-evolution/later-rovers", "x": 56, "y": 16, "width": 24, "height": 23 },
        { "art": "legacy-rover-evolution/wide-evolution", "x": 56, "y": 62, "width": 24, "height": 18 }
      ],
      "notes": "Reveal the archive wall of multiple televisions. The numbered drawings on page 86 are camera framing references, not dialogue.",
      "motion": "still",
      "art": "legacy-return-to-tv/television-wall"
    }
  ]
} as const satisfies NarrativeScene;
