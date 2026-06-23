---
title: "Section Cap"
template: "[[section-cap.njk]]"
templatePath: "views/molecules/section-cap.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "component"
atomicLevel: "molecule"
status: "active"
tags:
  - atomic-design
  - component
  - eleventy
  - molecule
  - nunjucks
  - Obsidian
  - template
---
# Section Cap

Defines Nunjucks macro: `render`.

## Template

- Source: [[section-cap.njk]]
- Path: `views/molecules/section-cap.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **molecule** level based on its location under `views/`.

## Data and Context

No obvious data dependencies identified from the template alone.

## Relationships

- Likely used by:
  - Unknown

## Open-state layout

The cap `<ul>` is the named flex group `group/cap` and carries `data-buildinfo-el="cap"`. [[BuildInfoManager.js]] toggles a `data-open` presence attribute on it when the build-info disclosure opens. Three items default to `basis-1/3` each; `group-data-[open]/cap:` variants redistribute to **1/6 · 1/6 · 2/3** (title · count · build-info) to make room for the expanded list. Layout is CSS-only — JS just flips the flag.

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
