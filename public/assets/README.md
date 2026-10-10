# SONU.EXE — Assets & Content Guide

All words live in `src/content/birthday.ts`. Any value still shaped like `[ADD_SOMETHING]`
is treated as a placeholder: visitors see a polished fallback, never the raw token.

## Folders
| Folder | What goes here | Referenced by |
|---|---|---|
| `photos/` | Real photos + AI-edited "imaginary" scenes (square JPG ≈1200px) | `documentary.photos[].image` |
| `scrapbook/` | Extra stickers / textures (PNG) | optional |
| `gifs/` | Reaction GIFs | optional, add to content fields |
| `audio/` | `birthday-song.mp3`, `heartfelt.mp3` | `audio.music`, `audio.heartfelt` |
| `sfx/` | Optional — default SFX are synthesized in-browser (`src/lib/sound.ts`) | — |
| `illustrations/` | Custom art replacing the built-in CSS/SVG art | optional |

## Example
1. Put `childhood-01.jpg` in `public/assets/photos/`.
2. In `birthday.ts` set `image: "/assets/photos/childhood-01.jpg"` and replace `[ADD_CAPTION_01]`.
3. Set `imaginary: true` on AI edits — they get an "imaginary" label automatically.

## Checklist before sending
- Search `birthday.ts` for `[ADD_` — replace everything you care about.
- Letter: `letter.body` supports blank lines between paragraphs.
- `sender`, `letter.signature`, `portrait.finalBody`.

## Notes / needs setup
- Music only plays once you add MP3 files (the music button tells you otherwise).
- Microphone and camera need HTTPS (works on the published site) and user permission; both have fallbacks.
- Portrait photos stay on the device; nothing is uploaded.
- Before Oct 11 a countdown shows, with a "Peek early" button.
