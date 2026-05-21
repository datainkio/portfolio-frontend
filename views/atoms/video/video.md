---
title: "Video"
template: "[[video.njk]]"
templatePath: "views/atoms/video/video.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "component"
atomicLevel: "atom"
status: "active"
tags:
  - eleventy
  - nunjucks
  - template
  - obsidian
  - component
  - atom
---
# Video

Defines Nunjucks macro: `render`.

## Template

- Source: [[video.njk]]
- Path: `views/atoms/video/video.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **atom** level based on its location under `views/`.

## Data and Context

- `params` — referenced in the template.
- `video` — referenced in the template.

## Relationships

- Imports:
  - [[video.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
