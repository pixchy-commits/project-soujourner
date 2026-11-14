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
      "notes": "Final mission command is missing; page 20/21 relationship awaits clarification."
    }
  ]
} as const satisfies NarrativeScene;
