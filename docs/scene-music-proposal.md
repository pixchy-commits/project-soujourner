# Scene music proposal — 15 November 2026

Status: installed for a Home listening trial after user approval. The six original MP3s are local under `public/audio/scott-buckley/`, with credits exposed in Settings and Reports. Listening approval, exact excerpts and mix balancing remain pending.

Trial routing: title / Pathfinder conversation / Chapter 2 bridge use First Snow; archive uses Signal to Noise (No Piano Melody); Chapter 1 and cabin / sparkling entry eyes use Discovery; heat-shield exterior, landing handoff and hardware handoff leave space for effects without BGM; unfolding / deployment / first look use Adrift; pre-memory Mars closeup keeps First Snow before Childhood begins on the scientists; introduction / exploration / celebration use Tomorrow, reduced for analysis and the silent briefing. Full tracks start from their beginnings, play once, and fade between cues. No arbitrary musical excerpts or whole-track loops have been imposed without listening. Shared-source cues (exploration → analysis → celebration) keep their playback position and adjust level.

The music player streams MP3s, preserves position on mute/tab suspension, resets on a return to a different track, and does not restart an ended piece just because ducking changes. The old synthesized score files remain available for rollback but are no longer selected. Original montage movement effects remain synchronized to the animation.

This replaces the earlier approach of choosing instruments from broad phase names. Sources reviewed: the active Home sequence in `src/game/flow/story.ts`, every scene script in that sequence, actual artwork resolved through the art manifest, the Barnacle narrative adapters, and latest PDF storyboard pages 18–36. Scene contact sheets for this audit are in `tmp/audio-scenes-1.png` through `tmp/audio-scenes-3.png`.

The tracks below are shortlisted from the composers' own descriptions and verified source/license pages. They have NOT been auditioned against the game or heard through an audio listening tool. Therefore exact musical entry points, excerpt lengths and loop boundaries remain undecided. No timestamps below are presented as verified edit points.

## What the sequence is communicating

The emotional arc is: invitation → abandoned companions → curiosity about their past → a dangerous journey seen through an excited child's eyes → relief and wonder → reassurance from a trusted friend → memory of being loved and given a purpose → curious first work → shared pride.

The visual warmth and sparkling eyes matter as much as Mars and spacecraft hardware. This is not a uniformly ominous space documentary. Equally, the opening words about machines unable to return home should not be scored as a cheerful mission tutorial.

## Listening shortlist

All tracks here are by Scott Buckley. Keeping one composer is a starting point for a coherent palette, not a requirement to select all of them.

| Candidate / listen page | Verified character from composer | Proposed purpose and limitation |
| --- | --- | --- |
| [Signal to Noise](https://www.scottbuckley.com.au/library/signal-to-noise/) — select **No Piano Melody** on that page | Cello and piano, warm synths and low strings; melancholy with hope. An alternate mix removes the piano melody. | Opening archive. Its absence-of-melody mix is a candidate under narration; reject if low strings turn the sequence into horror. |
| [Discovery](https://www.scottbuckley.com.au/library/discovery/) | Optimistic hybrid orchestral music, arpeggiated synths, brass/strings and a cello interlude. | Candidate for anticipation inside the capsule and a chapter motif. Its dramatic full orchestration could overwhelm a small rover; do not run the full arrangement continuously under dialogue. |
| [Adrift Among Infinite Stars](https://www.scottbuckley.com.au/library/adrift-among-infinite-stars/) | Minimalist, contemplative piano/synths/strings/solo violin. | Wide Mars reveal: space to look rather than instructions to feel triumphant. Check that it does not make the excited first steps too sad. |
| [First Snow](https://www.scottbuckley.com.au/library/first-snow/) | Gentle piano, strings and clarinet. | Pathfinder's reassurance: intimacy and safety. Also a possible soft title theme. Audition for unwanted holiday associations. |
| [Childhood](https://www.scottbuckley.com.au/library/childhood/) | Simple piano and strings, associated by the composer with childhood innocence. | Strongest contextual candidate for the scientists holding Sojo, introducing it and explaining its purpose. Keep one musical phrase across those shots. |
| [Tomorrow](https://www.scottbuckley.com.au/library/tomorrow/) | Playful adventure orchestration with xylophone, strings and percussion, with builds. | Curious Rock Garden activity and a small celebration. Check a lighter passage for the activity; full swells are too much for reading instructions. |

## Scene-by-scene spotting proposal

These are story-triggered changes, not fixed durations: the player controls reading speed.

| Active scene / phase | Picture and words actually present | Intended feeling | Music / sound proposal |
| --- | --- | --- | --- |
| Home title | Warm painted Mars, friendly rover, subtitle “The Little Rover That Never Came Home.” | Welcoming, with a hint of tenderness about the journey ahead. | Audition First Snow as the softer choice, Discovery as a more adventurous alternative. Avoid establishing tragedy before the player knows Sojo. |
| Archive `report` | Real mission photographs inside an illustrated TV. Narration says the machines have no way home and some radios went quiet decades ago. | Affection, distance, gentle loss, interest in who they were. | Signal to Noise, No Piano Melody, at a restrained level. TV hum and photo movement remain separate SFX; whoosh on each arrival, a broader shuffled sweep with a soft landing when rearranging. No new musical hit for every photograph. |
| Archive `identification` | Real Sojourner/airbag photo. Narration names the two pioneers and Ares Vallis. | Recognition: these are two specific companions, not anonymous equipment. | Continue the archive cue without restarting it. Leave a little space around the names. |
| Archive `rewind` | The same TV picture; narrator asks what stories they left and invites a return to 1997. | Curiosity turning into anticipation. | Fade the archive bed as the rewind actually begins. Use tape movement and CRT collapse; briefly let the effect own the sound field, then introduce the next musical idea. |
| Chapter 1 card | Historical landing photo, July 4, 1997. No dialogue. | A new beginning; time and place become concrete. | A short hopeful phrase from the eventual chapter theme. No need to introduce a separate looping track for this card. |
| Entry `heat-shield` | Capsule surrounded by flames above curved Mars. Narration describes flames roaring. | Scale, speed, physical risk. | Let re-entry rumble and a low musical texture lead. Discovery is only a candidate if a restrained passage works; do not invent a final cut point without listening. |
| Entry `cabin` | Rear view of little Sojo looking out at Mars. Its heart is beeping fast, ready to begin its job. | Excitement and anticipation inside the danger. | Soften the threatening layer and let the hopeful Discovery idea become clearer. A small eager robot phrase; no panic alarm just because the line says its heart is fast. |
| Entry `eyes-closeup` | Enormous sparkling eyes and an open delighted smile. No script. | Childlike delight. | Let the hopeful phrase breathe. Do not keep escalating percussion over a happy face. |
| Landing activity handoff | An external gameplay slot; final mechanics and pacing belong to the other team. | Player attention and physical landing. | Provide a low stem/entry-outcome contract for the gameplay team. Do not infer a win or play a victory cue when a prototype handoff is skipped. |
| Landed capsule → open petals | Deflated airbags around a closed triangular lander, then overhead petals open with Sojo visible. Silent shots. | Relief, revealing the tiny explorer in a huge place. | Release the entry tension; momentary quiet, metal/petal mechanism sounds when corresponding animation exists, then transition toward Adrift. No whoosh used as a substitute for mechanical unfolding. |
| Hardware / deployment handoffs | System activation, then first movement from Pathfinder. External modules are not implemented here. | Competence emerging; first steps. | A quiet continuation, leaving room for switches, servo movement and wheels. Do not prescribe arcade success tones for unseen gameplay. |
| First look / “Fifteen giant bounces” | Binocular view down the ramp; vast ridges, sun and rocks. Narration describes sunlight, a new world and an approaching warm memory. | Wonder and a little vulnerability; this world is much bigger than Sojo. | Adrift as the first candidate. Sparse, low in the mix; let the width of the picture do the work. No busy exploration beat yet. |
| Friendship / Sojo question | First-person view looking back at friendly JPL Pathfinder. Sojo asks whether its creators can see it. | Pride, longing for home, seeking reassurance. | Continue softly from the arrival theme; audition a gentle transition toward First Snow. Bright Sojo voice, not frantic chatter. |
| Friendship / Pathfinder reply | Same view. Pathfinder promises to relay discoveries home and watch over Sojo. | Trust and emotional safety; the radio fact serves that relationship. | First Snow is a candidate because its gentle instrumentation supports companionship. Lower, calm robot phrasing and one restrained radio connection sound. No triumphant sting for the technical explanation. |
| Chapter 2 card | Sojourner photo with July 5, 1997 / Baby Steps. | A bridge to Sojo's origins and early growth. | Carry the preceding warmth rather than restart an unrelated tune. |
| Pre-memory `blink` | New-model Sojo smiling with huge shining eyes on Mars. | A warm association forming. | Retain the Mars cue until the actual memory transition. A small shimmer can mark the flash, without replacing the melody with a generic swoosh. |
| Flashback `construction` | Scientists hold the tiny new rover, smiling in warm Earth light. No approved spoken script. | Being welcomed and cared for, like a child's first memory. | Childhood is the primary candidate. Start the memory theme with the scientists' appearance, not earlier on the Mars closeup. |
| Flashback `introduction` | Scientists hold Sojo turned around, presenting its small hardware. Source text is incomplete; no spoken script. | Affection, delicacy and pride. | Continue Childhood. No lab “tech music” merely because the room has equipment. |
| Flashback `mission` | Scientists explain an Earth-to-Mars board while Sojo watches. Spoken script is missing. | Being trusted with a purpose. | Continue the same memory theme. Avoid fabricated speech, punctuation cues or a mission briefing beat driven by missing lines. |
| Flashback `memory-eyes` | Sparkling Sojo imagining itself on Mars in a thought cloud. Silent. | Aspiration: it wants to live up to the scientists' hopes. | Allow the warm phrase to resolve; transition back to present when the actual next shot arrives. |
| Sojo introduction | Front-facing cheerful new rover on Mars, distant Pathfinder behind. It welcomes the player and explains seven sols. | Friendly invitation and eagerness to help. | Audition a light passage of Tomorrow. Keep the voice readable, do not use a generic countdown just because the mission has a duration. |
| Mission paper | Same art, paper with duration and blank mission items. Sojo explains climbing, scanning and sending findings home. | Shared purpose, curiosity and clear instructions. | Continue the introduction cue, reduced under the longer text. A single paper/radio accent if the paper animates. |
| Barnacle travel → notice | Rear view of Sojo, tracks across sunlit ground, a target marker, then a notice from Pathfinder. | Curious independent movement while still connected to its friend. | Tomorrow, restrained passage, is a candidate. Marker/radio feedback should be distinct from typing. Actual driving sounds belong to the gameplay module. |
| Barnacle instructions / rock selection | Camera view of two rocks with step labels and a gameplay handoff. No actual analysis findings are implemented. | Focused investigation without time pressure. | Thin the exploration cue or use ambience while reading. Do not add ominous puzzle music or confirm a scientific discovery on mere selection. |
| Celebration | Earth scientists cheering around Sojo's monitor; confetti; approved congratulations line. | Shared pride: the “parents” see the first steps succeed. | Brief brighter phrase from Tomorrow, then relax. A small story celebration, not an epic end-of-game victory. |
| Next briefing | Same scientists calm again, gesturing to the monitor. Spoken script is missing. | Settling after celebration; the journey continues. | Let the celebratory phrase resolve, return to a quiet continuation or ambience. Final emotional intent remains provisional until the missing script arrives. |

## Continuity issues to settle before final music editing

- The first-look narration already mentions a warm memory, but current Home flow inserts the Pathfinder conversation and Chapter 2 card before the memory begins. Score the actual flow now; do not trigger the flashback cue from the word “memory” prematurely. Flag this for later story review without silently moving scenes.
- Some older generated rover models remain in the flashback. Music should follow the intended emotional continuity, not interpret a different drawing as a different character.
- Source page metadata in several scripts still references older PDF pagination. This proposal identifies stable scene and shot IDs and cross-checks the latest rendered PDF instead of trusting those numbers alone.
- User-controlled reading means exact durations are unknown. After track approval, select a sustainable passage for each cue and a musical exit; do not blindly loop an entire cinematic track or randomly jump to its climax.

## Rights and next listening decision

The linked original tracks are offered as free MP3s under CC BY 4.0 with attribution, including commercial projects. See [the composer's usage terms](https://www.scottbuckley.com.au/library/using-this-music/). Free does not mean credit-free. If selected, preserve the track title, composer, source URL, license link, and any edit/loop disclosure in game music credits. Paid WAV/stem access is not required for these MP3 candidates.

First compare the archive, first-Mars-view and Earth-memory choices against their pictures. Those three should establish the game's emotional range before choosing exact excerpts for the remaining scenes. Track names and descriptions alone are not final listening approval.
