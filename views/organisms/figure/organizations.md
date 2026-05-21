---
title: "Organizations"
template: "[[organizations.njk]]"
templatePath: "views/organisms/figure/organizations.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "component"
atomicLevel: "organism"
status: "active"
tags:
  - eleventy
  - nunjucks
  - template
  - obsidian
  - component
  - organism
---
# Organizations

Reusable presentational component.

## Template

- Source: [[organizations.njk]]
- Path: `views/organisms/figure/organizations.njk`

## Purpose

Encapsulates a reusable organism per the project's atomic design conventions.

## Role in the System

Classified as a **component** at the atomic **organism** level based on its location under `views/`.

## Data and Context

No obvious data dependencies identified from the template alone.

## Relationships

- Includes:
  - [[industry.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
