import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch04-time-passing",
  "title": "Time moves forward",
  "chapter": 4,
  "sourcePages": [
    74
  ],
  "sourceEdition": "v7",
  "status": "prototype",
  "shots": [
    {
      "id": "early-days",
      "kind": "illustration",
      "notes": "Illustrative time markers proposed in Jenny feedback; not an exact dated reconstruction.",
      "motion": "still",
      "art": "ch04-time-passing/early-days",
      "dialogue": {
        "speaker": "NARRATOR",
        "text": "Sojo continued his journey beyond what his creators had planned, gathering more data to send back to Earth."
      },
      "timeLabel": "SOL 12"
    },
    {
      "id": "weathering",
      "kind": "illustration",
      "notes": "Illustrative time markers proposed in Jenny feedback; not an exact dated reconstruction.",
      "motion": "still",
      "art": "ch04-time-passing/weathering",
      "dialogue": {
        "speaker": "NARRATOR",
        "text": "Day by day, Martian dirt and sand gathered on his wheels, leaving traces of every journey."
      },
      "timeLabel": "SOL 50"
    },
    {
      "id": "late-days",
      "kind": "illustration",
      "notes": "Illustrative time markers proposed in Jenny feedback; not an exact dated reconstruction.",
      "motion": "still",
      "art": "ch04-time-passing/late-days",
      "dialogue": {
        "speaker": "NARRATOR",
        "text": "Our little Sojo had come so far. And along the way, he made wonderful memories with his friend Pathfinder."
      },
      "timeLabel": "SOL 80"
    }
  ]
} as const satisfies NarrativeScene;
