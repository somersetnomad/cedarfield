# Changelog

## 1.0.0 — 2026-10-27

First complete release.

### Added
- Hall and map:
  - eleven themed rooms linked as a graph, on a clickable painted night map of Cedarfield
  - entry transitions for each room, doors to neighbouring rooms, captions on each banner
- Chapter content for all 56 chapters. Each chapter has:
  - a summary, beats, cast, secrets and clues
  - 30 questions, 6 of them for book clubs
  - 3 close readings
  - room lenses and 90 activities
  - 6 projects, 3 prompts, 9 readings and a quiz
- Tools and secrets:
  - 60 interactive room tools
  - seven secret rooms behind riddles or collected curios
  - one curio in every banner, kept in a satchel
  - a final dossier that exports a commonplace book (print or .txt)
- Narrator and sound:
  - Dot, an original narrator, with speech playback
  - procedural Web Audio soundscapes, off by default, with crossfade, mute and volume
- Reading aids:
  - a spoiler guard tied to the reader's current chapter
  - a ledger grid (chapter × room) and progress pips
  - light and dark themes, reduced motion, and print styles
- Printable A4 guide (`companion-guide.pdf`), built from the same content with:
  - a clickable contents page, bookmarks and page numbers
  - a greyscale-friendly layout
- Self-hosted fonts, favicon set and web manifest.
- Content checker and PDF build scripts.

### Fixed
- Room tools no longer cause sideways scrolling at 360px when wide tables are open.
- Curios in the Legion Hall, Incident Board and Diner banners now sit inside the visible crop on phones.
