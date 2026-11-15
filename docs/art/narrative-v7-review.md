# Narrative art review — PDF v7

Home now connects 28 newly generated draft plates plus the revised page 39 celebration. These are review candidates, not team-approved final assets. Earlier working art and real NASA chapter photos are retained.

## Review in the game

Open Home, press F2, then search the PDF page or scene name. Give feedback using the scene/shot ID, so the next pass replaces only that shot. Dialogue wording remains unchanged; missing lines stay empty. Gameplay, mission notices, and historical report content remain team handoffs.

## Corrections carried into this pass

- Legacy returns to the **actual introductory CRT component and archive room**, rather than a separately generated television. The wall reveal derives from that same archive-room reference.
- The Legacy title now looks out from the surface of Mars. Earth is a tiny point, not a large globe. The rejected Earth/Mars globe composition and standalone TV draft are not connected.
- First-person Pathfinder shots and the rest transition use the existing separate transparent goggles.
- Page 56 and all three page 74 time-passing plates remain reserved for the team's artwork.
- PDF sources and handoff page numbers have been remapped to v7 (95 pages); all source-page previews are available locally.

## Review candidates

Page 39: `public/art/review/page39-celebration-v2.webp`.

| PDF v7 | Asset / shot ID | Installed file |
| --- | --- | --- |
| 40 | `ch02-mission-briefing/briefing` | `public/art/scenes/ch02-mission-briefing/briefing-v7-draft.webp` |
| 46 | `ch03-viewpoint-rest/closing-eyes` | `public/art/scenes/ch03-viewpoint-rest/closing-eyes-v7-draft.webp` |
| 53 | `ch03-yogi-reassurance/worried` | `public/art/scenes/ch03-yogi-reassurance/worried-v7-draft.webp` |
| 53 | `ch03-yogi-reassurance/pathfinder-comfort` | `public/art/scenes/ch03-yogi-reassurance/pathfinder-comfort-v7-draft.webp` |
| 58 | `ch03-yogi-tilt/backwards-approach` | `public/art/scenes/ch03-yogi-tilt/backwards-approach-v7-draft.webp` |
| 58 | `ch03-yogi-tilt/tilted-rover` | `public/art/scenes/ch03-yogi-tilt/tilted-rover-v7-draft.webp` |
| 61 | `ch03-yogi-reflection/explanation` | `public/art/scenes/ch03-yogi-reflection/explanation-v7-draft.webp` |
| 64 | `ch03-ready-to-scan/ready` | `public/art/scenes/ch03-ready-to-scan/ready-v7-draft.webp` |
| 71 | `ch03-analysis-celebration/scientists` | `public/art/scenes/ch03-analysis-celebration/scientists-v7-draft.webp` |
| 71 | `ch03-analysis-celebration/sleep` | `public/art/scenes/ch03-analysis-celebration/sleep-v7-draft.webp` |
| 73 | `ch04-more-memories/waking` | `public/art/scenes/ch04-more-memories/waking-v7-draft.webp` |
| 73 | `ch04-more-memories/companions` | `public/art/scenes/ch04-more-memories/companions-v7-draft.webp` |
| 73 | `ch04-more-memories/new-hopes` | `public/art/scenes/ch04-more-memories/new-hopes-v7-draft.webp` |
| 75 | `ch04-last-signal/opening-eyes` | `public/art/scenes/ch04-last-signal/opening-eyes-v7-draft.webp` |
| 75 | `ch04-last-signal/fading-energy` | `public/art/scenes/ch04-last-signal/fading-energy-v7-draft.webp` |
| 75 | `ch04-last-signal/quiet-pathfinder` | `public/art/scenes/ch04-last-signal/quiet-pathfinder-v7-draft.webp` |
| 76 | `ch04-shared-memories/memories` | `public/art/scenes/ch04-shared-memories/memories-v7-draft.webp` |
| 77 | `ch04-earth-dot/earth` | `public/art/scenes/ch04-earth-dot/earth-v7-draft.webp` |
| 77 | `ch04-earth-dot/eyes` | `public/art/scenes/ch04-earth-dot/eyes-v7-draft.webp` |
| 78 | `ch04-resting-together/leaning` | `public/art/scenes/ch04-resting-together/leaning-v7-draft.webp` |
| 78 | `ch04-resting-together/wide-rest` | `public/art/scenes/ch04-resting-together/wide-rest-v7-draft.webp` |
| 88 | `legacy-title/title` | `public/art/scenes/legacy-title/title-v7-draft.webp` |
| 90 | `legacy-return-to-tv/television-wall` | `public/art/scenes/legacy-return-to-tv/television-wall-v7-draft.webp` |
| 91 | `legacy-rover-evolution/sojourner` | `public/art/scenes/legacy-rover-evolution/sojourner-v7-draft.webp` |
| 91 | `legacy-rover-evolution/later-rovers` | `public/art/scenes/legacy-rover-evolution/later-rovers-v7-draft.webp` |
| 91 | `legacy-rover-evolution/wide-evolution` | `public/art/scenes/legacy-rover-evolution/wide-evolution-v7-draft.webp` |
| 94 | `legacy-museum/museum` | `public/art/scenes/legacy-museum/museum-v7-draft.webp` |
| 94 | `legacy-museum/farewell` | `public/art/scenes/legacy-museum/farewell-v7-draft.webp` |

The pull-back to TV reuses `ch04-resting-together/wide-rest` within the intro CRT, so it needs no second painted TV frame. The retired pre-landing window scene is not in the playable sequence and was not regenerated.

Full prompts, generated originals, installed paths and page numbers: `narrative-v7-generation.json`. Built-in image_gen was used, one call per shot; rejected alternatives were excluded. Museum and rover-evolution plates are illustrative drafts, not precise technical reference drawings.

No build, lint, tests or browser review were run, as requested.

## Team composition replacements

Six regenerated paintings are connected to the existing Home sequence: page 56 (5.png), page 74 (clean wheel reference, 7.png, 8.png), page 77 (9.png, 10.png). These supersede the reserved page 56/74 artwork and replace the prior page 77 pair without duplicate scenes. Files use the `-team-v2.webp` suffix. Composition follows team images; model and painting style follow approved references. Earth is a tiny point. Dialogue remains pending; no missing lines were invented. Gameplay, mission screens and historical popups are unchanged. Prompts and originals: `team-six-generation.json`.
