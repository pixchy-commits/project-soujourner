import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "legacy-rover-evolution",
  "title": "The explorers that followed",
  "chapter": 5,
  "sourcePages": [
    91,
    92
  ],
  "sourceEdition": "v7",
  "status": "needs-script",
  "shots": [
    {
      "id": "sojourner",
      "kind": "archive",
      "label": "SOJOURNER",
      "date": "THE EXPLORERS THAT FOLLOWED",
      "notes": "First television: Sojourner. Final archival art and approved informational text pending.",
      "motion": "still",
      "art": "legacy-rover-evolution/sojourner"
    },
    {
      "id": "later-rovers",
      "kind": "archive",
      "label": "THE EXPLORERS THAT FOLLOWED",
      "date": "MISSION ARCHIVE",
      "notes": "Move to the next television and show the evolution toward later rovers. Final sequence and motivational narration pending.",
      "motion": "still",
      "art": "legacy-rover-evolution/later-rovers"
    },
    {
      "id": "wide-evolution",
      "kind": "archive",
      "label": "THE EXPLORERS THAT FOLLOWED",
      "date": "MISSION ARCHIVE",
      "notes": "Pull back to show the rover evolution together. Exact comparisons must follow approved research.",
      "motion": "still",
      "exitTransition": "black",
      "art": "legacy-rover-evolution/wide-evolution"
    }
  ]
} as const satisfies NarrativeScene;
