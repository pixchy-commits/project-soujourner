import { scene as scene0 } from "./ch03-exploring-new-world/script";
import { scene as scene1 } from "./ch03-viewpoint-rest/script";
import { scene as scene2 } from "./ch03-yogi-panorama/script";
import { scene as scene3 } from "./ch03-yogi-reassurance/script";
import { scene as scene4 } from "./ch03-yogi-observation/script";
import { scene as scene5 } from "./ch03-yogi-tilt/script";
import { scene as scene6 } from "./ch03-yogi-reflection/script";
import { scene as scene7 } from "./ch03-ready-to-scan/script";
import { scene as scene8 } from "./ch03-analysis-celebration/script";
import { scene as scene9 } from "./ch04-beyond-expectations/script";
import { scene as scene10 } from "./ch04-more-memories/script";
import { scene as scene11 } from "./ch04-time-passing/script";
import { scene as scene12 } from "./ch04-last-signal/script";
import { scene as scene13 } from "./ch04-shared-memories/script";
import { scene as scene14 } from "./ch04-earth-dot/script";
import { scene as scene15 } from "./ch04-resting-together/script";
import { scene as scene16 } from "./legacy-title/script";
import { scene as scene17 } from "./legacy-return-to-tv/script";
import { scene as scene18 } from "./legacy-rover-evolution/script";
import { scene as scene19 } from "./legacy-museum/script";
import type { NarrativeScene } from "../types";

export const futureScenes = {
 "ch03-exploring-new-world": scene0,
 "ch03-viewpoint-rest": scene1,
 "ch03-yogi-panorama": scene2,
 "ch03-yogi-reassurance": scene3,
 "ch03-yogi-observation": scene4,
 "ch03-yogi-tilt": scene5,
 "ch03-yogi-reflection": scene6,
 "ch03-ready-to-scan": scene7,
 "ch03-analysis-celebration": scene8,
 "ch04-beyond-expectations": scene9,
 "ch04-more-memories": scene10,
 "ch04-time-passing": scene11,
 "ch04-last-signal": scene12,
 "ch04-shared-memories": scene13,
 "ch04-earth-dot": scene14,
 "ch04-resting-together": scene15,
 "legacy-title": scene16,
 "legacy-return-to-tv": scene17,
 "legacy-rover-evolution": scene18,
 "legacy-museum": scene19,
} as const satisfies Record<string, NarrativeScene>;
