import { licensedMusic as music } from "./music-library";

type Cue = { src: string | null; gain: number };
// Trial full mixes, from their original beginnings. No unreviewed excerpt/loop edits.
// Keep the synthetic score-v2 assets for rollback, but do not use them as fallbacks.
export const score = {
 title: { src: music.companion.src, gain: .65 },
 archive: { src: music.archive.src, gain: .5 },
 descent: { src: music.discovery.src, gain: .6 },
 wonder: { src: music.wonder.src, gain: .7 },
 companion: { src: music.companion.src, gain: .65 },
 memory: { src: music.memory.src, gain: .7 },
 exploration: { src: music.exploration.src, gain: .5 },
 analysis: { src: music.exploration.src, gain: .27 },
 celebration: { src: music.exploration.src, gain: .7 },
 briefing: { src: music.exploration.src, gain: .2 },
 quiet: { src: null, gain: 0 },
} as const satisfies Record<string, Cue>;
export type ScoreCue = keyof typeof score;
export function sceneScore(step: string, shot: string | null, title: boolean): ScoreCue {
 if (title) return "title";
 if (step.startsWith("prologue")) return "archive";
 if (step === "ch01-atmospheric-entry") return shot === "heat-shield" ? "quiet" : "descent";
 if (step === "landing" || step === "hardware-activation") return "quiet";
 if (step === "ch01-arrival") return "descent";
 if (step === "ch01-pathfinder-friendship" || step === "ch02-baby-steps") return "companion";
 if (step === "ch02-earth-flashback") return shot === "blink" ? "companion" : "memory";
 if (step === "ch02-celebration") return "celebration";
 if (step === "ch02-mission-briefing") return "briefing";
 if (step === "rock-analysis") return "analysis";
 if (step === "exploration-barnacle-bill" || step === "ch02-mission-introduction") return "exploration";
 if (["ch01-lander-unfolding", "deployment", "ch01-first-look"].includes(step)) return "wonder";
 // New draft beats wait for contextual music approval; do not carry a cheerful cue into grief.
 return "quiet";
}
