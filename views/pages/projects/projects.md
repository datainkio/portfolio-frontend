---
title: "Projects"
template: "[[projects.njk]]"
templatePath: "views/pages/projects/projects.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "page"
atomicLevel: "page"
status: "active"
tags:
  - eleventy
  - nunjucks
  - template
  - obsidian
  - page
  - page
---

# Projects

Renders a top-level Eleventy page.

## Template

- Source: [[projects.njk]]
- Path: `views/pages/projects.njk`

## Purpose

Generates a routed page in the Eleventy build.

## Role in the System

Classified as a **page** at the atomic **page** level based on its location under `views/`.

## Data and Context

- `ProjectCards` — referenced in the template.

## Relationships

- Extends:
  - [[landing.njk]]
- Imports:
  - [[project-cards.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
