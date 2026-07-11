---
title: "Bio"
template: "[[bio.njk]]"
templatePath: "views/organisms/section/bio.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "component"
atomicLevel: "organism"
status: "active"
tags:
  - atomic-design
  - component
  - eleventy
  - nunjucks
  - Obsidian
  - organism
  - template
links:
  - "[section-cap](../../molecules/section-cap.md)"
  - "[printmarks](../../molecules/printmarks.md)"
---
# Bio

Defines Nunjucks macro: `render`.

## Template

- Source: [[bio.njk]]
- Path: `views/organisms/section/bio.njk`

## Purpose

Renders the biography section of the landing page. Displays a heading, subheading, and body copy within a full-viewport pinned section. Targeted by the choreography system via `data-bio-el` attributes.

## Role in the System

Classified as a **component** at the atomic **organism** level based on its location under `views/`.

## Data and Context

- `params.id` — section element ID; defaults to `"bio"`.
- `params.classes` — additional CSS classes applied to the section root.
- `params.copy.heading` — primary heading text.
- `params.copy.subheading` — subheading text.
- `params.copy.body` — body copy (currently bound but not rendered in markup).
- `params.order` — display count passed to the section cap.
- `params.headingId` — overrides the default heading element ID (`{sectionId}-heading`).
- `params.buildDate` — passed to the section cap for build metadata display.

## Relationships

- Imports:
  - [[section-cap.njk]]
  - [[printmarks.njk]] _(imported but not currently used in rendered output)_
- Likely used by:
  - [[introduction.njk]]

## Notes for Future Maintenance

- `data-bio-el` attributes (`header`, `heading`, `subheading`, `context`, `aside`, `blockframes`, `blockframes-grid`, `blockframes-visible`) are choreography hooks — do not rename without updating the bio-motion variants and `selectors.js`. The `blockframes` wrapper is a 6x6 grid: the wrapper owns the Basic aspect (`aspect-[590/606]`, `overflow-hidden`), the inner grid is `w-[600%] h-[600%]` offset `-left-[200%] -top-[200%]` so cell r3c3 (row-major index 14, `blockframes-visible`) aligns exactly with the wrapper box and holds the inlined `.Basic` SVG ([[blockframe-basic.njk]]), animated by `bio-motion/blockframes.js` (`buildBlockframesReveal`). The other 35 cells are empty placeholders carrying `data-blockframe-block="<BlockName>"` (no hiding class — they're empty pre-JS, clipped by the wrapper overflow until the zoom-out, and held at autoAlpha 0 by the reveal timeline) (the 17 library block names cycled `i % 17`), filled at runtime by `bio-motion/blockframes-grid.js` (`fillBlockframesGrid`). The reveal's final stage scales the `blockframes-grid` element 1 -> 1/6 (origin 40%/40%) to fit the grid in the wrapper while the hidden cells fade in.
- `data-scroll-section` is required for ScrollSmoother section detection.
- The `<header>` is the flex container (`flex flex-wrap items-center [&>time]:ml-auto`); it positions the SectionCap spans left and the `<time>` right. The `<h2>` and `<p>` use `basis-full` to each occupy their own row.
- Keep this sidecar in sync when the macro signature or `data-bio-el` hook set changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Is `params.copy.body` intended to be rendered as block content (Portable Text)? Currently captured but not output.
- Should `PrintMarks` be removed from the import if it remains unused?
