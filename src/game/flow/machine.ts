import { assign, setup } from "xstate";
import { firstShot, getStep, isFinalShot, nextCheckpoint, previousCheckpoint, resolveCheckpoint, story, type Checkpoint, type ActivityId } from "./story";

type FlowEvent =
 | { type: "START" | "NEXT" | "BACK" | "HOME" }
 | { type: "RESUME"; checkpoint: Checkpoint | null }
 | { type: "ACTIVITY_COMPLETE"; activityId: ActivityId };

export const gameFlow = setup({
 types: { context: {} as Checkpoint, events: {} as FlowEvent },
 actions: {
  reset: assign(() => firstShot(story[0])),
  resume: assign(({ event }) => resolveCheckpoint(event.type === "RESUME" ? event.checkpoint : null)),
  next: assign(({ context }) => nextCheckpoint(context)),
  back: assign(({ context }) => previousCheckpoint(context)),
 },
 guards: {
  finalShot: ({ context }) => isFinalShot(context),
  narrative: ({ context }) => getStep(context.stepId).kind === "narrative",
  matchingActivity: ({ context, event }) => {
   const step = getStep(context.stepId);
   return step.kind === "activity" && event.type === "ACTIVITY_COMPLETE" && step.activityId === event.activityId;
  },
 },
}).createMachine({
 id: "game-flow", initial: "title", context: firstShot(story[0]),
 on: { HOME: ".title" },
 states: {
  title: { on: { START: { target: "playing", actions: "reset" }, RESUME: { target: "playing", actions: "resume" } } },
  playing: { on: {
   NEXT: [{ guard: "finalShot", target: "complete" }, { guard: "narrative", actions: "next" }],
   BACK: { actions: "back" },
   ACTIVITY_COMPLETE: { guard: "matchingActivity", actions: "next" },
  } },
  complete: { on: { START: { target: "playing", actions: "reset" }, RESUME: { target: "playing", actions: "resume" } } },
 },
});
