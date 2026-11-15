import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch03-yogi-reassurance",
  "title": "A little reassurance",
  "chapter": 3,
  "sourcePages": [
    53,
    54
  ],
  "sourceEdition": "v7",
  "status": "needs-script",
  "shots": [
    {
      "id": "worried",
      "kind": "illustration",
      "notes": "Sojo worries about approaching Yogi. Inner-monologue wording is unresolved; leave the spoken line empty.",
      "motion": "still",
      "art": "ch03-yogi-reassurance/worried"
    },
    {
      "id": "pathfinder-comfort",
      "kind": "illustration",
      "framing": "first-person",
      "overlay": "ui/goggle-frame",
      "overlayScale": 1.16,
      "notes": "Pathfinder reassures Sojo. Final art pending.",
      "motion": "still",
      "dialogue": {
        "speaker": "PATHFINDER",
        "text": "Its okay sojo, you can do this!"
      },
      "art": "ch03-yogi-reassurance/pathfinder-comfort"
    }
  ]
} as const satisfies NarrativeScene;
