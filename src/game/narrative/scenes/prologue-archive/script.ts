import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "prologue-archive",
  "title": "The ones we left behind",
  "chapter": 0,
  "sourcePages": [
    4
  ],
  "status": "prototype",
  "shots": [
    {
      "id": "report",
      "kind": "archive",
      "art": "archive-montage",
      "montage": [
        "archive-montage",
        "archive-entry",
        "archive-landscape"
      ],
      "label": "INCOMING TRANSMISSION",
      "date": "MARS · THE PRESENT DAY",
      "dialogue": {
        "speaker": "MISSION ARCHIVE",
        "text": "Across the rusty plains of Mars rest silent machines built by human hands. They have no way to come home, and some of their radios went quiet decades ago."
      }
    }
  ]
} as const satisfies NarrativeScene;
