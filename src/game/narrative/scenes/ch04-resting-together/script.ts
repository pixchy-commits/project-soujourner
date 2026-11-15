import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch04-resting-together",
  "title": "By your side",
  "chapter": 4,
  "sourcePages": [
    78
  ],
  "sourceEdition": "v7",
  "status": "needs-script",
  "shots": [
    {
      "id": "leaning",
      "kind": "illustration",
      "notes": "Sojo sits down and leans against Pathfinder. No spoken line has been supplied.",
      "motion": "still",
      "art": "ch04-resting-together/leaning"
    },
    {
      "id": "wide-rest",
      "kind": "illustration",
      "notes": "Wide view of both companions resting with Earth as a dot behind them. End the scene with the storyboard fade.",
      "motion": "still",
      "exitTransition": "black",
      "art": "ch04-resting-together/wide-rest"
    }
  ]
} as const satisfies NarrativeScene;
