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
the "UX IXD AIX DX" subtitle. It is markup only — the loading pulse and exit
settle live in [hanko.css](../../../styles/components/hanko.css), and the
decision of *when* to exit lives in
[Preloader.js](../../../js/preloader/Preloader.js).

## Contract

The `<div id="preloader" data-preloader>` root is the one hook every other
party binds to:

| Party | Binds to | Does |
| --- | --- | --- |
| `js/preloader/constants.js` | `PRELOADER_SELECTORS.root` = `[data-preloader]` | Finds the element |
| `js/preloader/Preloader.js` | `data-preloader-state="exit"` | Flips the attribute once `director:ready` + fonts settle, waits `transitionend`, dispatches `preloader:out` |
| `styles/components/hanko.css` | `[data-preloader]`, `[data-preloader-state="exit"]` | Loading pulse on the hanko paths; outro on the state flip |
| `session-management-script.njk` | `[data-preloader]` | Pre-paint: sets `exit` immediately on a return visit so the pulse never shows |

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

## Notes for Future Maintenance

- Root is a `<div>` — the element is a transient overlay with no
  document-outline role, so a landmark would mislead assistive tech. Flagged
  per the workspace `<div>` rule.
- Copy ("Russ Lebo", "UX IXD AIX DX") is hard-coded, not sourced from Sanity.
- Reduced motion is handled in `hanko.css`, not here.
- Run `npm run build` (or `npm start`) after structural changes.

## Open Questions

- Should the subtitle disciplines come from the same Sanity source as the
  header, or stay fixed?
