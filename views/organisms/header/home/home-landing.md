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
  - atomic-design
  - component
  - eleventy
  - nunjucks
  - Obsidian
  - organism
  - preloader
  - template
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

## Header roles

After the preloader hands off (`preloader:out`), the header is a **three-role state
machine** driven by `data-header-role` on the root `<header>`:
`loader` (initial) → `hero` → `menu`. The roles and their behaviour are owned by
[[HomeHeaderManager|../../../../js/choreography/managers/HomeHeaderManager/HomeHeaderManager]];
this template only declares the **CSS** that responds to the attribute.

- **Per-role layout:** the `header` class-variants object keys a full layout per
  role under `data-[header-role=…]:` (loader/hero = centred full-width lockup; menu
  = left rail). Child elements (hanko, hgroup, heading, subtitle) take
  `group-data-[header-role=menu]:` classes to position/size for the rail.
- **Menu role is a side drawer at base–md.** The menu role rests **collapsed**
  (`w-12` left rail, `overflow-hidden`) and expands to full-screen when
  [[HomeHeaderManager|../../../../js/choreography/managers/HomeHeaderManager/HomeHeaderManager]]
  flips `data-drawer="open"` (a tap anywhere in the header). The expanded width
  override is keyed `data-[header-role=menu]:data-[drawer=open]:max-lg:w-full`. The
  whole drawer is gated `max-lg:`; at **lg+** the menu role is a static `w-48` rail
  and `data-drawer` is inert. **While collapsed the header content is not
  displayed** — both the hgroup and the nav are `hidden` (each via
  `max-lg:group-data-[header-role=menu]…` with a `…:group-data-[drawer=open]:block`
  override), so the rail is empty until expanded.
- **Nav:** `page-nav` is `hidden`, revealed in the menu role at lg+
  (`lg:group-data-[header-role=menu]:block`) and, at base–md, only while the drawer
  is open (`group-data-[header-role=menu]:group-data-[drawer=open]:block`). The
  `<header>` carries `group`.

The `h1`/subtitle render their real text in **all** roles (a per-role brand-text
swap was prototyped via `::before`/`attr()` data attributes, then abandoned — too
much complexity for the UX, and it cost the heading's crawlable/accessible text).

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
- **Keep `cursor-pointer` on the menu-role drawer in both collapsed and expanded
  states.** WebKit (iOS Safari/Chrome) only fires a `click` on a non-interactive
  element when the tapped target computes `cursor: pointer`. The drawer toggle
  (`HomeHeaderManager`) listens for `click` on the whole `<header>`, so `cursor`
  must stay `pointer` (it inherits to descendants) for taps in the **expanded**
  drawer to collapse it on iOS. Do not override it to `cursor-default`/`auto` at
  `max-lg`.

## Open Questions

- Should the hgroup pick up explicit hero typography here, or inherit from a section style?
