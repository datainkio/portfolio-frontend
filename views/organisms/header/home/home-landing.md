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
  root at readiness. CSS then (1) settles the hanko to full opacity, (2) reveals the
  hgroup reusing the hanko's `hanko-enter` keyframe, delayed by the settle duration,
  and (3) drops the fixed overlay so the header sits in normal flow. The hgroup's
  `animationend` ends the outro and triggers `preloader:out`.

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
