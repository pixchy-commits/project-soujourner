# Sojo model replacement — review draft

The latest pass uses the team-approved combined sheet `public/art/characters/sojo/model-2026-11/sojo-reference-sheet-v1.png` as its only character reference. The scene image supplied alongside it defines composition and lighting only. Final paths and verbatim per-image prompts are recorded in `approved-sheet-replacements.json`; the earlier `rover-model-migration.json` records the superseded first pass.

The dialogue portrait uses the original supplied front PNG inside a tightly fitted SVG viewport. Its pixels are embedded unchanged; no regenerated anatomy is used in the portrait.

The five supplied character views are the source of truth in `public/art/characters/sojo/model-2026-11/`. These are original supplied PNGs, not generated character sheets. Preserve their front/back orientation, low chassis, six wheels, suspension, blue/yellow palette, front expression and single central rear camera in future art.

This pass replaces the current generated narrative illustrations in Home: title, cabin, entry reaction, overhead lander reveal, the Earth-memory sequence, Rock Garden introduction, and both mission-control scenes. It also replaces Sojo's dialogue portrait with a transparent version of the new model. One Rock Garden image is shared by its introduction and mission-paper shots.

The real NASA montage/chapter photographs remain source photographs. Empty future scene slots remain placeholders. Historical generated versions stay on disk for rollback; they are not alternative approved character references. The optional gameplay team's Barnacle adapter is outside this narrative pass.

`rover-model-migration.json` records the final built-in image_gen prompts, source composition files, replacement paths and manifest IDs. Outputs are WebP assets in `public/art/`; the source PNGs produced by image_gen remain in its generated-images directory. New scene assets are marked `approved: false` pending team review. Previous scene sources remain manifest fallbacks.

Review from Home using F2, then select the scene or shot. This task did not run a build, lint, tests or browser review, as requested. Raster outputs were inspected for model identity, framing and visible hardware; team art approval is still pending.

The goggles in PDF 28–29 are independent transparent foreground art; see `goggles-overlay.md`.
