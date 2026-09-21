---
description: 'Resource hints and web-font loading for the `<head>` — preconnects, Google Fonts (IBM Plex Sans render-blocking, Cormorant Garamond deferred via `media="print"`), a `<noscript>` fallback, and the `DRAFTPAPER.woff2` preload that drives hero LCP text.'
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

Keep the three typefaces on the right side of the critical path: the body face loads normally (it is above the fold), the serif face stays off the FCP/LCP path, and the display face is preloaded because the hero's LCP text is set in it. Static markup — no Nunjucks logic.

## What it emits, in document order

### 1. CDN (rel: preconnect)

`<link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>` — labelled "performance optimization". **Nothing in `js/` or the built site fetches from cdnjs** (the only mentions are comments in `js/displays/blockframes/`); the hint is currently dead weight. ^d68eb6

### 2. Google Fonts (rel: preconnect)

`<link rel="preconnect">` × 2 — `fonts.googleapis.com`, `fonts.gstatic.com` (`crossorigin`). The in-file comment says to drop them if neither Google face is used above the fold; Plex is, so they stay. ^a4d22a

### 3. IBM Plex Sans (rel: stylesheet)

`<link rel="stylesheet">`, `ital,wght@0,300;1,300`, `display=swap`. Render-blocking, cross-origin: CSS round trip, then the woff2 from `fonts.gstatic`. Primary sans/UI/body face (`--font-body`). ^a5ca79

### 4. Cormorant Garamond (rel: stylesheet)

`<link rel="stylesheet" media="print" onload="this.onload=null;this.media='all'">`, `ital,wght@0,300`, `text=ViewPreviousNext`, `display=swap`. Non-render-blocking; flips to `media="all"` once loaded. Used only below the fold (`--font-serif`: card "View" CTA, prev/next nav). The `text=` subset must contain every glyph rendered in this face. ^0369bc

### 5. NOSCRIPT

`<noscript>` — plain `<link rel="stylesheet">` for both families so the `onload` trick degrades. Note the Plex weights here (`0,400;0,500;0,600;1,400`) differ from the JS-on request (`0,300;1,300`). ^c8fb2c

### 6. DraftPaper (rel: preload)

`<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/DRAFTPAPER/DRAFTPAPER.woff2" crossorigin="anonymous">`. The `@font-face` itself lives in `styles/typography/imports.css` (`font-display: swap`, woff2 → woff → otf); this hint starts the 8 KB fetch at head parse instead of after `styles.css` arrives and text matches. Hero LCP face (`--font-display`).

## Role in the System

Classified as a **partial** at the atomic **template** level based on its location under `views/`. On the home page it is the origin of the `document.fonts.ready` gate in `Preloader.js`: that promise waits on every face this partial starts (Plex, DraftPaper, and Cormorant if any subset glyph is on the page), not just the hero face — see the font-gate callout in [sequence.canvas](../../../../js/preloader/sequence.canvas).

## Data and Context

None. The partial reads no Nunjucks variables; every URL and family is hard-coded. Font-family tokens that consume these faces are generated into `styles/typography/fontFamilies.css` by `build:design` — never hand-edit that file.

## Relationships

- Used by:
  - [head.njk](../head/head.njk) — `{% include "templates/partials/fonts/fonts.njk" %}`
- Related:
  - [imports.css](../../../../styles/typography/imports.css) — DraftPaper `@font-face`; notes that Cormorant was moved out of `@import` and into this partial so it no longer serializes behind `styles.css`
  - [fontFamilies.css](../../../../styles/typography/fontFamilies.css) — `--font-body` (Plex), `--font-serif` (Cormorant), `--font-display` (DraftPaper)
  - [Preloader.js](../../../../js/preloader/Preloader.md) — `fontsReady()` gate, `fontsReadyTimeoutMs: 2000`

## Notes for Future Maintenance

- Adding a glyph to any Cormorant-set string means extending `text=ViewPreviousNext`, or the glyph falls back to `ui-serif`.
- Keep the Plex request weight-tight and above the `modulepreload` in `head.njk`; it is render-blocking and on the FCP path.
- The cdnjs preconnect has no consumer; remove it or point it at an origin that is actually fetched (`cdn.sanity.io` is the one every page hits).
- If the font gate becomes a target, self-hosting Plex + `preload` (or gating on `document.fonts.load('1em DraftPaper')` only) both start here.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.
