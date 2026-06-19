---
title: "Projects By Industry"
template: "[[projects-by-industry.njk]]"
templatePath: "views/molecules/list/projects-by-industry.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "component"
atomicLevel: "molecule"
status: "active"
tags:
  - "#frontend/eleventy"
  - "#frontend/nunjucks"
  - "#frontend/eleventy/template"
  - "#tooling/Obsidian"
  - "#frontend/eleventy/component"
  - "#design/atomic-design/molecule"
  - "#design/atomic-design"
---
# Projects By Industry

Defines Nunjucks macro: `render`.

## Template

- Source: [[projects-by-industry.njk]]
- Path: `views/molecules/list/projects-by-industry.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **molecule** level based on its location under `views/`.

## Data and Context

- `industryTitle` — referenced in the template.

## Relationships

- Likely used by:
  - Unknown

## Active-state contract

Each `<a data-projects-el="industry-link">` is a scrollspy target. `WorkNavManager`
sets `aria-current="true"` on the link whose industry group is currently in view.
Active styling is **attribute-driven** via `aria-[current=true]:` utilities in the
anchor base — never a JS-toggled class. See
[[WorkNavManager|js/choreography/managers/WorkNavManager/WorkNavManager.md]] and
`specs/animation/work-section-navigation.animation-spec.md`.

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
