import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch03-yogi-reassurance",
  "title": "A little reassurance",
  "chapter": 3,
  "sourcePages": [
    50,
    51
  ],
  "status": "needs-script",
  "shots": [
    {
      "id": "worried",
      "kind": "illustration",
      "placeholder": "Sojo worries about approaching Yogi. Inner-monologue wording is unresolved; leave the spoken line empty.",
      "motion": "still",
      "art": "ch03-yogi-reassurance/worried"
    },
    {
      "id": "pathfinder-comfort",
      "kind": "illustration",
      "placeholder": "Pathfinder reassures Sojo. Final art pending.",
      "motion": "still",
      "dialogue": {
        "speaker": "PATHFINDER",
        "text": "Its okay sojo, you can do this!"
      },
      "art": "ch03-yogi-reassurance/pathfinder-comfort"
    }
  ]
} as const satisfies NarrativeScene;
