---
description: "Home-page loading splash: `[data-preloader]` root with the hanko mark and name/discipline lockup; visuals and outro are CSS-only, timing is Preloader.js."
type: template
tags:
  - organism
  - preloader
  - choreography
aliases:
  - "Preloader organism"
  - "Loading splash"
links:
  - "[[hanko.njk]]"
  - "[[hanko.css]]"
  - "[[Preloader.js]]"
  - "[[constants.js]]"
  - "[[session-management-script.njk]]"
  - "[[home.njk]]"
---

# Preloader

Defines Nunjucks macro: `render`.

## Template

- Source: [[preloader.njk]]
- Path: `views/organisms/status/preloader.njk`

## Purpose

Renders the first-visit loading splash for the home page: a full-viewport
(`h-dvh`, `z-[9999]`) column holding the hanko mark, the name heading, and
the "UX IXD AIX DX" subtitle. It is markup only — every state below lives in
[hanko.css](../../../styles/components/hanko.css), and the decision of *when*
to exit lives in [Preloader.js](../../../js/preloader/Preloader.js). ^d7789d

## Contract

The `<div id="preloader" data-preloader>` root is the one hook every other
party binds to:

| Party | Binds to | Does |
| --- | --- | --- |
| `js/preloader/constants.js` | `PRELOADER_SELECTORS.root` = `[data-preloader]` | Finds the element |
| `js/preloader/Preloader.js` | `data-preloader-state="exit"`, `[data-preloader-subtitle]`, `[data-preloader-logo]`, `hidden` | Awaits the intro (subtitle animation finished) and readiness, flips `exit`, awaits the outro (logo animation finished), sets `hidden`, dispatches `preloader:out` |
| `styles/components/hanko.css` | `[data-preloader]`, `[data-preloader-state="exit"]`, the three child attributes | Every state S00–S04: intro + pulse from first paint, outro on the state flip |
| `session-management-script.njk` | `[data-preloader]` | Pre-paint: sets `hidden` on a return visit so the splash never shows |

Removing or renaming `data-preloader` breaks all four. Pages without it are
handled — `Preloader.js` hydrates deferred videos and returns.

## Data and Context

- `params.svg` — the hanko SVG markup, passed through to `Logo.render`. Home
  passes the Sanity-inlined `logo`.
- Imported `with context` in `home.njk` so the `classes` filter resolves.

## Relationships

- Imports: [[hanko.njk]] (`atoms/hanko/hanko.njk`) as `Logo`
- Used by: [[home.njk]] (`views/pages/home/home.njk`), rendered directly
  after `GlobalHeader` and before `#page-main`


## Structure ^4566c5
### [data-preloader-logo](dataink.io/frontend/views/atoms/hanko/hanko.md)

^5b23ed

The logo is an SVG supplied by the CMS and rendered inline so that it can be styles and animated via CSS.
### data-preloader-author

^7dab0e

The P element containing the author's name (aka Russ Lebo)
### data-preloader-subtitle

^9fc38e

The P element containing the subtitle text (i.e. UX AIX DX IXD)

## States

### S00
The default state for the view. All elements are hidden.
- data-preloader-logo: hidden
- data-preloader-author: hidden
- data-preloader-subtitle: hidden

### S01
- data-preloader-logo: visible
- data-preloader-author: hidden
- data-preloader-subtitle: hidden

### S02
- data-preloader-logo: visible
- data-preloader-author: visible
- data-preloader-subtitle: hidden

### S03
- data-preloader-logo: visible
- data-preloader-author: visible
- data-preloader-subtitle: visible

### S04
The idle state for the view. All elements are visible. The data-preloader-logo is running its looping animation.
- data-preloader-logo: visible & animated
- data-preloader-author: visible
- data-preloader-subtitle: visible

## Sequences
The preloader view has three basic animation sequences: intro, idle, and outro.

## Intro

^f53317

1. S00
2. S01
3. S02
4. S03

CSS-auto from first paint: each child fades in over `--preloader-step-duration`
(0.4s), staggered by `--preloader-step-stagger` (0.2s) in DOM order. No JS
involved, so S00 is exactly what FCP shows.

## Idle

^20d161

1. S04

The hanko pulse's `animation-delay` equals the intro total (0.8s), so its
first crest is the S03 → S04 transition. Holds until JS flips `exit`.

## Outro

^e31b11

1. S03
2. S02
3. S01
4. S00

Runs on `data-preloader-state="exit"`: the intro in reverse (subtitle, author,
logo). Once the logo's fade finishes, `Preloader.js` sets `hidden` on the root
so the `h-dvh` block leaves the flow, then dispatches `preloader:out`.

## Notes for Future Maintenance

- Root is a `<div>` — the element is a transient overlay with no
  document-outline role, so a landmark would mislead assistive tech. Flagged
  per the workspace `<div>` rule.
- Copy ("Russ Lebo", "UX IXD AIX DX") is hard-coded, not sourced from Sanity.
- Reduced motion is handled in `hanko.css`, not here: the states snap
  (children visible; hidden on `exit`) since the global utility disables
  animations.
- Run `npm run build` (or `npm start`) after structural changes.

## Open Questions

- Should the subtitle disciplines come from the same Sanity source as the
  header, or stay fixed?
