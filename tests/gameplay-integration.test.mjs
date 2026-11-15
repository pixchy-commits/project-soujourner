import { describe, expect, test } from "bun:test";
import { createActor } from "xstate";
import { gameFlow } from "../src/game/flow/machine";
import { firstShot, getStep, resolveCheckpoint, story } from "../src/game/flow/story";
import { LEVELS, levelProblems } from "../src/lib/rover/levels";
import { atGoal, blocked, solve, step } from "../src/lib/rover/solver";

describe("narrative / gameplay integration", () => {
  test("the complete story is traversable using matching mission completions", () => {
    const actor = createActor(gameFlow).start();
    actor.send({ type: "START" });
    const visits = new Set();
    for (let count = 0; count < 500 && !actor.getSnapshot().matches("complete"); count++) {
      const current = getStep(actor.getSnapshot().context.stepId);
      visits.add(current.id);
      actor.send(current.kind === "activity"
        ? { type: "ACTIVITY_COMPLETE", activityId: current.activityId }
        : { type: "NEXT" });
    }
    expect(actor.getSnapshot().matches("complete")).toBe(true);
    expect([...visits]).toEqual(story.map(entry => entry.id));
    expect(story.filter(entry => entry.id === "landing")).toHaveLength(1);
    for (const removed of ["hardware-activation", "deployment", "photograph-yogi-notice", "photograph-yogi"]) {
      expect(visits.has(removed)).toBe(false);
    }
    actor.stop();
  });

  test("a wrong or duplicate completion cannot skip narrative", () => {
    const actor = createActor(gameFlow).start();
    actor.send({ type: "JUMP", checkpoint: { stepId: "landing", shotId: null } });
    actor.send({ type: "NEXT" });
    actor.send({ type: "ACTIVITY_COMPLETE", activityId: "wheel-test" });
    expect(actor.getSnapshot().context.stepId).toBe("landing");
    actor.send({ type: "ACTIVITY_COMPLETE", activityId: "landing" });
    expect(actor.getSnapshot().context.stepId).toBe("ch01-lander-unfolding");
    const afterLanding = actor.getSnapshot().context;
    actor.send({ type: "ACTIVITY_COMPLETE", activityId: "landing" });
    expect(actor.getSnapshot().context).toEqual(afterLanding);
    actor.stop();
  });

  test("first Yogi gameplay success leads through the incident to Rescue", () => {
    const actor = createActor(gameFlow).start();
    actor.send({ type: "JUMP", checkpoint: { stepId: "yogi-analysis-attempt", shotId: null } });
    actor.send({ type: "ACTIVITY_COMPLETE", activityId: "yogi-analysis-attempt" });
    expect(actor.getSnapshot().context.stepId).toBe("ch03-yogi-tilt");
    for (let n = 0; n < 30 && actor.getSnapshot().context.stepId === "ch03-yogi-tilt"; n++) actor.send({ type: "NEXT" });
    expect(actor.getSnapshot().context.stepId).toBe("yogi-failed");
    actor.send({ type: "ACTIVITY_COMPLETE", activityId: "yogi-failed" });
    expect(actor.getSnapshot().context.stepId).toBe("yogi-rescue");
    actor.send({ type: "ACTIVITY_COMPLETE", activityId: "yogi-rescue" });
    expect(actor.getSnapshot().context.stepId).toBe("ch03-yogi-reflection");
    actor.stop();
  });

  test("retired saves resume at an active handoff; every active checkpoint resolves", () => {
    for (const stepId of ["hardware-activation", "deployment"]) expect(resolveCheckpoint({ stepId, shotId: null }).stepId).toBe("landing");
    for (const stepId of ["photograph-yogi-notice", "photograph-yogi"]) expect(resolveCheckpoint({ stepId, shotId: null }).stepId).toBe("approach-yogi-notice");
    for (const entry of story) expect(resolveCheckpoint(firstShot(entry))).toEqual(firstShot(entry));
  });

  test("all four driving missions retain three solvable rounds within their command budget", () => {
    expect(levelProblems).toEqual([]);
    for (const sol of [1, 2, 3, 4]) {
      const rounds = LEVELS.filter(level => level.sol === sol);
      expect(rounds).toHaveLength(3);
      for (const level of rounds) {
        const commands = solve(level, level.start);
        expect(commands).not.toBeNull();
        expect(commands.length).toBeLessThanOrEqual(level.maxBlocks);
        let pose = level.start;
        for (const command of commands) {
          pose = step(pose, command);
          expect(blocked(level, pose.r, pose.c)).toBe(false);
        }
        expect(atGoal(level, pose)).toBe(true);
      }
    }
  });
});
