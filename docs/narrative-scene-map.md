# Narrative production map

Source: `C:/Users/USER/Downloads/NASA Hackathon Visual (2)_compressed.pdf` (55 PDF pages).
Page numbers below are the PDF viewer's 1-based page numbers. They are not scene IDs.

This is a source/code review, not a browser or visual acceptance review. No build or lint was run. No production code was changed during this review.

## Scope and readiness

The narrative team owns story scripts, generated illustrations, shot staging, dialogue, music/SFX cues, and cinematic transitions. The mechanic team owns playable movement, landing controls, physics, challenges, and mission objectives. Ownership of simple interactive cutscenes still needs agreement.

The user defines green outer outlines as ready for development. Twelve content pages have these outlines: **7, 8, 10, 12, 13, 15, 16, 20, 21, 41, 44, 45**. The green sample inside the legend on page 3 is not a ready scene. Green text or labels inside other pages do not count as green outlines.

Readiness of a storyboard does not imply that all dialogue, factual text, or mechanic integration details are present. Preserve existing supplied dialogue and flag gaps rather than inventing approval.

## What changed in this version

The previous supplied PDF had 33 pages; this version has 55. Important changes are:

- A character-design reference on page 1, including Sojourner's expressive front camera eyes.
- A visual key and production notes on pages 3–4, explicitly distinguishing narrative, historical, gameplay, and uncertain interactive cutscenes.
- More explicit transitions between atmospheric entry, landing, capsule opening, hardware activation, and deployment.
- A friendship conversation with Pathfinder, a construction/mission flashback, and a Sojourner mission introduction.
- A longer mission sequence around Barnacle Bill and Yogi, interleaving exploration and rock-analysis mechanics with narrative reactions, encouragement, difficulty, rescue, and retry.
- A more developed extended-mission/ending arc: time passing, Pathfinder's decline, memories, Earth in the distance, and Sojourner resting beside Pathfinder.
- A multi-monitor legacy sequence, rover evolution, credits, and an exhibit epilogue.
- Explicit unresolved items: historical presentation format, missing research, some chapter titles, and the timing of Pathfinder's decline.

## Current implementation versus the latest PDF

Current implementation is in `src/components/game.tsx` and `src/lib/narrative.ts`.

| Latest PDF page | Existing code | Assessment |
| --- | --- | --- |
| 1 | Generated Sojourner artwork | Character design has not been matched/approved against the new sheet. |
| 2 | Title screen | Implemented as a centered menu with painted buttons and music toggle; visual approval still pending. |
| 5 | `signal`, `arrival` | Prototype archive monitor, montage, identification, and rewind text exist. Still uses a mixture of supplied archival imagery and generated art. Page is marked as needing historical information. |
| 6 | `firstSteps` | Chapter 1 arrival card exists. State name is misleading: it is a chapter card, not first steps. |
| 7 | `entry`, `window`, `wonder` | Partial implementation. Entry and cabin images exist; final beat reuses/reframes the cabin artwork. Full shot-by-shot fidelity, character consistency, and a dedicated expression closeup are pending. |
| 8 | End of current pre-landing sequence | No dedicated face-at-window transition matching this storyboard. |
| 10 onward | None | No post-landing narrative scenes or gameplay handoffs implemented. |

Shared prototype features already exist: click-to-reveal/advance dialogue, typewriter SFX, character beeps, menu clicks, optional browser TTS, settings, reports, local progress saves, and fades through black. These are implementation facts, not acceptance results.

## Ready narrative backlog

A PDF page can contain several shots. A scene should group one coherent story moment; dialogue lines and camera cuts are beats within it.

| PDF page | Proposed stable scene ID | Story/staging | Current status | Dependency |
| --- | --- | --- | --- | --- |
| 7 | `ch01-atmospheric-entry` | Heat-shield exterior, Sojourner at window, expression closeup | Partial | Approved character design and individual shot art |
| 8 | `ch01-window-transition` | Sojourner's face seen at/through the glass | Missing | Handoff to landing mechanic on page 9 |
| 10 | `ch01-lander-unfolding` | Landed capsule, deflated airbags, overhead opening/reveal | Missing | Landing result from mechanic team; hardware activation follows on page 11 |
| 12 | `ch01-first-look` | First-person view of Mars, environment reveal, emotional reaction | Missing | Split narrative reveal from ramp movement/scan controls with mechanic team |
| 13 | `ch01-pathfinder-friendship` | Sojourner asks whether Earth can see; Pathfinder reassures it | Missing | Deployment/first-look completion |
| 15 | `ch02-earth-flashback` | Blink/white flash, scientists constructing Sojourner, mission memory, return | Missing | Exact placement relative to chapter card on page 14; finalize missing lines |
| 16 | `ch02-mission-introduction` | Sojourner introduces itself and its mission; mission description appears | Missing | Exact objectives/rules from mechanic team; exploration follows on page 17 |
| 20 | `ch02-baby-steps-celebration` | Scientists congratulate Sojourner with confetti | Missing | Resolve overlap with page 21 and exact prerequisite |
| 21 | `ch02-next-mission-briefing` | Scientists issue the next mission/chapter transition | Missing | Clarify separate scene versus alternative version of page 20 |
| 41 | `ch04-time-passing` | Wheel wear, timestamps advancing, fade to black | Missing | Earlier extension scene on page 40 and exact time progression |
| 44 | `ch04-earth-in-the-distance` | Look toward Earth; reflection in Sojourner's eyes | Missing | Earlier decline/memory scenes on pages 42–43 are not green |
| 45 | `ch04-rest-beside-pathfinder` | Sojourner approaches/leads into resting beside Pathfinder; fade | Missing | Page 44 and approved ending script |

Do not silently implement the non-green connective scenes just because a later green scene depends on them. During isolated narrative development, enter a scene directly or show a clearly marked development handoff.

## Other ownership/readiness groups

- **Other team's mechanics:** pages 9, 11, 17, 23, 25, 27, 29, 35.
- **Interactive ownership to confirm:** pages 19, 31, 33, 36; page 12 also mentions movement and a scan interaction.
- **Narrative drafts without green outer outlines:** pages 24, 26, 28, 30, 34, 38, 40, 42, 43.
- **Historical/research/presentation work:** pages 5, 18, 32, 37, 46–48, 50–54. These should not be treated as scientifically finalized just because notes are present.
- **Title/chapter/design references:** pages 1–4, 6, 14, 22, 39, 49, 55. Page 22 and page 39 explicitly ask for title changes.

## Proposed scene-by-scene organization

```text
src/
  app/                            # Next.js entry and metadata
  game/
    Game.tsx                      # shell only
    flow/                         # sequence, checkpoints, narrative/mechanic handoffs
    audio/                        # music, SFX, narration
    state/                        # preferences and saves
    ui/                           # title, settings, reports
    narrative/
      player/                     # shared dialogue, fades, scene lifecycle
      scenes/
        prologue-archive/
        chapter-01-arrival/
        ch01-atmospheric-entry/
          Scene.tsx
          script.ts
          scene.module.css
        ch01-window-transition/
        ch01-lander-unfolding/
        ch01-first-look/
        ch01-pathfinder-friendship/
        ch02-earth-flashback/
        ch02-mission-introduction/
        ...
public/
  art/
    characters/                   # approved reference sheets
    scenes/
      ch01-atmospheric-entry/
      ch01-window-transition/
      ...
docs/
  narrative-scene-map.md
```

Use data-only scripts for simple scenes that share staging; introduce a scene-specific `Scene.tsx` only when it owns distinct visual behavior. Avoid creating a module for every dialogue line. Each scene module should keep script, shot order, staging, styles, and asset references local.

Three architecture changes are needed:

1. **Narrative player module:** Move shared dialogue, transitions, and scene lifecycle out of the all-in-one `game.tsx`. This gives scene modules a small shared interface and concentrates timing/skip/audio fixes in one place.
2. **Scene sequence/save module:** Replace positional conditions such as `sceneIndex === 3` and numeric saved progress with stable scene IDs. Keep one source of truth for sequence; migrate existing numeric saves during the refactor.
3. **Game-flow module and handoff seam:** Let shared flow choose a narrative scene or a mechanic activity. Each team reports completion at the seam; neither team reaches into the other's implementation. Define the actual handoff interface with the mechanic team before integrating.

## AI-art production approach

Before generating the backlog, approve character reference sheets for Sojourner and Pathfinder plus one finished scene to lock the look. Use page 1 for design direction and decide whether current generated artwork remains acceptable.

For each approved scene, record its PDF source page, shot list, script, character reference versions, generation prompts, asset filenames, timing/audio cues, completion trigger, and review status. Keep original generations separate from optimized runtime assets. Generate distinct shots when framing/expression changes materially instead of endlessly reusing one illustration.

Story development can continue independently of mechanics if the narrative scenes can be entered directly for development. That does not require fake controls or implementation of the other team's mechanics.

## Decisions requested

1. Next pass: architecture plus Chapters 1–2, architecture plus all green narrative scenes, or architecture only?
2. Green slides: exact approved dialogue/shot order, or permission to adapt wording/order?
3. Art: approve a common character sheet and sample scene first, keep current style, or establish a new style matching the sketches?
4. Confirm interaction ownership and mechanic completion/handoff expectations, especially page 12.
5. Confirm whether pages 20–21 are separate consecutive scenes or alternative versions.

## Implementation update after user decisions

The review above records the pre-refactor state. The subsequent pass organizes code under `src/game`, stages Chapters 1–2 by stable scene/shot IDs, preserves supplied dialogue, leaves uncertain lines empty, and adds replaceable art slots without generating images. Pages 20–21 are one celebration followed by a briefing. See `docs/narrative-development.md` for the current structure and remaining content needs. `/dev/scenes` provides recognizable PDF page thumbnails and scene/shot navigation.
