---
description: "Defines Nunjucks macro: render."
type: template
tags:
  - navigation
links:
  - "[home](../../pages/home/home.md)"
---

# Page Nav

Defines Nunjucks macro: `render`. A reusable in-page section navigation rendered as
an `aria-label="Page sections"` landmark.

## Template

- Source: [[page-nav.njk]]
- Path: `views/organisms/navigation/page-nav.njk`

## Purpose

The list of jump links to the home page's primary sections. It currently has **no
live caller**: its original consumer, the home landing header, was removed along
with HomeHeaderManager (2026-10-05), and the call in `project.njk` is commented out.
It is authored as a standalone organism so it can be reused without header coupling.

## Macro & params

`render(params = {})`:

- `params.classes` (string) — extra classes appended to the `<nav>` after the
  component's own base classes.
- `params.init` (string) — inline `style` attribute value for the `<nav>`. A
  legacy hook for setting initial inline styles; prefer `classes` (inline
  `display:none` cannot be animated/measured by GSAP).

## Markup & accessibility

- Root is a `<nav>` landmark with `aria-label="Page sections"` (distinguishes it
  from other navs in the a11y tree).
- An `<ul>` of `<li>` items, one `<a>` each. `divide-y divide-slate-700` draws a
  rule between rows; **note** this means a _visible_ `<ul>` with invisible links
  still paints divider lines, so a caller that needs it hidden should hide the
  whole `<nav>`, not the links.
- Links are full-bleed tap targets (`block w-full h-full py-8`) for comfortable
  touch/menu use.

## Navigation targets

| Label         | href             | Resolves to (section) |
| ------------- | ---------------- | --------------------- |
| Manifesto     | `#manifesto`     | Hero section          |
| Dossier       | `#work`          | Work section          |
| Organizations | `#organizations` | Organizations section |
| Recognition   | `#awards`        | Awards section        |
| Contact       | `#contact`       | Contact section       |

The section IDs are **injected on the home page** by `home.njk` (each
`*Section.render({ id: … })` call), not hard-coded on the section components — so
these anchors only resolve where those sections are rendered with these IDs.

## Choreography integration

None. The menu-role reveal (`group-data-[header-role=menu]:block`) and the
`data-page-nav-el="item"` stagger hook were removed with HomeHeaderManager on
2026-10-05.

## Relationships

- Imported by: nothing live (`project.njk` has a commented-out call).
- Anchor targets injected by:
  - [[home.njk]] (section `id`s)

## Notes for Future Maintenance

- Keep the navigation-targets table in sync with the `id`s passed in `home.njk`; an
  href here is a **dead link** unless a matching `id` is rendered on the page.
- Labels intentionally differ from section IDs (e.g. _Dossier_ → `#work`).
  Change copy here, not the anchor.
- If the component gains an active/current state, prefer `aria-current="page"` (or
  a scroll-spy hook) over a styling-only class.

## Open Questions

- Keep, wire into a page, or delete? It has no caller today.
- Should it take its links/targets as params for true reuse across pages?
