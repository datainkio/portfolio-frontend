---
title: "Robots.txt"
template: "[[robots.txt.njk]]"
templatePath: "views/pages/_static/robots.txt.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "page"
atomicLevel: "page"
status: "active"
tags:
  - "#frontend/eleventy"
  - "#frontend/nunjucks"
  - "#frontend/eleventy/template"
  - "#tooling/Obsidian"
  - "#design/atomic-design/page"
  - "#design/atomic-design"
---
# Robots.txt

Renders a top-level Eleventy page.

## Template

- Source: [[robots.txt.njk]]
- Path: `views/pages/_static/robots.txt.njk`

## Purpose

Generates a routed page in the Eleventy build.

## Role in the System

Classified as a **page** at the atomic **page** level based on its location under `views/`.

## Data and Context

No obvious data dependencies identified from the template alone.

## Relationships

- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
