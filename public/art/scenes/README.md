# Scene artwork

No new art has been generated for this development pass. Existing prototype art remains a temporary fallback and is not marked approved.

1. Find a slot in `/dev/scenes`, or in `src/game/narrative/art/manifest.json`.
2. Copy your image to the slot's `expectedPath` under `public`.
3. Run `bun run art:sync`. This registers matching files without changing game code or approval flags.

The expected filenames use `.webp`; `.png`, `.jpg`, and `.jpeg` with the same stem are also discovered. To use a different filename, set the slot's `src` directly in the manifest.

Framing can be adjusted with `objectPosition` (for example `40% 50%`) and `fit` (`cover` or `contain`). Use 16:9 compositions with room around important faces and objects; dialogue covers the lower part of the game view.

The local-image picker in `/dev/scenes` previews a file only in the current tab. It does not upload, generate, approve, or permanently save the image.
