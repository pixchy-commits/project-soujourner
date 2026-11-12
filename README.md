# Sojourner

A narrative game prototype built with Next.js 16 and React 19. Includes an illustrated title screen, three story scenes, mission reports, preferences, and local progress saving.

## Run

```sh
bun install
bun dev
```

Open http://localhost:3000. For a production build use `bun run build` and `bun start`. Run `bun run lint` for lint checks.

## Structure

- `src/components/game.tsx`: application shell, menus, dialogs, audio lifecycle, story UI.
- `src/lib/narrative.ts`: typed XState navigation and editable story content.
- `src/lib/game-store.ts`: Zustand persistence for progress and preferences.
- `src/components/dust.tsx`: dynamically loaded PixiJS atmospheric particles; gracefully falls back if WebGL is unavailable.
- `src/app/globals.css`: responsive layouts and visual design.

GSAP sequences story entrances and cleans up on scene changes. Howler plays a locally generated ambient sound only after a user gesture. System and in-game reduced motion settings disable animation. Dialogs use native focus trapping and Escape dismissal. Settings and progress are stored only in localStorage under `sojourner-v1`.

React Three Fiber is intentionally reserved for the next playable exploration chapter. The current build ends at the end of the narrative prologue and does not implement 3D gameplay.

## Content and art

The supplied NASA Hackathon PDF informed the story direction. Character dialogue is fictional. Mission reports link to https://science.nasa.gov/mission/mars-pathfinder/ for primary-source context. The in-app historical archive reference was extracted from the supplied brief; its original provenance should be checked before public distribution.

`public/art/mars.webp` is an optimized copy of `public/art/mars.png`, generated using the built-in imagegen tool from the supplied reference. It is illustrative concept art, not scientific reconstruction. The full generation prompt is in `public/art/PROMPT.md`. The ambient WAV was synthesized locally with Python's standard library.

## Verification

Production build, TypeScript, ESLint, HTTP delivery, and XState forward/back/restart transitions were checked. Browser automation was unavailable in this environment; visual interaction QA in desktop and mobile browsers remains required before public release.

## Game presentation update

The title screen is centered and contains only the title, stacked painted menu buttons, and the corner music toggle. Arrow Up/Down navigates menu buttons. There is no page header or footer.

The three narrative beats now use an archive monitor montage, a Pathfinder closeup with rewind, and a centered Chapter 1 arrival card. Click the dialogue box once to reveal its text and again to advance. GSAP provides fade-through-black transitions and a CRT shutdown before the rewind. Settings and reports use centered native dialogs styled as game panels.

`public/art/menu-button.svg` is an original reusable vector UI asset. No additional build, lint, or visual checks were run for this update, per request.

## Transition and sound feedback

Scene transitions now show a small animated rover with rotating wheels, drifting ground marks, and pulsing radio signals. The rewind reverses the animation and displays 1997. Reduced motion skips the transition.

Menu and dialogue interactions use original synthesized WAV effects through Howler. Archive dialogue uses quiet mechanical typing ticks; character dialogue uses soft pitched chirps. Text reveal pauses while a scene transition or panel is active, and skipped text does not burst all its sounds at once. Sound effects have their own saved volume setting, independent of music, and start only after the first button interaction. Effects pause in hidden tabs.

The source generator is `scripts/generate-game-audio.py`. No TTS service is connected yet; narration can be generated ahead of time and added as local audio assets. No build, lint, or visual review was run for this update, per request.

## Page 6 narrative continuation

The preview now has six story beats: archive montage, Pathfinder identification, Chapter 1 title, atmospheric entry, Sojourner looking through the window, and a final moment of wonder. It ends before the landing/game mechanic. Returning players can continue through all six beats. Character dialogue and the anthropomorphic rover imagery are fictional interpretations of the supplied storyboard.

Transitions are plain fades through black. The animated transition rover and decorative title star have been removed.

Optional free narration uses the browser SpeechSynthesis API without a paid service or API key. Enable it in Settings and choose an available English voice. Available voices, voice quality, and speech playback policies vary by browser/device. Narration stops on navigation, opening panels, leaving the tab, or disabling narration. Music volume is lowered during narrated scenes, and typing SFX are suppressed while narration is enabled.

New assets: `public/art/atmospheric-entry.webp` and `public/art/sojourner-window.webp`, with PNG originals alongside them. Created using the built-in imagegen tool. Full prompts are recorded in `public/art/PROMPT.md`.

No build, lint, browser, or visual review was run for this update, as requested.
