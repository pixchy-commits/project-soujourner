import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch02-mission-briefing",
  "title": "The next mission",
  "chapter": 2,
  "sourcePages": [
    20
  ],
  "status": "needs-script",
  "shots": [
    {
      "id": "briefing",
      "kind": "illustration",
      "art": "ch02-mission-briefing/briefing",
      "notes": "Separate briefing after the celebration, as confirmed. Final mission command is missing; keep this shot silent."
    }
  ]
} as const satisfies NarrativeScene;
