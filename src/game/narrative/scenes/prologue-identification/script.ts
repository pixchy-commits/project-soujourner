import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "prologue-identification",
  "title": "Pathfinder and Sojourner",
  "chapter": 0,
  "sourcePages": [
    4
  ],
  "status": "prototype",
  "shots": [
    {
      "id": "identification",
      "kind": "archive",
      "art": "pathfinder-identification",
      "label": "LAST KNOWN LOCATION",
      "date": "ARES VALLIS · MARS",
      "dialogue": {
        "speaker": "MISSION ARCHIVE",
        "text": "Here in the ancient flood channel of Ares Vallis sit two of the earliest pioneers: the Mars Pathfinder lander, and a tiny six-wheeled rover named Sojourner."
      }
    },
    {
      "id": "rewind",
      "kind": "archive",
      "art": "pathfinder-identification",
      "label": "MISSION ARCHIVE",
      "date": "REWIND TO 1997",
      "dialogue": {
        "speaker": "MISSION ARCHIVE",
        "text": "Their radios have been quiet for decades… but what stories did they leave behind? Let’s rewind the clock to 1997 and find out."
      }
    }
  ]
} as const satisfies NarrativeScene;
