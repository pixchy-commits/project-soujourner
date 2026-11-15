import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch03-analysis-celebration",
  "title": "A proud moment back on Earth",
  "chapter": 3,
  "sourcePages": [
    68
  ],
  "status": "needs-script",
  "shots": [
    {
      "id": "scientists",
      "kind": "illustration",
      "placeholder": "Scientists celebrate the successful Yogi analysis on Earth. Final celebration art and dialogue are pending.",
      "motion": "still",
      "art": "ch03-analysis-celebration/scientists"
    },
    {
      "id": "sleep",
      "kind": "illustration",
      "placeholder": "Sojo falls asleep wondering what comes next. Final internal line is missing.",
      "motion": "still",
      "exitTransition": "black",
      "art": "ch03-analysis-celebration/sleep"
    }
  ]
} as const satisfies NarrativeScene;
