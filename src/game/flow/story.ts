// PDF references: v7 (95 pages). Gameplay modules remain team handoffs.
import { getScene, type SceneId } from "../narrative/catalog";
export type ActivityId = "landing" | "hardware-activation" | "deployment" | "exploration-barnacle-bill" | "rock-analysis" | "opening-history" | "wheel-test" | "wheel-summary" | "observe-yogi-notice" | "travel-yogi-viewpoint" | "viewpoint-summary" | "photograph-yogi-notice" | "photograph-yogi" | "approach-yogi-notice" | "travel-yogi" | "yogi-analysis-attempt" | "yogi-failed" | "yogi-rescue" | "yogi-replan" | "travel-yogi-other-side" | "yogi-final-analysis" | "primary-mission-history" | "extended-mission-history" | "legacy-findings";
export type ActivityResult = { activityId: ActivityId; outcome: "completed" | "skipped" };
export type Checkpoint = { stepId: string; shotId: string | null };
export type StoryStep =
 | { kind: "narrative"; id: string; sceneId: SceneId }
 | { kind: "activity"; id: string; activityId: ActivityId; title: string; sourcePage: number; category?: "gameplay" | "mission" | "historical"; description?: string; references?: readonly number[] };

export const story = [
  { kind: "narrative", id: "prologue-archive", sceneId: "prologue-archive" },
  { kind: "narrative", id: "prologue-identification", sceneId: "prologue-identification" },
  {"kind":"activity","id":"opening-history","activityId":"opening-history","title":"The Pathfinder mission: historical report","sourcePage":22,"category":"historical","description":"Historical pop-up team handoff for the opening report. Original mission photographs and research will be supplied through the report system.","references":[79,80]},
  { kind: "narrative", id: "ch01-arrival", sceneId: "ch01-arrival" },
  { kind: "narrative", id: "ch01-atmospheric-entry", sceneId: "ch01-atmospheric-entry" },
  { kind: "activity", id: "landing", activityId: "landing", title: "Landing on Mars", sourcePage: 27 },
  { kind: "narrative", id: "ch01-lander-unfolding", sceneId: "ch01-lander-unfolding" },
  { kind: "narrative", id: "ch01-first-look", sceneId: "ch01-first-look" },
  { kind: "narrative", id: "ch02-earth-flashback", sceneId: "ch02-earth-flashback" },
  { kind: "narrative", id: "ch01-pathfinder-friendship", sceneId: "ch01-pathfinder-friendship" },
  { kind: "narrative", id: "ch02-baby-steps", sceneId: "ch02-baby-steps" },
  { kind: "narrative", id: "ch02-mission-introduction", sceneId: "ch02-mission-introduction" },
  { kind: "activity", id: "exploration-barnacle-bill", activityId: "exploration-barnacle-bill", title: "Exploring the Rock Garden", sourcePage: 36 },
  { kind: "activity", id: "rock-analysis", activityId: "rock-analysis", title: "Studying Barnacle Bill", sourcePage: 38 },
  { kind: "narrative", id: "ch02-celebration", sceneId: "ch02-celebration" },
  { kind: "narrative", id: "ch02-mission-briefing", sceneId: "ch02-mission-briefing" },
  {"kind":"narrative","id":"ch03-exploring-new-world","sceneId":"ch03-exploring-new-world"},
  {"kind":"activity","id":"wheel-test","activityId":"wheel-test","title":"Barnacle Bill: wheel tests","sourcePage":42,"category":"gameplay","description":"Gameplay team handoff: wheel abrasion W-1 and wheelie T-1. Continue previews the following narrative; it does not complete the experiment.","references":[]},
  {"kind":"activity","id":"wheel-summary","activityId":"wheel-summary","title":"Wheel-test mission summary","sourcePage":43,"category":"mission","description":"Mission UI team handoff: show the wheel-test result, then lead into the next mission. Final result text is pending.","references":[47]},
  {"kind":"activity","id":"observe-yogi-notice","activityId":"observe-yogi-notice","title":"Observe Yogi: mission notice","sourcePage":44,"category":"mission","description":"Scientists send a mission through Pathfinder. First-person notice asks Sojo to travel to the Yogi observation point. Notification and mission-window UI are owned by the other team.","references":[48,51]},
  {"kind":"activity","id":"travel-yogi-viewpoint","activityId":"travel-yogi-viewpoint","title":"Travel to the Yogi observation point","sourcePage":45,"category":"gameplay","description":"Gameplay team handoff: travel from Barnacle Bill to the Yogi viewpoint.","references":[]},
  {"kind":"activity","id":"viewpoint-summary","activityId":"viewpoint-summary","title":"Viewpoint mission summary","sourcePage":46,"category":"mission","description":"Mission UI team handoff: summarize the completed journey. The following narrative beat is Sojo closing its eyes.","references":[47]},
  {"kind":"narrative","id":"ch03-viewpoint-rest","sceneId":"ch03-viewpoint-rest"},
  {"kind":"narrative","id":"ch03-yogi-panorama","sceneId":"ch03-yogi-panorama"},
  {"kind":"activity","id":"approach-yogi-notice","activityId":"approach-yogi-notice","title":"Approach Yogi: next mission","sourcePage":53,"category":"mission","description":"After Sojo wakes, Pathfinder relays the next mission: go directly to Yogi. Keep the task window as a handoff; do not invent its final wording.","references":[51,52]},
  {"kind":"narrative","id":"ch03-yogi-reassurance","sceneId":"ch03-yogi-reassurance"},
  {"kind":"activity","id":"travel-yogi","activityId":"travel-yogi","title":"Travel from the viewpoint to Yogi","sourcePage":55,"category":"gameplay","description":"Gameplay team handoff: Sojo navigates from the observation point toward Yogi.","references":[]},
  {"kind":"narrative","id":"ch03-yogi-observation","sceneId":"ch03-yogi-observation"},
  {"kind":"activity","id":"yogi-analysis-attempt","activityId":"yogi-analysis-attempt","title":"Yogi: approach and position the sensor","sourcePage":57,"category":"gameplay","description":"Gameplay team handoff: approach Yogi and position the rover for chemical analysis. Positioning and rotation mechanics belong to the gameplay team.","references":[]},
  {"kind":"narrative","id":"ch03-yogi-tilt","sceneId":"ch03-yogi-tilt"},
  {"kind":"activity","id":"yogi-failed","activityId":"yogi-failed","title":"Yogi analysis: failed-attempt notice","sourcePage":59,"category":"mission","description":"Mission UI team handoff: explain that this positioning attempt failed. Use the final approved explanation when supplied; the PDF UI body is placeholder text.","references":[]},
  {"kind":"activity","id":"yogi-rescue","activityId":"yogi-rescue","title":"Help Sojo recover","sourcePage":60,"category":"gameplay","description":"Gameplay team handoff: recovery sequence with assistance from the scientists. Continue does not report a successful rescue result.","references":[]},
  {"kind":"narrative","id":"ch03-yogi-reflection","sceneId":"ch03-yogi-reflection"},
  {"kind":"activity","id":"yogi-replan","activityId":"yogi-replan","title":"Reposition after the failed attempt","sourcePage":62,"category":"gameplay","description":"Interactive-cutscene team handoff: Sojo moves down from the rock and re-evaluates the route.","references":[]},
  {"kind":"activity","id":"travel-yogi-other-side","activityId":"travel-yogi-other-side","title":"Move to the other side of Yogi","sourcePage":63,"category":"gameplay","description":"Gameplay team handoff: navigate from the rescued position to another approach.","references":[]},
  {"kind":"narrative","id":"ch03-ready-to-scan","sceneId":"ch03-ready-to-scan"},
  {"kind":"activity","id":"yogi-final-analysis","activityId":"yogi-final-analysis","title":"Yogi: collect the analysis data","sourcePage":66,"category":"gameplay","description":"Interactive analysis team handoff: nervous scan followed by data collection. No real analysis is performed by this preview.","references":[]},
  {"kind":"activity","id":"primary-mission-history","activityId":"primary-mission-history","title":"The planned seven-sol mission","sourcePage":67,"category":"historical","description":"Historical pop-up team handoff: present the approved seven-sol research as a folder/report. Research pages are references, not separate spoken scenes.","references":[68,69,70]},
  {"kind":"narrative","id":"ch03-analysis-celebration","sceneId":"ch03-analysis-celebration"},
  {"kind":"narrative","id":"ch04-beyond-expectations","sceneId":"ch04-beyond-expectations"},
  {"kind":"narrative","id":"ch04-more-memories","sceneId":"ch04-more-memories"},
  {"kind":"narrative","id":"ch04-time-passing","sceneId":"ch04-time-passing"},
  {"kind":"narrative","id":"ch04-last-signal","sceneId":"ch04-last-signal"},
  {"kind":"narrative","id":"ch04-shared-memories","sceneId":"ch04-shared-memories"},
  {"kind":"narrative","id":"ch04-earth-dot","sceneId":"ch04-earth-dot"},
  {"kind":"narrative","id":"ch04-resting-together","sceneId":"ch04-resting-together"},
  {"kind":"activity","id":"extended-mission-history","activityId":"extended-mission-history","title":"Beyond the planned mission","sourcePage":85,"category":"historical","description":"Historical pop-up team handoff: extended-mission timeline, communications and battery background. Verify research before publishing; this preview does not present draft claims as fact.","references":[86,87]},
  {"kind":"narrative","id":"legacy-title","sceneId":"legacy-title"},
  {"kind":"narrative","id":"legacy-return-to-tv","sceneId":"legacy-return-to-tv"},
  {"kind":"narrative","id":"legacy-rover-evolution","sceneId":"legacy-rover-evolution"},
  {"kind":"narrative","id":"legacy-museum","sceneId":"legacy-museum"},
] as const satisfies readonly StoryStep[];

export function getStep(id: string): StoryStep { return story.find((step) => step.id === id) ?? story[0]; }
export function firstShot(step: StoryStep): Checkpoint {
 return { stepId: step.id, shotId: step.kind === "narrative" ? getScene(step.sceneId).shots[0].id : null };
}
export function resolveCheckpoint(saved: Checkpoint | null): Checkpoint {
 if (saved?.stepId === "legacy-findings") return firstShot(getStep("legacy-museum"));
 if (saved?.stepId === "ch01-first-look" && saved.shotId === "camera-eyes") return { stepId: "ch01-pathfinder-friendship", shotId: "sojo-question" };
 // Retired pre-landing reveal resumes at landing, before the arrival shots.
 if (saved?.stepId === "ch01-window-transition") return { stepId: "landing", shotId: null };
 if (saved?.stepId === "hardware-activation" || saved?.stepId === "deployment") return { stepId: "landing", shotId: null };
 if (saved?.stepId === "photograph-yogi-notice" || saved?.stepId === "photograph-yogi") return { stepId: "approach-yogi-notice", shotId: null };
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
