# Playable narrative skeleton — PDF v6

Source: `NASA Hackathon Visual (6)_compressed (1).pdf`, 91 pages. The Home `/` route now stages the narrative journey through Chapter 4 and Legacy. This is a clickable story skeleton, not finished artwork, final dialogue, gameplay or a historical report implementation.

## Navigation

- Play from Home with Start / Continue, then Continue Story at handoffs.
- Open **SCENES · F2** at the top left, or press F2. Search a scene name, stable ID, shot or page number. Select a scene or an individual shot.
- Each debug entry links to its source-page image under `/storyboards/v6/`.
- Debug jumps start review mode. Review movement does not overwrite the saved story checkpoint, mark the story complete, or record skipped activities in the normal save. Start / Continue from title returns to normal save behavior.
- Back works across narrative and handoff screens. Sleep/final fades use black only where the storyboard asks; ordinary picture changes dissolve and the existing TV/memory transitions remain.
- Reduced-motion mode switches immediately. Debug opening pauses narrative playback and narration, ducks music and pauses ambience.

## Scope and ownership

Existing Chapter 1–2 narrative art and approved script wording are preserved. Source-page metadata now refers to v6. Chapter 3, Chapter 4 and Legacy are new scene folders in `src/game/narrative/scenes/`, each with its own script. Blank-art slots display a scene description, page reference, shot name, pending-script state and replacement path. These descriptions are production notes, never narrator speech or TTS.

Gameplay, mission notices/outcomes and historical pop-ups show distinct handoff screens with their team ownership and source references. Continue reports `outcome: skipped`, not successful gameplay. `Game.activities` remains the integration seam for other teams' modules. The old Barnacle prototype adapter code is retained but is no longer mounted by default in this narrative-only flow.

## New narrative coverage

| PDF | Scene |
| --- | --- |
| 38 | Chapter 3: Exploring a New World |
| 43 | Sojo closes its eyes between missions |
| 46 | Yogi approach panorama |
| 50–51 | Worry and Pathfinder reassurance |
| 53 | Observing the unusual rock |
| 55 | Backward maneuver / tilted rover |
| 58 | Reflecting on the failed attempt; explanation pending |
| 61–62 | Ready for another scan; repeated source beat represented once |
| 68 | Scientists celebrate, then Sojo sleeps |
| 69 | Chapter 4: Beyond Expectations & the Last Signal |
| 70 | Waking without the next assignment / friendship / new hopes |
| 71 | Time-passing sequence with three image slots |
| 72 | Opening eyes / fading energy / Pathfinder grows quiet |
| 73 | Shared memories |
| 74 | Earth as a dot / Sojo closeup |
| 75 | Leaning together / final wide view |
| 84 | The Legacy title |
| 85–86 | Return to the archive / TV wall |
| 87–88 | Rover evolution across the TVs |
| 90 | Museum/final exhibit / farewell |

Handoffs cover opening history, landing/hardware/deployment, Barnacle exploration/analysis, wheel testing and summary, Yogi mission notices/travel/photography/positioning/failure/recovery/replanning/analysis, primary and extended mission history, and legacy findings/credits. Reference-only visual-kit and research pages are not turned into invented story scenes. Page 91 is general gameplay possibilities, not a new narrative ending.

Missing dialogue stays empty. The only added spoken line is Pathfinder's reassurance actually visible on page 50. The page 70 dialogue is explicitly a demo and was not copied as final script. Research notes are not promoted to facts or narration. Future scenes remain drafts even if they appear in the navigable flow.

## Art handoff

1. Find the stable scene/shot ID in the Home debugger. `docs/art-slots-v6.csv` inventories the registered asset paths, including older/retired entries.
2. Put the replacement at the slot's `expectedPath` under `public/` (WebP, PNG, JPG or JPEG with the same filename stem).
3. Run `bun run art:sync`. This is an art import command, not a build. New mappings become unapproved and their previous sources remain as fallbacks.
4. Review in Home. When a pending slot has a real source, the placeholder notes automatically disappear. Script, shot order and navigation are unchanged.

New illustration slots use contain by default, with focal position configurable in the manifest. A changed composition may still need hotspot/safe-area review. Same-path file overwrites retain the existing approval flag; manually clear it during review. The import command does not validate dimensions or review the image for you.

Sojo's supplied circular portrait is connected at `/art/portraits/sojo-cutout-v1.webp`, with a PNG master beside it. Only the exterior white background was requested removed; the painted interior and cyan rim are retained. Pathfinder and Mission Control still use placeholders.

Accepted music choices for existing scenes are preserved. New draft scenes default to no BGM until contextual music is chosen; this avoids automatically carrying cheerful exploration music into the late-story goodbye.

No build, lint, browser review or tests were run, following the user's preference. This implementation awaits the user's flow and art review.
