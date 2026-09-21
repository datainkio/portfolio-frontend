---
description: 'Resource hints and web-font loading for the `<head>` — the `cdn.sanity.io` preconnect, Cormorant Garamond from Google Fonts deferred via `media="print"` with a `<noscript>` fallback, and the `DRAFTPAPER.woff2` preload that drives hero LCP text. IBM Plex Sans is self-hosted via `@font-face` in imports.css, not requested here.'
type: template
tags:
  - partial
  - performance
  - typography
links:
  - "[head](../head/head.md)"
  - "[imports](../../../../styles/typography/imports.css)"
  - "[fontFamilies](../../../../styles/typography/fontFamilies.css)"
  - "[sequence](../../../../js/preloader/sequence.canvas)"
---

# fonts.njk

Owns every network hint and font request in the `<head>`. Included once by `head.njk`, immediately after the favicon partial and before the choreography `modulepreload`. ^79a140

## Template

- Source: [fonts.njk](fonts.njk)
- Path: `views/templates/partials/fonts/fonts.njk`

## Purpose

Keep the three typefaces on the right side of the critical path: the body face (IBM Plex Sans) is self-hosted and declared in `styles/typography/imports.css`, so it costs one same-origin request discovered from `styles.css` and nothing here; the serif face stays off the FCP/LCP path; the display face is preloaded because the hero's LCP text is set in it. Nothing render-blocking is fetched from a third-party origin. Static markup — no Nunjucks logic.

## What it emits, in document order

### 1. Sanity CDN (rel: preconnect)

`<link rel="preconnect" href="https://cdn.sanity.io" crossorigin>` — every image, poster, and video on the site comes from this origin (13 references on the home page alone; the hero poster is the first, a few KB after `</head>`). Warming DNS + TCP + TLS here takes that setup off the poster's path. Replaced a `cdnjs.cloudflare.com` preconnect that nothing fetched from. ^d68eb6

### 2. Cormorant Garamond (rel: stylesheet)

`<link rel="stylesheet" media="print" onload="this.onload=null;this.media='all'">`, `ital,wght@0,300`, `text=ViewPreviousNext`, `display=swap`. Non-render-blocking; flips to `media="all"` once loaded. Used only below the fold (`--font-serif`: card "View" CTA, prev/next nav). The `text=` subset must contain every glyph rendered in this face. ^0369bc

### 3. NOSCRIPT

`<noscript>` — plain `<link rel="stylesheet">` for Cormorant so the `onload` trick degrades. ^c8fb2c

### 4. DraftPaper (rel: preload)

`<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/DRAFTPAPER/DRAFTPAPER.woff2" crossorigin="anonymous">`. The `@font-face` itself lives in `styles/typography/imports.css` (`font-display: swap`, woff2 → woff → otf); this hint starts the 8 KB fetch at head parse instead of after `styles.css` arrives and text matches. Hero LCP face (`--font-display`).

### Not here: IBM Plex Sans

The body face (`--font-body`) was a render-blocking cross-origin `<link rel="stylesheet">` to `fonts.googleapis.com` — ~820 ms of connection setup under mobile throttle for a 0.8 KB CSS file, then a second origin for the woff2 — and the splash never uses it. Since 2026-09-21 it is self-hosted: `assets/fonts/IBMPlexSans/` (latin subset, 300 + 300 italic, OFL) declared as `@font-face` with `font-display: swap` and `unicode-range` in `imports.css`. The two Google preconnects went with it; Cormorant is the only Google request left and it is already off the render path. ^a5ca79

## Role in the System

Classified as a **partial** at the atomic **template** level based on its location under `views/`. On the home page it is the origin of the `document.fonts.ready` gate in `Preloader.js`: that promise waits on every face in use on the page (DraftPaper, Plex once body text matches, and Cormorant if any subset glyph is on the page), not just the hero face — see the font-gate callout in [sequence.canvas](../../../../js/preloader/sequence.canvas).

## Data and Context

None. The partial reads no Nunjucks variables; every URL and family is hard-coded. Font-family tokens that consume these faces are generated into `styles/typography/fontFamilies.css` by `build:design` — never hand-edit that file.

## Relationships

- Used by:
  - [head.njk](../head/head.njk) — `{% include "templates/partials/fonts/fonts.njk" %}`
- Related:
  - [imports.css](../../../../styles/typography/imports.css) — DraftPaper and IBM Plex Sans `@font-face`; notes that Cormorant was moved out of `@import` and into this partial so it no longer serializes behind `styles.css`
  - [assets/fonts/](../../../../assets/fonts/README.fonts.md) — the self-hosted files
  - [fontFamilies.css](../../../../styles/typography/fontFamilies.css) — `--font-body` (Plex), `--font-serif` (Cormorant), `--font-display` (DraftPaper)
  - [Preloader.js](../../../../js/preloader/Preloader.md) — `fontsReady()` gate, `fontsReadyTimeoutMs: 2000`

## Notes for Future Maintenance

- Adding a glyph to any Cormorant-set string means extending `text=ViewPreviousNext`, or the glyph falls back to `ui-serif`.
- Plex ships only latin 300/300i. Adding a weight or a non-latin glyph means adding a file to `assets/fonts/IBMPlexSans/` and an `@font-face` block, not a Google link.
- If the font gate becomes a target, gating on `document.fonts.load('1em DraftPaper')` only starts here.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.
