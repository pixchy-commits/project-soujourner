import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch02-earth-flashback",
  "title": "A memory of home",
  "chapter": 2,
  "sourcePages": [
    14
  ],
  "status": "needs-script",
  "shots": [
    {
      "id": "blink",
      "kind": "illustration",
      "art": "ch02-earth-flashback/blink",
      "framing": "wide",
      "motion": "still"
    },
    {
      "id": "construction",
      "kind": "illustration",
      "art": "ch02-earth-flashback/construction",
      "transition": "memory",
      "motion": "still"
    },
    {
      "id": "introduction",
      "kind": "illustration",
      "art": "ch02-earth-flashback/introduction",
      "notes": "The source fact caption ends mid-sentence; wait for complete approved wording."
    },
    {
      "id": "mission",
      "kind": "illustration",
      "art": "ch02-earth-flashback/mission",
      "notes": "Scientists’ spoken mission script is missing."
    },
    {
      "id": "memory-eyes",
      "kind": "illustration",
      "art": "ch02-earth-flashback/memory-eyes",
      "framing": "wide",
      "motion": "still"
    }
  ]
} as const satisfies NarrativeScene;
