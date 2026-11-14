import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch02-mission-introduction",
  "title": "Welcome to the Rock Garden",
  "chapter": 2,
  "sourcePages": [
    15
  ],
  "status": "storyboard",
  "shots": [
    {
      "id": "introduction",
      "kind": "illustration",
      "art": "ch02-mission-introduction/sojo-introduction",
      "dialogue": {
        "speaker": "SOJOURNER",
        "text": "Welcome to the Rock Garden! I’m Sojourner the rover, but you can call me Sojo! My main mission lasts 7 Sols—that’s 7 Martian days! Every day, Earth sends us a goal through Pathfinder, he’s my trusty friend over there!"
      }
    },
    {
      "id": "mission-description",
      "kind": "illustration",
      "art": "ch02-mission-introduction/mission-description",
      "missionSheet": {
        "title": "MISSION DESCRIPTION",
        "duration": "DURATION: 7 SOLS",
        "note": "1 Sol is a Martian day.",
        "items": ["Sol 1", "Sol 2", "Sol 3"]
      },
      "dialogue": {
        "speaker": "SOJOURNER",
        "text": "Help me climb over tricky rocks, press my special X-ray sensor against new rock friends like Barnacle Bill and Yogi to sniff out what they’re made of, and send our findings back to Pathfinder before sunset!"
      }
    }
  ]
} as const satisfies NarrativeScene;
