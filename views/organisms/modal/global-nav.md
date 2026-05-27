---
title: "Global Nav"
template: "[[global-nav.njk]]"
templatePath: "views/organisms/modal/global-nav.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "component"
atomicLevel: "organism"
status: "active"
tags:
  - "#eleventy"
  - "#nunjucks"
  - "#template"
  - "#obsidian"
  - "#component"
  - "#organism"
  - "#atomic-design"
links:
  - "[hamburger](atoms/icon/hamburger.njk)"
  - "[mega-menu](../navigation/mega-menu.md)"
  - "[close](../../atoms/button/close.md)"

---
# Global Nav

Reusable presentational component.

## Template

- Source: [[global-nav.njk]]
- Path: `views/organisms/modal/global-nav.njk`

## Purpose

Encapsulates a reusable organism per the project's atomic design conventions.

## Role in the System

Classified as a **component** at the atomic **organism** level based on its location under `views/`.

## Data and Context

No obvious data dependencies identified from the template alone.

## Relationships

- Includes:
  - [[hamburger.njk]]
  - [[mega-menu.njk]]
  - [[close.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
