import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "legacy-rover-evolution",
  "title": "The explorers that followed",
  "chapter": 5,
  "sourcePages": [
    87,
    88
  ],
  "status": "needs-script",
  "shots": [
    {
      "id": "sojourner",
      "kind": "illustration",
      "placeholder": "First television: Sojourner. Final archival art and approved informational text pending.",
      "motion": "still",
      "art": "legacy-rover-evolution/sojourner"
    },
    {
      "id": "later-rovers",
      "kind": "illustration",
      "placeholder": "Move to the next television and show the evolution toward later rovers. Final sequence and motivational narration pending.",
      "motion": "still",
      "art": "legacy-rover-evolution/later-rovers"
    },
    {
      "id": "wide-evolution",
      "kind": "illustration",
      "placeholder": "Pull back to show the rover evolution together. Exact comparisons must follow approved research.",
      "motion": "still",
      "exitTransition": "black",
      "art": "legacy-rover-evolution/wide-evolution"
    }
  ]
} as const satisfies NarrativeScene;
