---
title: "Project Cards"
template: "[[project-cards.njk]]"
templatePath: "views/molecules/list/project-cards.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "component"
atomicLevel: "molecule"
status: "active"
tags:
  - eleventy
  - nunjucks
  - template
  - obsidian
  - component
  - molecule
---
# Project Cards

Defines Nunjucks macro: `render`.

## Template

- Source: [[project-cards.njk]]
- Path: `views/molecules/list/project-cards.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **molecule** level based on its location under `views/`.

## Data and Context

- `ProjectCard` — referenced in the template.

## Relationships

- Imports:
  - [[project.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
