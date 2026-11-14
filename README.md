# Sojourner

A web-based narrative game built with Next.js, React, XState, GSAP, PixiJS, Howler and Zustand.

```sh
bun install
bun dev
```

Open http://localhost:3000 for the game. Open http://localhost:3000/dev/scenes for the development-only scene workspace: PDF references, scene/shot navigation, scripts and local artwork previews.

## Narrative production

The game is organized under `src/game`, with scene-specific scripts under `src/game/narrative/scenes`. The current narrative preview stages Chapters 1–2, leaving missing dialogue empty. Mechanic activities have explicit handoffs for the other team.

- [Scene and artwork guide](docs/narrative-development.md)
- [Storyboard review and page map](docs/narrative-scene-map.md)
- [Artwork slots](src/game/narrative/art/manifest.json)
- [Story sequence and mechanic handoffs](src/game/flow/story.ts)

To register your own artwork, copy files into their named paths under `public/art/scenes` and run:

```sh
bun run art:sync
```

No new images were generated for the scene-organization pass. Previous generated art and supplied archive images remain temporary fallbacks. Generated-art prompts are in `public/art/PROMPT.md`.

Optional free narration uses device/browser speech synthesis; available voices vary. Music, SFX, narration preferences and stable scene/shot checkpoints are saved on the current device. Existing numeric progress is migrated to the new format.

The game title is centered with painted buttons and a corner music toggle. Ordinary scene transitions fade through black. The flashback has the storyboard's memory transition, disabled by reduced motion. No page header/footer or animated transition rover is used.

## Review status

No build, lint, or browser/visual review was run for the latest refactor, at the user's request. Artwork approval, missing scripts and mechanic integration remain production tasks. The scene workspace is excluded from production routes.
