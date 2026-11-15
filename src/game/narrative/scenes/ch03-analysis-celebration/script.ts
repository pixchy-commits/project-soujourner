import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch03-analysis-celebration",
  "title": "A proud moment back on Earth",
  "chapter": 3,
  "sourcePages": [
    71
  ],
  "sourceEdition": "v7",
  "status": "prototype",
  "shots": [
    {
      "id": "scientists",
      "kind": "illustration",
      "notes": "Scientists celebrate the successful Yogi analysis on Earth. Final celebration art and dialogue are pending.",
      "motion": "still",
      "art": "ch03-analysis-celebration/scientists",
      "dialogue": {
        "speaker": "NARRATOR",
        "text": "Back on Earth, Sojo and Pathfinder's creators celebrate a successful seven-sol mission. Together, the two friends have made them proud."
      }
    },
    {
      "id": "sleep",
      "kind": "illustration",
      "notes": "Sojo falls asleep wondering what comes next. Final internal line is missing.",
      "motion": "still",
      "exitTransition": "black",
      "art": "ch03-analysis-celebration/sleep",
      "dialogue": {
        "speaker": "NARRATOR",
        "text": "Their main mission is complete. But what will come next? Let's see what our little Sojo and Pathfinder are up to, shall we?"
      }
    }
  ]
} as const satisfies NarrativeScene;
