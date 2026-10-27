# Cedarfield After Dark

A fan-made, immersive reading companion to Harlan Coben's novel *The Stranger* (2015), for adult readers and book clubs. **Use it alongside your own copy.** It contains no quotations from the novel. Every summary is a fresh paraphrase, and passages are cited by chapter and scene so you can find them in your book.

Live site: https://somersetnomad.github.io/cedarfield/
Printable guide: [`companion-guide.pdf`](companion-guide.pdf) (A4, about 450 pages)

## What's inside

- **Eleven rooms** on a painted night map of Cedarfield. Each room has a theme:
  - writing craft
  - ideas
  - real-world facts
  - further reading
  - places
  - ethics
  - plot mechanics
  - art
  - food
  - private reflection
- **56 chapters of material.** Each chapter has:
  - a summary and scene-by-scene beats
  - the cast, the secrets ledger and the clues
  - 30 discussion questions, 6 of them flagged for book clubs
  - 3 close readings
  - a lens for each room, with 9 activities per room
  - 6 cross-room projects
  - 3 essay and creative prompts
  - 9 further readings
  - a five-question quiz
- **60 interactive tools.** Examples include a tension curve, a strand braid, a motif concordance, a route map, ethics scales, a cipher and a commonplace-book export.
- **Seven secret rooms.** They sit behind riddles and a collection of curios, and lead to a final dossier.
- **Dot,** an original narrator who can read aloud (speechSynthesis).
- **Optional soundscapes,** generated with the Web Audio API. They are off by default and have mute and volume controls.
- **Other features:**
  - a spoiler guard tied to the chapter you have reached
  - light and dark themes
  - reduced-motion support
  - mobile layout down to 360px
  - print styles
  - progress saved in your browser (localStorage)

All artwork is drawn in code as SVG, in one painted style. No film or TV imagery is used.

## Run locally

It is a static site, so you need no build step to view it:

```
python3 -m http.server 8765
# open http://localhost:8765/
```

## Rebuild the PDF

The PDF is generated from the same content files as the site, through `print.html`.

You need:
- Node 18+ with Playwright (Chromium)
- Python 3 with `pypdf` (it fixes Chromium's bookmark titles)

```
npm install playwright        # if not already available
pip install pypdf
python3 -m http.server 8765 & # print.html is loaded over HTTP
node scripts/build-pdf.js     # all 56 chapters → companion-guide.pdf
node scripts/build-pdf.js 5   # quick test build, chapters 1–5 only
```

The build produces:
- A4 pages with page numbers
- a clickable contents page
- PDF bookmarks
- a layout that prints well in greyscale

## Content checks

```
node scripts/check-content.js
```

This validates every chapter against the content schema. It checks:
- question counts and book-club flags
- lens length
- activity timings
- reading-bank IDs
- room, motif, strand and place IDs

It also lists any quoted strings for a manual copyright check.

## Layout

| Path | Purpose |
|---|---|
| `index.html` | Site shell |
| `js/data.js` | Rooms, map graph, secrets, places, reading bank, timeline |
| `js/art.js` | Painted SVG scenes and map |
| `js/audio.js` | Web Audio soundscapes |
| `js/tools.js` | The 60 room tools and secret-room views |
| `js/app.js` | Routing, state, spoiler guard, narrator, satchel, ledger |
| `content/chapter-NN.js` | One file per chapter, lazy-loaded |
| `print.html`, `css/print.css` | The printable guide |
| `scripts/` | PDF build, outline fix, content checker |
| `assets/fonts/` | Self-hosted Big Shoulders Display and Newsreader (SIL OFL) |

## Notice

This is an unofficial fan project and is not affiliated with Harlan Coben, his publishers or any adaptation. *The Stranger* is © Harlan Coben. Please buy or borrow the book.
