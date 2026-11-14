import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch01-atmospheric-entry",
  "title": "Through the atmosphere",
  "chapter": 1,
  "sourcePages": [
    6
  ],
  "status": "storyboard",
  "shots": [
    {
      "id": "heat-shield",
      "kind": "illustration",
      "art": "entry-exterior",
      "motion": "still",
      "dialogue": {
        "speaker": "MISSION ARCHIVE",
        "text": "Outside the shell, flames roar against the heat shield as Mars rushes closer."
      }
    },
    {
      "id": "cabin",
      "kind": "illustration",
      "art": "entry-cabin",
      "motion": "still",
      "dialogue": {
        "speaker": "MISSION ARCHIVE",
        "text": "Inside, little Sojourner peeks out at the rusty red world below—heart beeping fast, ready to finally begin its job."
      }
    },
    {
      "id": "eyes-closeup",
      "kind": "illustration",
      "art": "entry-eyes",
      "framing": "wide",
      "motion": "still"
    }
  ]
} as const satisfies NarrativeScene;
