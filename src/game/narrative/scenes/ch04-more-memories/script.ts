import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch04-more-memories",
  "title": "More memories to make",
  "chapter": 4,
  "sourcePages": [
    73
  ],
  "sourceEdition": "v7",
  "status": "prototype",
  "shots": [
    {
      "id": "waking",
      "kind": "illustration",
      "notes": "Sojo wakes after the planned mission with no next assignment. It still wants to explore and bring back more data.",
      "motion": "still",
      "art": "ch04-more-memories/waking",
      "dialogue": {
        "speaker": "SOJOURNER",
        "text": "Hm... It's a new day here on Mars, but my creators on Earth haven't planned anything for me. What should I do?"
      }
    },
    {
      "id": "companions",
      "kind": "illustration",
      "notes": "Sojo and Pathfinder celebrate their friendship and the completed primary mission. PDF dialogue is explicitly a demo, so leave it empty.",
      "motion": "still",
      "art": "ch04-more-memories/companions",
      "dialogue": {
        "speaker": "PATHFINDER",
        "text": "What would you like to do, little buddy?"
      }
    },
    {
      "id": "sojo-wishes",
      "kind": "illustration",
      "notes": "Sojo and Pathfinder celebrate their friendship and the completed primary mission. PDF dialogue is explicitly a demo, so leave it empty.",
      "motion": "still",
      "art": "ch04-more-memories/companions",
      "dialogue": {
        "speaker": "SOJOURNER",
        "text": "I've had so much fun exploring and gathering data! I want to keep going and bring back more discoveries to make our creators proud."
      }
    },
    {
      "id": "more-good-memories",
      "kind": "illustration",
      "notes": "Sojo and Pathfinder celebrate their friendship and the completed primary mission. PDF dialogue is explicitly a demo, so leave it empty.",
      "motion": "still",
      "art": "ch04-more-memories/companions",
      "dialogue": {
        "speaker": "SOJOURNER",
        "text": "And I want to make more good memories with you, Pathfinder!"
      }
    },
    {
      "id": "new-hopes",
      "kind": "illustration",
      "notes": "Sojo wants more good memories and missions together. Final script is pending.",
      "motion": "still",
      "art": "ch04-more-memories/new-hopes",
      "dialogue": {
        "speaker": "SOJOURNER",
        "text": "I'll be back with more discoveries. Bye for now, Pathfinder!"
      }
    },
    {
      "id": "pathfinder-farewell",
      "kind": "illustration",
      "notes": "Sojo wants more good memories and missions together. Final script is pending.",
      "motion": "still",
      "art": "ch04-more-memories/new-hopes",
      "dialogue": {
        "speaker": "PATHFINDER",
        "text": "I'll be right here, little buddy. Remember to rest, and have fun out there!"
      }
    },
    {
      "id": "exploration-divider",
      "kind": "illustration",
      "art": "ch04-more-memories/new-hopes",
      "motion": "still",
      "intertitle": "Ever since that sol, Sojo has set off on countless explorations, making memories with Pathfinder and bringing back invaluable findings for their creators..."
    }
  ]
} as const satisfies NarrativeScene;
