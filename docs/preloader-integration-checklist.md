---
title: "Preloader Integration Checklist"
description: "Use this checklist when modifying js/preloader/ — keeps the outro handoff deterministic, bounded, accessible, and aligned with the choreography event contracts."
type: guide
tags:
  - preloader
  - choreography
links:
  - "[[README.preloader|preloader/README.preloader]]"
  - "[[preloader-review|preloader-review]]"
---

# Preloader Integration Checklist

Use this checklist when modifying `js/preloader/`. The package README
([README.preloader.md](../js/preloader/README.preloader.md)) is the strategy —
it carries the Mermaid sequence diagram of the whole boot-to-`preloader:out`
flow; this is the pre-merge gate.

## Scope

- Bootstrap: `views/templates/partials/choreography-script/choreography-script.njk` (thin import-and-init)
- Controller: `js/preloader/Preloader.js`
- Constants: `js/preloader/constants.js`
- Deferred media: `js/preloader/deferred-videos.js`
- Markup contract: `views/organisms/header/home/home-landing.njk` (carries `data-preloader`; it is the preloader and persists as the hero) + `session-management-script.njk` (pre-paint return-visit check)
- CSS contract: `styles/components/hanko.css` (idle pulse + exit settle)

## Event contract

- [ ] Event names come from `js/choreography/config/contracts/events/events.js`; never hard-code `preloader:out` / `director:ready`.
- [ ] `preloader:out` is dispatched exactly once per load, on every path (first visit, return visit, gate timeout, thrown error).
- [ ] The `director:ready` listener is attached before any `await`.

## Markup and DOM contract

- [ ] `home-landing` renders `[data-preloader]` with a `.hanko-mount` inside it.
- [ ] `<main>` on the home page starts `aria-busy="true"`; cleanup sets it `"false"`.
- [ ] `session-management-script.njk` still mirrors `SessionManager`'s storage key and the `[data-preloader]` selector (it sets `hidden`, not `exit`) — grep both after any rename.

## Readiness and timing

- [ ] Every gate is bounded. There are four: `document.fonts.ready`, `director:ready`, the background video's `play()`, and the CSS intro. None may wait indefinitely; timeouts live in `PRELOADER_TIMINGS`.
- [ ] The outro resolves on the logo's animation `finished` **or** `outroFallbackMs`; the intro gate on the subtitle's **or** `introFallbackMs`. Both fallbacks > `--preloader-step-duration` + 2 × `--preloader-step-stagger` in `hanko.css`.
- [ ] Deferred videos are hydrated **before** the video gate (the preloader plays the sizzle itself), and on non-home pages immediately.
- [ ] The `<video>` atom carries no `loading="lazy"` — Chrome would defer the fetch while the choreography holds it invisible.

## Animation and accessibility

- [ ] Intro, idle and outro are pure CSS; JS only flips `data-preloader-state` and sets `hidden`. No GSAP on this path.
- [ ] Reduced motion: the global utility forces `animation: none`; `hanko.css` snaps the states (children visible; hidden on `exit`) and `getAnimations()` is empty so the JS gates resolve at once. Videos marked `data-motion-optional` stay posterized.
- [ ] Exit completion is idempotent (no double `preloader:out`).

## Cleanup guarantees

- [ ] Cleanup runs in `finally`: overflow restored, scroll position restored, `main[aria-busy=false]`.
- [ ] The preloader element is never removed.

## Logging

- [ ] Use the scoped Lumberjack logger; do not add a bespoke logger.
- [ ] The only unconditional console output is the director-timeout warning. Non-home pages log nothing.

## Smoke test matrix

- [ ] Choreography enabled / disabled × reduced motion off / on.
- [ ] Return visit (session storage set): no pulse flash, `preloader:out` fires immediately after readiness.
- [ ] Director script blocked (DevTools request blocking): page releases after `directorReadyTimeoutMs`, scroll works, warning logged once.
- [ ] Non-home page: no console output, deferred card videos get a `src`.

## Done criteria

- [ ] No new errors in `js/preloader/*.js`.
- [ ] Sidecars updated for every touched `.js` / `.njk`.
- [ ] Startup reaches visible, scrollable content on every path above.
