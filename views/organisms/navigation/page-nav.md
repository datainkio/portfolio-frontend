---
title: "Page Nav"
template: "[[page-nav.njk]]"
templatePath: "views/organisms/navigation/page-nav.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "component"
atomicLevel: "organism"
status: "active"
tags:
  - "#frontend/eleventy"
  - "#frontend/nunjucks"
  - "#frontend/eleventy/template"
  - "#tooling/Obsidian"
  - "#frontend/eleventy/component"
  - "#design/atomic-design/organism"
  - "#design/atomic-design"
  - "#navigation"
links:
  - "[home-landing](../header/home/home-landing.md)"
  - "[home](../../pages/home/home.md)"
---

# Page Nav

Defines Nunjucks macro: `render`. A reusable in-page section navigation rendered as
an `aria-label="Page sections"` landmark.

## Template

- Source: [[page-nav.njk]]
- Path: `views/organisms/navigation/page-nav.njk`

## Purpose

The list of jump links to the home page's primary sections. Its only consumer today
is the home landing header
([[home-landing|../header/home/home-landing]]), where it acts as the header's
**menu-role** navigation — hidden until the header enters the `menu` role, then
revealed (see "Choreography integration"). It is authored as a standalone organism
so it can be reused elsewhere without that header coupling.

## Macro & params

`render(params = {})`:

- `params.classes` (string) — extra classes appended to the `<nav>` after the
  component's own base classes. The home caller passes layout + reveal hooks here
  (`col-start-1 hidden group-data-[header-role=menu]:block`).
- `params.init` (string) — inline `style` attribute value for the `<nav>`. A
  legacy hook for setting initial inline styles; **currently unused** by the home
  caller, which expresses the hidden/reveal state through `classes` instead (inline
  `display:none` cannot be animated/measured by GSAP, so the class approach was
  preferred — see [[HomeHeaderManager|../../../js/choreography/managers/HomeHeaderManager/HomeHeaderManager]]).

## Markup & accessibility

- Root is a `<nav>` landmark with `aria-label="Page sections"` (distinguishes it
  from other navs in the a11y tree).
- An `<ul>` of `<li>` items, one `<a>` each. `divide-y divide-slate-700` draws a
  rule between rows; **note** this means a *visible* `<ul>` with invisible links
  still paints divider lines, so the home caller hides the whole `<nav>` (not the
  links) until the menu role.
- Links are full-bleed tap targets (`block w-full h-full py-12`) for comfortable
  touch/menu use.
- Each `<li>` carries `data-page-nav-el="item"` — the choreography hook the home
  header animates (the menu-reveal stagger; see "Choreography integration"). The
  attribute decouples the JS from the list markup/classes.

## Navigation targets

| Label        | href            | Resolves to (section)              |
| ------------ | --------------- | --------------------------------- |
| Overview     | `#overview`     | home landing `<header id="overview">` |
| Dossier      | `#introduction` | Bio section                       |
| Case studies | `#work`         | Projects section                  |
| Recognition  | `#recognition`  | Awards section                    |
| Contact      | `#contact`      | Contact section                   |

The four section IDs are **injected on the home page** by `home.njk` (each
`*Section.render({ id: … })` call), not hard-coded on the section components — so
these anchors only resolve where those sections are rendered with these IDs.

## Choreography integration

In the home header the nav is hidden (`hidden`) and revealed via
`group-data-[header-role=menu]:block` when
[[HomeHeaderManager|../../../js/choreography/managers/HomeHeaderManager/HomeHeaderManager]]
flips the header's `data-header-role` to `menu`. CSS owns the display swap; on top
of it the manager's `_showNav` staggers the `<li>` items (`data-page-nav-el="item"`,
resolved via `SELECTORS.pageNavItem`) into view — each fades in and up
(`autoAlpha 0->1`, `y 24->0`, ease-out, `stagger 0.08`). Reveal **display** is not
JS-driven; only the item motion is.

## Relationships

- Imported by:
  - [[home-landing.njk]] (as `page_nav.render`)
- Anchor targets injected by:
  - [[home.njk]] (section `id`s)

## Notes for Future Maintenance

- Keep the navigation-targets table in sync with the `id`s passed in `home.njk`; an
  href here is a **dead link** unless a matching `id` is rendered on the page.
- Labels intentionally differ from section IDs (e.g. *Dossier* → `#introduction`).
  Change copy here, not the anchor.
- If the component gains an active/current state, prefer `aria-current="page"` (or
  a scroll-spy hook) over a styling-only class.

## Open Questions

- The per-item staggered reveal is wired (`data-page-nav-el="item"` → `_showNav`).
  Open: should the stagger amount/easing be a shared motion token rather than a
  literal in the manager?
- Should this stay home-specific, or take its links/targets as params for true
  reuse across pages?
