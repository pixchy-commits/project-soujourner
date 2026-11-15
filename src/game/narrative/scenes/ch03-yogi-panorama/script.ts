import type { NarrativeScene } from "../../types";

export const scene = {
  "id": "ch03-yogi-panorama",
  "title": "The way to Yogi",
  "chapter": 3,
  "sourcePages": [
    49
  ],
  "sourceEdition": "v7",
  "status": "needs-script",
  "shots": [
    {
      "id": "panorama",
      "kind": "illustration",
      "notes": "PDF v7 page 49: first-person view of the difficult terrain surrounding Yogi. Use supplied terrain artwork and separate goggles. Terrain explanation callouts have no approved wording yet; leave spoken text empty.",
      "motion": "still",
      "framing": "first-person",
      "art": "ch03-yogi-panorama/panorama",
      "overlay": "ui/goggle-frame",
      "overlayScale": 1.16,
      "terrainNotes": [
        { "id": "rocks", "title": "Rocky approach", "text": "Scattered rocks leave little room to pass.", "x": 25, "y": 28, "targetX": 24, "targetY": 61 },
        { "id": "ledge", "title": "Uneven ground", "text": "A rocky ledge breaks up the route to Yogi.", "x": 72, "y": 58, "targetX": 79, "targetY": 78 }
      ]
    }
  ]
} as const satisfies NarrativeScene;
