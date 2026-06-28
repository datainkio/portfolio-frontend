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
  - atomic-design
  - component
  - eleventy
  - molecule
  - nunjucks
  - Obsidian
  - template
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
Active styling is **attribute-driven** — never a JS-toggled class. The `aria-current`
attribute stays on the anchor (the link is the current item); the **`<li>` owns the
visual** and reacts to its descendant via `has-[[aria-current=true]]:` utilities
(accent fill at all breakpoints; `max-lg:…order-first` floats the current item to the
top of the list).

Below `lg` the current item also **doubles as the disclosure control** — there is no
separate toggle button. `WorkHeaderManager` collapses the `<ul>` to a single item's
height (the `<ul>` is `flex flex-col overflow-hidden`), so only the current item shows;
tapping it expands the rest. The anchor renders a chevron via
`max-lg:aria-[current=true]:after:content-['▾']`, flipped by
`max-lg:aria-[expanded=true]:after:rotate-180` when `WorkHeaderManager` sets
`aria-expanded`. See
[[WorkNavManager|js/choreography/managers/WorkNavManager/WorkNavManager.md]] and
`specs/animation/work-section-navigation.animation-spec.md`.

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
