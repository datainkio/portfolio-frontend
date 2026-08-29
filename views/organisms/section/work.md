---
description: "Defines Nunjucks macro: render."
type: template
links:
  - "[section-cap](../../molecules/section-cap.md)"
  - "[project](../../molecules/card/project.md)"
  - "[projects-by-industry](../../molecules/list/projects-by-industry.md)"
---

# Work

Defines Nunjucks macro: `render`.

## Template

- Source: [[work.njk]]
- Path: `views/organisms/section/work.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **organism** level based on its location under `views/`.

## Industry nav disclosure

There is no separate toggle button (the `directional-toggle` atom was removed). **Below `lg`** the industry list rests collapsed to its current (in-view) item, which doubles as the disclosure control — tapping the `aria-current` link expands the rest, other links navigate. The current link floats first (`max-lg:…order-first`) and shows a chevron. At `lg` and up the list rests open as a horizontal jumplink bar. Drive logic lives in [[managers.workheadermanager|WorkHeaderManager]]; see `specs/animation/work-section-navigation.animation-spec.md`.

**Stacking:** the jumplinks `<nav>` (`sticky inset-8 z-10`) needs the explicit `z-10`. Sticky alone creates no winning stacking context, so the positioned industry-section blocks and project cards (shadow/outline, their own stacking) paint over the sticky nav and swallow pointer events on the links — the nav looks present but is unclickable. Keep `z-10` (or higher than the cards) on the nav.

## Data and Context

- `Card` — referenced in the template.
- `ProjectsByIndustry` — referenced in the template.
- `SectionCap` — referenced in the template.
- `industryTitle` — referenced in the template.

## Relationships

- Imports:
  - [[section-cap.njk]]
  - [[project.njk]]
  - [[projects-by-industry.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
