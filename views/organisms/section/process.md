---
title: "Process"
template: "[[process.njk]]"
templatePath: "views/organisms/section/process.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "component"
atomicLevel: "organism"
status: "active"
tags:
  - "#atomic-design"
  - "#component"
  - "#eleventy"
  - "#nunjucks"
  - "#Obsidian"
  - "#organism"
  - "#template"
links:
  - [organizations](organizations.md)
---
# Process

Defines Nunjucks macro: `render`.

## Template

- Source: [[process.njk]]
- Path: `views/organisms/section/process.njk`

## Purpose

Process section between Bio and Work. Renders a heading, optional body copy,
and two animated visuals: the looping UI-components scene (opt-in via
`params.uiComponents`, rendered above the paragraphs) and the 12x3 (WxH)
Blockframes grid (always rendered, placed after the first hardcoded
paragraph; migrated here from the Bio section). Targeted by the choreography
system via `data-process-el` attributes; both are built by the composed
`ui-components-loop` variant in `choreography/molecules/process-motion`.

## Role in the System

Classified as a **component** at the atomic **organism** level based on its
location under `views/`.

## Data and Context

- `params.id` — section id, defaults to `"process"`.
- `params.copy.heading` — heading text, defaults to `"Process"`.
- `params.copy.body` — optional body paragraph; omitted entirely if empty.
- `params.headingId` — id used for `aria-labelledby`, defaults to `sectionId`.
- `params.uiComponents` — opt-in flag; renders the looping UI-components
  stage (`uicomponents-stage`) above the paragraphs. Blockframes renders
  regardless.

## `data-process-el` Hooks

- `header` — the `<header>` wrapper.
- `heading` — the `<h2>` heading element.
- `body` — the optional `<p>` body element (only rendered when `body` is set).
- `blockframes` — the 12x3 (WxH) grid wrapper (`w-full h-48`,
  `overflow-hidden`).
- `blockframes-grid` — the inner grid (`w-full h-full`, `grid-cols-12
  grid-rows-3`, no gap); fills the wrapper 1:1 so each cell is naturally
  1/12 the wrapper's width and sits flush against its neighbors.
- All 36 cells carry `data-blockframe-block="<BlockName>"` (the 17 library
  block names cycled `i % 17`), filled at runtime by
  `process-motion/blockframes-grid.js` (`fillBlockframesGrid`) and painted
  with design-token colors, then revealed by `process-motion/blockframes.js`
  (`buildBlockframesReveal`).

## Relationships

- Imported by: [[home.njk]] (`views/pages/home/home.njk`), rendered between
  the Bio section (`id="manifesto"`) and the Work section (`id="work"`).
- Choreography controller: [[Process|Process]]
  (`js/choreography/organisms/process/Process.js`).

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate
  the Eleventy build.
- `data-process-el` hooks are consumed by `process-motion` — do not rename
  without updating those modules and `selectors.js`.

## Open Questions

- What copy/content model backs this section's heading + body?
- Will this section need its own Sanity schema, or reuse an existing content
  type?
