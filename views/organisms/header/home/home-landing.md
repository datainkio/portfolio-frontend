---
title: "Home Landing"
template: "[[home-landing.njk]]"
templatePath: "views/organisms/header/home/home-landing.njk"
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
  - "#preloader"
links:
  - "[hanko](../../../atoms/hanko/hanko.md)"
  - "[home](../../../pages/home/home.md)"
---

# Home Landing

Defines Nunjucks macro: `home_landing`. Replaces the retired `SitePreloader` organism.

## Template

- Source: [[home-landing.njk]]
- Path: `views/organisms/header/home/home-landing.njk`

## Purpose

The landing header for the home page. Its root `<header>` carries `data-preloader`,
so it **is** the preloader: the choreography/preloader runtime (`js/preloader/`)
targets it. During load it is a fixed full-screen overlay showing only the animated
hanko (loading indicator); on the outro it persists — it is never removed — and
becomes the page's in-flow hero.

## Motion contract

The whole intro → idle → outro sequence is **pure CSS** (`styles/components/hanko.css`),
no GSAP on this path, to keep the critical-path payload light.

- **Intro + idle:** the hanko (`.hanko-mount`) rises/fades in, then breathes as a
  loading pulse. Runs on load, independent of state.
- **hgroup hidden:** the `[data-preloader-el="hgroup"]` (name + role) is held at
  `opacity: 0` until the outro — scoped to `prefers-reduced-motion: no-preference`
  so reduced-motion users see it by default.
- **Outro:** `js/preloader/animations.js` flips `data-preloader-state="exit"` on the
  root at readiness. Off that single flip, CSS: (1) settles the hanko paths to full
  opacity; (2) **FLIPs the hanko from screen-centre into real document flow** — it
  drops absolute centring (`position: absolute; inset: 0; margin: auto`) to become
  the header's first in-flow flex child, starts at the invert offset
  (`--hanko-flip-from-x`), and tweens its `transform` to identity, landing as a plain
  in-flow block with no jump; (3) reveals the hgroup (reusing `hanko-enter`), delayed
  by `--hanko-move-duration` so it appears as the mark lands; and (4) drops the fixed
  overlay and switches the header to `justify-content: flex-start`, so the
  [mark + hgroup] settle into a **left-aligned, vertically-centred hero lockup** in
  normal flow. The hgroup's `animationend` ends the outro and triggers `preloader:out`.
  Under reduced motion (`animation`/`transition` forced off) every step is instant —
  the lockup simply appears in its final in-flow position.

## Header roles & brand text

After the preloader hands off (`preloader:out`), the header is a **three-role state
machine** driven by `data-header-role` on the root `<header>`:
`loader` (initial) → `hero` → `menu`. The roles and their behaviour are owned by
[[HomeHeaderManager|../../../../js/choreography/managers/HomeHeaderManager/HomeHeaderManager]];
this template only declares the **CSS** that responds to the attribute.

- **Per-role layout:** the `header` class-variants object keys a full layout per
  role under `data-[header-role=…]:` (loader/hero = centred full-width grid lockup;
  menu = `w-1/6` left rail).
- **Brand text swap:** the `h1` and subtitle are **empty elements** that carry
  both strings as data attributes — `data-label` (full) and `data-label-menu`
  (`RSL` / `UX/DX/AIX`). CSS renders them via a `::before` pseudo-element
  (`before:content-[attr(data-label)]`), switching to `data-label-menu` in the
  `menu` role (`group-data-[header-role=menu]:before:content-[attr(data-label-menu)]`).
  This keeps the DOM free of variant spans. **Tradeoff:** `::before` text is not
  crawled by search engines and is inconsistently announced by screen readers, so
  the `h1`'s name (`Russell Lebo`) is no longer in indexable/guaranteed-accessible
  text — revisit if SEO/a11y of the heading matters.
- **Nav:** `page-nav` is `hidden` until the `menu` role, revealed via
  `group-data-[header-role=menu]:block` (the `<header>` carries `group`).

`data-header-role` is distinct from `data-preloader-state` (below), which the
preloader runtime owns for the loader's internal phases.

## Data and Context

- `Hanko` — imported atom; renders the inlined brand SVG into `.hanko-mount`.
- `params.svg` — inlined brand logo markup (`inlineSvgFromUrl`), passed by `home.njk`.

## Relationships

- Imports:
  - [[hanko.njk]]
- Used by:
  - [[home.njk]] (as `PageHeader.home_landing`)

## Notes for Future Maintenance

- Keep this sidecar in sync when the macro signature or the `data-preloader*` hooks change.
- The motion contract is split across `styles/components/hanko.css` (CSS) and
  `js/preloader/{animations,constants,Preloader}.js` (the state flip + lifecycle).
  Update both sides together.
- Path IDs (`#data`, `#ink`, `#input`, `#output`, `#frame`) must survive SVG inlining
  for the pulse/settle to work.

## Open Questions

- Should the hgroup pick up explicit hero typography here, or inherit from a section style?
