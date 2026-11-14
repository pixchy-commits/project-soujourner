> Current source of truth: NASA Hackathon Visual (3)_compressed.pdf, 53 pages. Scene source-page references and workspace thumbnails use this version. Older artwork is temporary and will be replaced scene by scene.

# Narrative scenes and artwork

## Barnacle Bill mission-arrival adapter — latest PDF (5), page 33

Home now supplies default narrative adapters for `exploration-barnacle-bill` and `rock-analysis`. The sequence is third-person arrival illustration -> destination marker -> exclamation notification with closer rear view -> first-person mission window -> marked-rock selection -> numbered review step -> explicit gameplay handoff. The two story activity IDs and existing following celebration are preserved. Actual gameplay modules passed through `Game.activities` override these adapters individually.

These adapters stage narrative/UI only. There is no rover-driving physics or chemical-analysis puzzle. Both adapters report `outcome: skipped` when continuing rather than pretending either activity has been completed. No chemical findings or missing spoken lines are invented. UI instructions describe clicks and target selection. Back and Return to Title are available, interaction pauses with the game, and reduced-motion settings disable the camera/popup animation. Targets are positioned against the same contained image canvas across aspect ratios.

Art is under `public/art/scenes/barnacle-arrival/`: `arrival-v1.webp` and `rocks-v1.webp`, generated sequentially from the latest page 33 composition and approved art direction. The arrival image received a wheel-count correction before registration. Art candidates remain pending review. Original dark dialogue styling is retained for instruction panels. No build, lint or browser review was run, per request.

## Latest first-person layout decision

User confirmed: keep the painted artwork, match the storyboard composition and dialogue placement. The ramp narration now uses a light cyan bottom caption without a speaker tab. The Pathfinder conversation starts with Sojourner's question at the bottom; during Pathfinder's reply, that completed question stays visible while the active reply appears in an upper-right speech bubble with a pointer. Bubblegum Sans, typing effects and supplied wording remain in use. Other scenes retain their existing dialogue style.

The binocular silhouette now has shallower center notches to match the drawing. Pathfinder was reframed smaller and centered, with a taller body and left mast, leaving the upper-right and lower foreground clear for live text. The Home runtime slot uses `ch01-pathfinder-friendship/pathfinder-v4.webp`; its generation prompts are beside it in `composition-v4-prompts.json`. The artwork remains a review candidate. No build, lint or browser review was run.

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

## First look and Pathfinder conversation

Pages 11–12 now have connected artwork: a wide rover-height Mars panorama, a delighted Sojourner camera-eye closeup, and a ground-level view back at Pathfinder. The dialogue and existing shot order are unchanged. New assets are under `public/art/scenes/ch01-first-look/` and `public/art/scenes/ch01-pathfinder-friendship/`; the first directory also records generation prompts.

Generated with the built-in image tool using the latest storyboard pages directly. The initial four-petal Pathfinder candidate was rejected; the connected `pathfinder-v2.webp` has three petals. All assets remain unapproved candidates. Full-image fit and still framing preserve the panorama and facial composition; existing picture dissolves remain in use. Hardware activation and deployment remain mechanic handoffs before these scenes. No gameplay was added.

Narrative dialogue now uses Bubblegum Sans; Thunderstrike titles remain unchanged. No build, lint or browser review was run.

## Chapter 2 narrative artwork pass

The main Home game now renders connected art for every Chapter 2 shot already in its story sequence: Baby Steps chapter card, blink, laboratory construction, introduction on Earth, mission memory, reflected-eye closeup, Sojo introduction on Mars, mission description, scientists celebrating, and the separate briefing. No route switch to the development workspace is required.

Latest storyboard page 13 gives the chapter date as July 5, 1997; the card now matches. The chapter image reuses the new opened-Pathfinder illustration. Page 14 receives five flashback illustrations, including a closed-eye blink before the existing white memory transition. Missing speech and the incomplete historical caption remain empty. Supplied dialogue is unchanged.

Page 15's mission sheet is rendered as accessible HTML beside the rover, using the seven-Sol duration and task descriptions from the existing dialogue. The celebration uses animated confetti; the following briefing uses the same control-room illustration with confetti off and no invented command. Gameplay placeholders remain available for the mechanics team.

Eight new WebP files are in the `ch02-earth-flashback`, `ch02-mission-introduction`, and `ch02-celebration` art directories. Generation prompts, direct source pages, correction notes and deliberate art reuse are recorded in `public/art/scenes/ch02-earth-flashback/generation-prompts.json`. All candidates remain unapproved for team review. This pass does not finish missing scripts, historical research/popups, gameplay or final visual acceptance.

No build, lint or browser review was run, per request.

## Three-reference correction after team feedback

The latest review narrows work to the three supplied reference scenes, in story order: landed capsule and overhead opening (page 9), Sojo's ramp POV (page 11), and the trusting Pathfinder conversation (page 12). Four replacement illustrations were generated sequentially, with one prompt and inspection per shot. No Chapter 2 art was generated during this correction.

The closed capsule is now centered at the drawing's closer scale. The overhead shot uses three opened metal petals and Sojo stowed on the upper petal, with six visible wheels; equipment on the central base is distinct from the rover. The page 11 view explicitly looks down the ramp rather than across a foreground solar deck. The page 12 conversation places Pathfinder's expressive eyes on the equipment body with the mast behind its left side, following the drawing rather than the previous generic mast-eyed rendering.

`RoverViewfinder` supplies a shared binocular silhouette for the two first-person scenes and scan marks on the ramp view. It is separate from the bitmap. The overhead shot has an accessible Select Sojo hotspot that advances through the existing handoff sequence; Continue remains available. This correction does not implement landing physics, rover driving or a 360-degree scan.

All four replacements are registered in the shared runtime manifest and play from Home. Old candidates remain on disk but are no longer referenced by these four slots. Existing dialogue and story order remain unchanged. Prompts are recorded at `public/art/scenes/ch01-lander-unfolding/reference-revision-prompts.json`. These are unapproved review candidates; no claim of final design acceptance is made. No build, lint or browser review was run.
