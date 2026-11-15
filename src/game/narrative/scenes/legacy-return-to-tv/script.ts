import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "legacy-return-to-tv",
  "title": "Back to the archive",
  "chapter": 5,
  "sourcePages": [
    85,
    86
  ],
  "status": "needs-script",
  "shots": [
    {
      "id": "pull-back",
      "kind": "illustration",
      "placeholder": "Pull back out of the story into the archive television. Final room art and camera choreography pending.",
      "motion": "still",
      "art": "legacy-return-to-tv/pull-back"
    },
    {
      "id": "television-wall",
      "kind": "illustration",
      "placeholder": "Reveal the archive wall of multiple televisions. The numbered drawings on page 86 are camera framing references, not dialogue.",
      "motion": "still",
      "art": "legacy-return-to-tv/television-wall"
    }
  ]
} as const satisfies NarrativeScene;
