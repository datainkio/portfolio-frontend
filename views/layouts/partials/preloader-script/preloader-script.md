---
description: "Inline `<script type=\"module\">` that imports `Preloader.js` and calls `initPreloader()` — deferred, so it runs after parse; on the home page it gates the splash outro and dispatches `preloader:out`, elsewhere it only hydrates deferred videos."
type: template
tags:
  - preloader
  - partial
links:
  - "[[head|head.njk]]"
  - "[[session-management-script|session-management-script.njk]]"
  - "[[choreography-script|choreography-script.njk]]"
  - "[[Preloader|preloader/Preloader]]"
---
# preloader-script.njk

Included last in `head.njk`, so every page boots the preloader module.

Must stay a module script: module scripts are deferred, and `initPreloader()`
queries `[data-preloader]` and `main` — both in `<body>`. A classic inline
script here would run before they exist. Position within `<head>` does not
change when it executes (always after parse, in document order, ahead of the
body-end `choreography-script.njk` module); it only changes when the module
graph is discovered, which is why it sits after the fonts and the `bundle.js`
`modulepreload` rather than ahead of them.

`Preloader.js` imports `events.js`, `SessionManager.js`, and Lumberjack as raw
modules even in bundle mode — a small waterfall that duplicates code already in
`bundle.js`. Known; off the LCP path.

Pages without `[data-preloader]` (`/work`, `/contact`) still need this include:
`initPreloader()` returns early there, but only after `hydrateDeferredVideos()`
has given the card videos their `src`.

## Role in preloader strategy
- Boot `Preloader.js` on every page ^b0a1c2
- Home: await fonts → `director:ready` → video playing → intro settled, run the outro, dispatch `preloader:out` ^d3e4f5
- Non-home: hydrate `video[data-defer-video]` and return ^a6b7c8
