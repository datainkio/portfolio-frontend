---
title: Industry Links
description: "Defines Nunjucks macro: render. Renders the work section's industry jumplink <ul>, hosted inside the drawer/rail <nav> on the projects page."
type: template
---

# Industry Links

Defines Nunjucks macro: `render`.

## Template

- Source: [[industry-links.njk]]
- Path: `views/molecules/list/industry-links.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **molecule** level based on its location under `views/`.

## Data and Context

- `params.industries` — dict of industry title → project list, iterated to build one `<li>` per industry.
- `params.classes` — optional extra classes appended to the `<ul>`.

## Relationships

- Used by: [projects.njk](../../pages/projects/projects.njk), inside `<nav data-projects-el="jumplinks">`.
- Imported (unused) by: [work.njk](../../organisms/section/work.njk) — homepage never calls it; this nav is projects-page-only.

## Active-state contract

Each `<a data-projects-el="industry-link">` is a scrollspy target. `WorkNavManager`
sets `aria-current="true"` on the link whose industry group is currently in view.
Active styling is **attribute-driven** — never a JS-toggled class. The `aria-current`
attribute stays on the anchor (the link is the current item); the **`<li>` owns the
visual** and reacts to its descendant via `has-[[aria-current=true]]:` utilities
(accent fill, at every width — the list is a vertical `<ul>` at every breakpoint, no
`lg:` horizontal-bar override). The anchor is prefixed with an arrow via
`aria-[current=true]:arrow-prefix` (the `arrow-prefix` utility is defined with
`@utility` in `styles/decorations.css` so Tailwind can compose variants onto it).

The `<ul>` itself carries no disclosure behavior — the enclosing `<nav>` (a sibling
concern, owned by `projects.njk` + `WorkHeaderManager`) is what opens/closes as a
drawer below `md` / rests open as a rail at `md`+. This macro's active-state wiring
(`aria-current`, `has-[[aria-current=true]]`, `arrow-prefix`) is independent of that
drawer state and unaffected by it. See
[[WorkNavManager|js/choreography/managers/WorkNavManager/WorkNavManager.md]],
[[WorkHeaderManager|js/choreography/managers/WorkHeaderManager/WorkHeaderManager.md]],
and `specs/animation/work-section-navigation.animation-spec.md`.

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
