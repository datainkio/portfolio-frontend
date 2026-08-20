---
title: "Blockframe Basic"
template: "[[blockframe-basic.njk]]"
templatePath: "views/atoms/svg/blockframe-basic.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "component"
atomicLevel: "atom"
status: "active"
tags:
  - svg
---
# Blockframe Basic

Defines Nunjucks macro: `render`.

## Template

- Source: [[blockframe-basic.njk]]
- Path: `views/atoms/svg/blockframe-basic.njk`

## Purpose

Inlines the Blockframes `.Basic` block as an SVG at build time so it can be
targeted directly by the choreography system (no runtime fetch). Root `<svg>`
uses `viewBox="0 0 590 606"`, `fill="currentColor"`, and is decorative
(`aria-hidden="true"`, `focusable="false"`). Animated by
[[blockframes]] (`js/choreography/molecules/bio-motion/blockframes.js`).

## Provenance

The `.Basic` group body was **hand-extracted verbatim** from
`assets/svg/blockframes.svg` (the `<g class="Basic">` … closing `</g>` before
`<g class="Features">`). Native `opacity` attributes and class names are
preserved because they are both JS animation targets and the resting end-states
that `.from()` tweens return to. **Re-extract this body if the Blockframes
library changes.**

## Data and Context

- `params.classes` — additional CSS classes appended to the `blockframe-basic`
  root class.

## Role in the System

Classified as a **component** at the atomic **atom** level based on its location
under `views/`.

## Relationships

- Used by:
  - [[bio.njk]] — rendered into the Bio section blockframes slot.

## Notes for Future Maintenance

- Do not rename the inner group/class names (`chrome`, `toolbar`, `sidebar`,
  `banner`, `title`, `subtitle`, `text_line`) — they are choreography selectors
  in `blockframes.js`.
- Keep this sidecar in sync when the macro signature changes.
- Run `npm run build` (or `npm start`) after structural changes to validate the
  Eleventy build.
