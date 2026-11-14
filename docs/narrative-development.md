> Current source of truth: NASA Hackathon Visual (3)_compressed.pdf, 53 pages. Scene source-page references and workspace thumbnails use this version. Older artwork is temporary and will be replaced scene by scene.

# Narrative scenes and artwork

## Current scope

Chapters 1–2 of the latest 55-page storyboard are staged as individually addressable scenes and shots. Shot order and supplied dialogue are preserved. Visual-only beats are silent, and uncertain/missing lines remain empty. Pages 19–20 are a celebration followed by a silent briefing until its script is supplied.

This pass does not generate or approve art. Existing images are unapproved fallbacks; new slots show a neutral temporary backdrop.

## Finding a scene

With `bun dev` running, open `/dev/scenes`. This workspace is development-only and returns 404 in production.

The left pane shows:

- A jump list organized by PDF page and scene name.
- The current scene ID and shot ID.
- Source-page thumbnails with links to enlarge them.
- Shot order and current dialogue, including silent/missing lines.
- Artwork slot, expected filename, and a local-image preview picker.

Changing scenes here does not overwrite story progress. The workspace's image picker stays local to the tab; it does not upload or persist a file.

Page numbers are the PDF viewer's 1-based numbers. Page 7 is the source face-through-window concept, now retired from the playable sequence following the arrival revision. Page 9 is the landed capsule/airbags followed by Pathfinder unfolding from overhead.

## Source layout

```text
src/game/
  Game.tsx                         shared game shell
  game.css                         shell/menu/archive styling
  audio/                           music, SFX, free narration
  state/game-store.ts              preferences and saved checkpoints
  flow/
    story.ts                       one ordered scene/mechanic sequence
    machine.ts                     XState navigation
    ActivityGate.tsx               mechanic handoff and preview fallback
  ui/                              title, music toggle, panels, dust
  narrative/
    catalog.ts                     scene registry
    types.ts                       shot and scene definitions
    art/manifest.json              replaceable artwork slots
    player/                        shared staging, dialogue, motion, artwork
    scenes/<scene-id>/script.ts     local scene metadata and ordered shots
    workspace/                     developer scene browser
```

Each scene owns its source pages, script, shot order, artwork IDs, framing, camera motion, captions and any open content questions. Shared presentation stays in the player. A scene does not require a custom React file unless it needs staging beyond the shared player.

## Plugging in artwork

1. Look up the shot in the workspace or `src/game/narrative/art/manifest.json`.
2. Copy your image to `public` plus the slot's `expectedPath`.
3. Run `bun run art:sync` and refresh the scene.

For example:

```text
public/art/scenes/ch01-atmospheric-entry/heat-shield.webp
```

`.png`, `.jpg`, or `.jpeg` with the same stem also work with the sync script. The script updates the manifest's `src`; it never changes the `approved` flag. For another filename, edit `src` in the JSON directly. Set `objectPosition` and `fit` to adjust framing without touching React.

`src: null` uses the existing `fallbackSrc`, if any. If neither is available, or an image fails to load, a neutral backdrop keeps the scene navigable. Replacing art does not change dialogue or checkpoints.

## Adding a scene

1. Add `scenes/<stable-id>/script.ts` exporting `scene` with `as const satisfies NarrativeScene`.
2. Add any artwork slots to `art/manifest.json`.
3. Register the scene in `catalog.ts`.
4. Insert its ID in `flow/story.ts`.

Use stable IDs rather than position numbers. Each dialogue line that needs its own click is a separate shot, which may reuse the same artwork ID. Each meaningful image/expression change should have its own slot. Do not rename released scene/shot IDs without a save migration.

## Mechanics team integration

Narrative flow includes explicit activity steps for landing, hardware activation, deployment, exploration, and rock analysis. No controls, physics, or objectives were implemented here. Rock-analysis ownership remains to be agreed.

Supply an activity module via the `activities` prop on `Game`. Its props are `onComplete` and `onExit`:

```tsx
<Game activities={{ landing: LandingGame }} />

// Inside LandingGame, after actual success:
onComplete({ activityId: "landing", outcome: "completed" });
```

The activity key and result activity ID must match. An unavailable activity shows a narrative-preview handoff with a Continue Story button. That records `skipped`, never `completed`, and advances to the next narrative scene. No gameplay success is inferred from advancing the preview.

Checkpoint changes may be observed through `onCheckpointChange`. Save data now records stable step/shot IDs, plus activity results. Persistence version 1 migrates the old six numeric scene positions to their corresponding stable checkpoints while preserving preferences.

## Content still needed

- Page 14: scientists' complete flashback script and completed historical caption (the PDF caption ends mid-sentence).
- Page 20: the actual mission command. The shot stays silent until supplied.
- Confirmation with the mechanics team for deployment/scan and interactive rock-analysis ownership.
- Final artwork for the new slots and approval of any existing fallbacks.

The source storyboard's character speech and anthropomorphism are narrative, not a scientific reconstruction. Its historical claims are not automatically research-approved.

No build, lint, or browser/visual review was run for this pass, per request.

## Historical opening transition revision

The archive television remains mounted across the opening report, identification, and rewind dialogue. Monitor pictures dissolve in place; dialogue advances without resetting the room. Ordinary navigation no longer uses full-screen black fades. The storyboard-specific rewind retains its brief CRT shutoff into darkness, and the later memory beat keeps its explicit flash transition. Reduced motion bypasses those animations.

The TV now has a stable wide frame, softer screen treatment, speaker grille, small tuning knobs, power light and a subtle aerial. The room background is separate from the monitor picture. No new artwork was generated in this revision; post-rewind character artwork was left unchanged. Build, lint and browser review were not run, per request.

## Complete pre-landing narrative replacement

Storyboard pages 6–7 initially received four illustrations; the window transition was subsequently retired:

1. `entry-exterior`: exterior-storyboard-v3.webp — capsule entering atmosphere.
2. `entry-cabin`: cabin-storyboard-v3.webp — rear three-quarter view toward small window.
3. `entry-eyes`: eyes-storyboard-v3.webp — cartoon delighted face closeup.
4. `ch01-window-transition/window-glass`: retired from runtime by the later post-landing arrival revision below.

These illustrations use the storyboard as reference and remain subject to team review. The three atmospheric-entry shots now lead directly to the landing mechanic handoff. Picture dissolves replace full-screen black between shots. Supplied dialogue and silent beats are unchanged; landing gameplay is not implemented here.

No build, lint or browser verification was run.

## Post-landing arrival revision

Current order: atmospheric entry -> landing activity -> vast Mars / closed Pathfinder -> overhead opened petals / Sojourner aboard -> hardware activation -> deployment. The former round-window reveal is absent from the playable sequence; saves at its retired checkpoint resume at the landing activity rather than skipping it.

Page 9's two silent shots now use `landed-capsule-v2.webp` and `open-petals-v2.webp`. Both were generated from the latest page 9 storyboard, with the real tetrahedral lander and three hinged petals specified. The wide establishing shot emphasizes the Martian landscape. Both preserve their full composition without automatic zoom. These are connected art candidates, not team-approved assets. No new dialogue or gameplay was added.

Build, lint and browser review were not run, per request.
