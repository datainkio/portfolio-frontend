---
title: "Project"
template: "[[project.njk]]"
templatePath: "views/molecules/card/project.njk"
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
links:
  - "[card](card.md)"
---
# Project

Defines Nunjucks macro: `render`.

## Template

- Source: [[project.njk]]
- Path: `views/molecules/card/project.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **molecule** level based on its location under `views/`.

## Data and Context

- `Card` — referenced in the template.
- `project.featuredImage` — mapped to the card's `image` param.
- `project.featuredVideo` — mapped to the card's `video` param. Optional; when absent the card renders the still. Both are passed through, because the card needs the image as the video's poster.

## Relationships

- Imports:
  - [[card.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
