# Art handoff readiness

Source reviewed: `NASA Hackathon Visual (6)_compressed (1).pdf`, 91 pages, supplied November 15, 2026. This is an audit and proposed scope, not a completed runtime refactor. Existing Home flow still ends after Chapters 1–2. Soundtrack trial is accepted by the user and is outside this art preparation scope.

## What already works

Scene illustrations have stable asset IDs in `src/game/narrative/art/manifest.json`. Each entry stores its current source, expected replacement filename, fallback, fit, focal position, alternative text and approval state. `Artwork.tsx` renders these entries and handles missing images. `bun run art:sync` registers files with the expected filename stem in WebP, PNG, JPG or JPEG form. Scene scripts and saved story checkpoints already have stable IDs.

Use those stable IDs for handoffs. A PDF page is a reference, not an asset identifier: this revision inserts pages and shifts many existing page numbers.

## Proposed first scope: active Home art

1. **One module for replacement art.** Extend the existing art registry to cover the title background, dialogue portraits and Barnacle mission images, which currently bypass it. The interface should let a replacement change one asset entry; its implementation should own fallback, crop and dimensions. Benefit: asset changes have locality instead of requiring changes to CSS and multiple React files. No new game engine is needed.
2. **Scene-owned composition information.** Record focal position, dialogue-safe region and clickable regions alongside their scene. Narrative hotspots already use scene data; mission targets still live in CSS. This creates a seam where final art can be fitted without changing game logic. Benefit: the same interaction survives art replacement, with coordinates adjusted intentionally.
3. **Handoff checklist and import report.** Give each slot an expected filename, purpose, dimensions/aspect, transparency requirement, placement constraints, source PDF page and review status. A changed file should become unapproved and retain a rollback reference. The current sync preserves approval even when a replacement is selected; that needs correction before calling the process plug-and-play.

## Asset categories

| Category | Handoff requirement | Current gap |
| --- | --- | --- |
| Narrative background / complete painted shot | Agree on 16:9 master, focal subject, text-safe region and allowed cover/contain behavior | Scene entries have fit/focal information, but no documented safe-area contract |
| Character portrait / expression | Square transparent master; consistent character scale, eye line and filename per expression | Three SVG placeholders are hardcoded in Dialogue.tsx; no expression selection contract yet |
| Title illustration | Landscape master with title/menu safe regions and rover fully inside the usable composition | URL lives in intro.css |
| Mission illustration | Same image canvas as target coordinates; no labels baked into interactive targets | Direct paths in BarnacleMission.tsx; target positions in CSS |
| Chapter / archive photos | Preserve original aspect and source attribution; contain inside TV | Already centrally mapped; shared aliases must stay consistent |
| Mission Complete / Next Mission / Failed UI | Reusable frame or background, editable heading/body, optional image slot | PDF examples exist; not all are current runtime components |
| Historical report materials | Separate folder/paper, photos, map/diagram, captions and source attribution | Current reports are a small static collection; a full historical archive is a separate scope |
| Animated / layered artwork | Agree on a layer list and shared canvas before exporting, including pivots and intended movement | Flat full-frame pictures cannot automatically become independent character animations |

Suggested dimensions are a handoff recommendation, not a claim that the PDF requires them: backgrounds 1920×1080 minimum, portraits 512×512 or larger, transparent UI at 2× its intended display size. Avoid enforcing those exact pixel sizes before the art team confirms its export workflow. WebP/PNG are suitable for scene art; PNG/WebP with alpha for portraits/layers. SVG remains suitable for scalable UI supplied as vector artwork.

## Latest PDF references

| Reference | Relevant preparation |
| --- | --- |
| 3–8 | Palette, character style, lighting and typography; latest separately supplied rover drawings remain the character authority |
| 9–10 | Reusable historical folder, paper, photo, map and document slots |
| 13–16 | UI components, icons/symbols and visual effects; page 15 now visibly includes Sojo expressions and object icons |
| 18 | Home title illustration |
| 19–20 | Archive scene and photo montage composition |
| 21–22 | Chapter 1 card and entry shots |
| 25–29 | Arrival reference, capsule/petals, hardware handoff, first look and Pathfinder conversation |
| 30–32 | Chapter 2, Earth flashback and Sojo introduction / mission paper |
| 33–37 | Barnacle exploration, general mission interaction, analysis handoff, celebration and briefing |
| 38 | Chapter 3 card now includes “Exploring a New World”; do not add it to runtime as part of an asset-only pass |
| 44–51, 56 | Mission outcome, Pathfinder notification, Next Mission, worry/monologue and failed-state asset examples |
| 64–67, 76–83 | Research material: store citations separately; do not treat notes as approved spoken lines |
| 69–75 | Chapter 4 and late-story narrative; prepare slots only if expanded scope is selected |
| 84–90 | Legacy TV sequence, credits and ending references; not implemented merely because the asset structure exists |

The PDF's colors and notes communicate draft/readiness state. This review does not automatically approve all new content, placeholder text, research claims, chapter titles, or depicted mechanics. Existing user direction about editable dialogue, the two textbox types, rover anatomy and gameplay-team ownership still applies.

## Proposed handoff experience

Artist receives a scene checklist → exports named files → files are registered without changing the scene script → missing art keeps a fallback → composition is reviewed in Home → final art is approved. Local temporary preview remains optional and must not be the only place replacements appear.

The honest limit: a new composition may still need focal/hotspot adjustment; a flat image does not contain animation layers. Plug-and-play should mean no component rewrites for a compliant replacement, not a promise that every arbitrary image works with zero review.

## Scope decision

Recommended: unify the active Home / Chapters 1–2 asset paths and checklist first. An inventory for all 91 pages, future missions and ending can follow without prematurely adding unfinished story content. Implementation is pending that scope choice.

No build, lint, browser review or tests were run for this audit.
