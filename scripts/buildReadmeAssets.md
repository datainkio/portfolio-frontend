---
description: Sidecar for buildReadmeAssets.js — generates the repo README banner SVG from design tokens and DraftPaper outlines.
type: script
tags:
  - readme
  - tooling
  - design-tokens
links:
  - "[[fetchFigma]]"
---

# buildReadmeAssets.js

Writes `.github/readme/banner.svg`, the title-block banner at the top of the
repo README. It mirrors the global header (`DOC NO.` · `SECTION` cells) and the
hero's manifesto plate on the graph-paper ground.

GitHub renders README images in a sandbox with no web fonts, so DraftPaper text
is outlined to paths with `opentype.js`. Colours are read from
`styles/colors.css`. Slate is Tailwind's default palette, so its values are
inlined in the script.

## Inputs

- `styles/colors.css`: `secondary-500`, `primary-200/500/800/950`
- `assets/fonts/DRAFTPAPER/DRAFTPAPER.otf`
- `.github/readme/hanko.svg`: the brand mark, extracted once from the rendered
  site (it's served from Sanity and isn't in the repo otherwise)

## Usage

```bash
npm run build:readme
```

It isn't part of `build` or `quick`, so a README asset can't break a deploy.
The output is deterministic. Rerun the script after a token change and commit
the result.

DraftPaper has no `–` or `·`, and its `1` reads as `I`. Use `-`, `/` and words
instead.
