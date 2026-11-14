import { getScene, type SceneId } from "../narrative/catalog";
export type ActivityId = "landing" | "hardware-activation" | "deployment" | "exploration-barnacle-bill" | "rock-analysis";
export type ActivityResult = { activityId: ActivityId; outcome: "completed" | "skipped" };
export type Checkpoint = { stepId: string; shotId: string | null };
export type StoryStep =
 | { kind: "narrative"; id: string; sceneId: SceneId }
 | { kind: "activity"; id: string; activityId: ActivityId; title: string; sourcePage: number };

export const story = [
  { kind: "narrative", id: "prologue-archive", sceneId: "prologue-archive" },
  { kind: "narrative", id: "prologue-identification", sceneId: "prologue-identification" },
  { kind: "narrative", id: "ch01-arrival", sceneId: "ch01-arrival" },
  { kind: "narrative", id: "ch01-atmospheric-entry", sceneId: "ch01-atmospheric-entry" },
  { kind: "activity", id: "landing", activityId: "landing", title: "Landing on Mars", sourcePage: 8 },
  { kind: "narrative", id: "ch01-lander-unfolding", sceneId: "ch01-lander-unfolding" },
  { kind: "activity", id: "hardware-activation", activityId: "hardware-activation", title: "System activation", sourcePage: 10 },
  { kind: "activity", id: "deployment", activityId: "deployment", title: "First steps onto Mars", sourcePage: 11 },
  { kind: "narrative", id: "ch01-first-look", sceneId: "ch01-first-look" },
  { kind: "narrative", id: "ch01-pathfinder-friendship", sceneId: "ch01-pathfinder-friendship" },
  { kind: "narrative", id: "ch02-baby-steps", sceneId: "ch02-baby-steps" },
  { kind: "narrative", id: "ch02-earth-flashback", sceneId: "ch02-earth-flashback" },
  { kind: "narrative", id: "ch02-mission-introduction", sceneId: "ch02-mission-introduction" },
  { kind: "activity", id: "exploration-barnacle-bill", activityId: "exploration-barnacle-bill", title: "Exploring the Rock Garden", sourcePage: 32 },
  { kind: "activity", id: "rock-analysis", activityId: "rock-analysis", title: "Studying Barnacle Bill", sourcePage: 34 },
  { kind: "narrative", id: "ch02-celebration", sceneId: "ch02-celebration" },
  { kind: "narrative", id: "ch02-mission-briefing", sceneId: "ch02-mission-briefing" },
] as const satisfies readonly StoryStep[];

export function getStep(id: string): StoryStep { return story.find((step) => step.id === id) ?? story[0]; }
export function firstShot(step: StoryStep): Checkpoint {
 return { stepId: step.id, shotId: step.kind === "narrative" ? getScene(step.sceneId).shots[0].id : null };
}
export function resolveCheckpoint(saved: Checkpoint | null): Checkpoint {
 // Retired pre-landing reveal resumes at landing, before the arrival shots.
 if (saved?.stepId === "ch01-window-transition") return { stepId: "landing", shotId: null };
 const step = saved && story.find((step) => step.id === saved.stepId);
 if (!step) return firstShot(story[0]);
 if (step.kind === "activity") return firstShot(step);
 const scene = getScene(step.sceneId);
 return { stepId: step.id, shotId: scene.shots.find((shot) => shot.id === saved?.shotId)?.id ?? scene.shots[0].id };
}
export function nextCheckpoint(position: Checkpoint): Checkpoint {
 const step = getStep(position.stepId);
 if (step.kind === "narrative") {
  const shots = getScene(step.sceneId).shots;
  const index = shots.findIndex((shot) => shot.id === position.shotId);
  if (shots[index + 1]) return { stepId: step.id, shotId: shots[index + 1].id };
 }
 const index = story.findIndex((entry) => entry.id === step.id);
 return firstShot(story[Math.min(index + 1, story.length - 1)]);
}
export function previousCheckpoint(position: Checkpoint): Checkpoint {
 const step = getStep(position.stepId);
 if (step.kind === "narrative") {
  const shots = getScene(step.sceneId).shots;
  const index = shots.findIndex((shot) => shot.id === position.shotId);
  if (index > 0) return { stepId: step.id, shotId: shots[index - 1].id };
 }
 const index = story.findIndex((entry) => entry.id === step.id);
 const previous = story[Math.max(0, index - 1)];
 if (previous.kind === "activity") return firstShot(previous);
 const shots = getScene(previous.sceneId).shots;
 return { stepId: previous.id, shotId: shots[shots.length - 1].id };
}
export function isFinalShot(position: Checkpoint) {
 const step = getStep(position.stepId);
 if (step.id !== story[story.length - 1].id || step.kind !== "narrative") return false;
 const shots = getScene(step.sceneId).shots;
 return position.shotId === shots[shots.length - 1].id;
}

// Historical v0 saves used six array positions. Keep their meaning after inserts.
export const legacyCheckpoints: readonly Checkpoint[] = [
 { stepId: "prologue-archive", shotId: "report" },
 { stepId: "prologue-identification", shotId: "identification" },
 { stepId: "ch01-arrival", shotId: "chapter-card" },
 { stepId: "ch01-atmospheric-entry", shotId: "heat-shield" },
 { stepId: "ch01-atmospheric-entry", shotId: "cabin" },
 { stepId: "ch01-atmospheric-entry", shotId: "eyes-closeup" },
];
