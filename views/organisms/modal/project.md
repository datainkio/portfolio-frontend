---
title: "Project"
template: "[[project.njk]]"
templatePath: "views/organisms/modal/project.njk"
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
  - "[organizations](../../molecules/list/organizations.md)"
  - "[roles](../../molecules/list/roles.md)"
  - "[awards](../../molecules/list/awards.md)"
  - "[gallery](../content/gallery.md)"
  - "[project-nav](../../molecules/input/project-nav.md)"

---
# Project

Reusable presentational component.

## Template

- Source: [[project.njk]]
- Path: `views/organisms/modal/project.njk`

## Purpose

Encapsulates a reusable organism per the project's atomic design conventions.

## Role in the System

Classified as a **component** at the atomic **organism** level based on its location under `views/`.

## Data and Context

- `project` — referenced in the template.

## Relationships

- Includes:
  - [[organizations.njk]]
  - [[roles.njk]]
  - [[awards.njk]]
  - [[gallery.njk]]
  - [[project-nav.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
