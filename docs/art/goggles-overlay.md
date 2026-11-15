# Separate first-person goggles

The Home player uses the same transparent painted frame for the first look down the ramp (PDF 28) and both Pathfinder conversation shots (PDF 29).

- Frame: `public/art/overlays/sojo-goggles-v1.webp`; manifest slot `ui/goggle-frame`.
- Ramp plate: `public/art/scenes/ch01-first-look/rover-view-clean-v7.webp`.
- Pathfinder plate: `public/art/scenes/ch01-pathfinder-friendship/pathfinder-clean-v6.webp`.

The lens opening has real alpha. The frame and clean background share one 16:9 canvas, so resizing cannot move them independently. Dialogue and navigation render above the art. Backgrounds dissolve while the frame remains in place. A decorative overlay fails transparently instead of showing a landscape placeholder.

Built-in image_gen was used for all three raster edits. The frame edit removed the white interior while preserving the purple/navy painted housing and opaque exterior corners. The background edits removed the old orange goggles and navy corner masks, extending each scene to a full rectangular plate while preserving the sun/rock annotations or JPL Pathfinder respectively. No CSS-generated binocular outline is used for these shots.

Previous assets remain in place; each background manifest entry retains its previous source as fallback. The new assets await team review.
