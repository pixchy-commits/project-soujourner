import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch01-pathfinder-friendship",
  "title": "A trusted friend",
  "chapter": 1,
  "sourcePages": [
    12
  ],
  "status": "storyboard",
  "shots": [
    {
      "id": "sojo-question",
      "kind": "illustration",
      "art": "ch01-pathfinder-friendship/pathfinder",
      "framing": "first-person",
      "dialogue": {
        "speaker": "SOJOURNER",
        "text": "I did it, Pathfinder! My wheels are touching real Martian dirt! Can our creators back on Earth see me?"
      }
    },
    {
      "id": "pathfinder-reply",
      "kind": "illustration",
      "art": "ch01-pathfinder-friendship/pathfinder",
      "framing": "first-person",
      "dialogue": {
        "speaker": "PATHFINDER",
        "text": "Loud and clear, little buddy. Your radio is too small to reach Earth on your own so send every discovery to me, and I’ll beam them straight home. You explore out there; I’ll watch over you from right here."
      }
    }
  ]
} as const satisfies NarrativeScene;
