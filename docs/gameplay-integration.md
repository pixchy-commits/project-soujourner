# Gameplay / narrative integration

Narrative baseline: dev-branch at 5214df5.
Gameplay source: prototype at 427d5b3.
Integration branch: integration/gameplay-narrative.
Approved destination: master, using a squash after checks pass.

Home supplies the gameplay registry to the existing narrative player. Only
gameplay, mission components and their supporting assets were selected from
prototype. The prototype narrative shell, global stylesheet, saves, art and
audio were not imported. Dev narrative scripts and art remain authoritative.

## Connected activities

| Story activity | Game | Completion boundary |
| --- | --- | --- |
| landing | /landing module | Mission accomplished > Continue |
| exploration-barnacle-bill | Rover mission 1 | Continue after round 3 |
| rock-analysis | Barnacle Bill analysis | Successful analysis > Continue |
| wheel-test | Wheel experiment | Existing inner results > Next |
| travel-yogi-viewpoint | Rover mission 2 | Continue after round 3 |
| travel-yogi | Rover mission 3 | Continue after round 3 |
| yogi-analysis-attempt | Yogi analysis | Successful gameplay > incident narrative |
| yogi-rescue | Rescue Sojo | Mission accomplished > Continue |
| travel-yogi-other-side | Rover mission 4 | Continue after round 3 |
| yogi-final-analysis | Yogi analysis | Successful analysis > Continue |

First Yogi analysis succeeds in the game. The following narrative introduces
the unexpected tilt/stuck incident, then the failed-attempt notice and rescue.
This is intentional; the game is not changed into a failure simulation.

System activation, the separate deployment handoff and Yogi photography have
been removed as requested. Landing is played once, followed by unfolding and
first-look narrative. Old checkpoints for removed steps migrate to active steps.

Mission notices/summaries, historical reports and the repositioning cutscene
without an implemented game retain the existing clickable handoff. Available
landing, soil and rescue briefings remain at game entry. Wheel results use the
inner game only; there is no second external success popup.

## Lifecycle and scope

- Matching activity IDs gate progression; adapters submit completion once.
- Replay stays inside the current game. Return to title preserves the story
  checkpoint so Continue re-enters that activity; in-game attempts restart.
- Pause reaches native simulation timers and iframe hosts; iframe messages
  validate both origin and the specific source window.
- F2 opens the existing scene debugger from Home for boundary review.
- Minimal pre-existing lint/type fixes were authorized: existing shot metadata
  types, debugger union typing, effect/ref usage and the workspace home link.
  No dialogue, illustration, sound track or narrative layout was redesigned.

## Validation

- bun test tests/gameplay-integration.test.mjs: 5 pass, 222 assertions.
  Covers full story traversal, mismatched/duplicate completion, the Yogi incident
  and rescue boundary, retired checkpoints and all 12 rover round solutions.
- bunx tsc --noEmit: pass.
- bun run lint: pass, 0 errors and 7 non-blocking warnings.
- bun run build: pass; existing Science Gothic fallback-metrics warning.
- HTTP smoke check: Home and all nine dedicated gameplay routes return 200.
- git diff --check: pass.

Browser visual/playthrough verification remains outstanding: the browser host
was unavailable. Automated tests verify flow/rules, not an interactive playthrough
or visual approval. Use Home and F2 to review the integrated sequence.
