---
description: "The `<head>` partial — title, render-blocking stylesheet, `cdn.sanity.io` preconnect, the fonts partial, a build-only `modulepreload` for the choreography bundle, the page scripts block, the preloader bootstrap module, then the social/manifest/favicon metadata partials."
type: template
tags:
  - partial
  - preloader
  - performance
links:
  - "[social](../social/social.md)"
  - "[manifest](../manifest/manifest.md)"
  - "[favicon](../favicon/favicon.md)"
  - "[fonts](../fonts/fonts.md)"
  - "[session-management-script](../session-management-script/session-management-script.md)"
  - "[choreography-script](../choreography-script/choreography-script.md)"
  - "[Preloader](../../../../js/preloader/Preloader.md)"
  - "[sequence](../../../../js/preloader/sequence.canvas)"
---

# Head

^cdd333

Renders the whole `<head>` for every page. Owns the order in which head assets are discovered, which is the order the preload scanner requests them — see the merged lifecycle + asset column in [sequence.canvas](../../../../js/preloader/sequence.canvas).

## Template

- Source: [head.njk](head.njk)
- Path: `views/templates/partials/head/head.njk`

## Purpose

One place for document metadata, the critical stylesheet, resource hints, and the preloader bootstrap module. Layouts and standalone pages include it wholesale rather than assembling their own `<head>`.

## What it emits, in document order

1. ### charset, viewport, title
   `charset`, `viewport`, `<title>{{ title }}</title>` ^f64d29
2. ### styles.css
   `styles.css` — `<link rel="stylesheet">`, the only render-blocking request ^8e23d7
3. ### cdn.sanity.io preconnect
   `<link rel="preconnect" href="https://cdn.sanity.io" crossorigin>` — Sanity serves every image, poster, and video; warms the connection before the parser reaches the first asset in `<body>`
4. ### fonts.njk
   `{% include "templates/partials/fonts/fonts.njk" %}` — `DRAFTPAPER.woff2` preload (hero LCP text; URL matches the `@font-face` in `styles/typography/imports.css`, so the preload is consumed, not double-fetched) and Cormorant from Google Fonts (`media="print"` swap, non-blocking). Plex is self-hosted via `imports.css`. Sits ahead of the `bundle.js` hint so the small LCP-critical font is discovered first
5. ### bundle.js
   `<link rel="modulepreload" href="/assets/js/choreography/bundle.js">` — **conditional**: only when `enableChoreography and runtime.bundleJs and eleventy.env.runMode == "build"`. Warms the bundle early because `director:ready` gates the hero reveal (LCP). Deliberately off in `serve`/`watch`, where the bundle is a multi-MB sourcemapped artifact — so dev timings show the bundle fetch starting at the body-end `import()`, not here. ^40856c
6. ### scripts block
   `{{ scripts | safe }}` — page-supplied head scripts, unescaped ^8437d2
7. ### preloader-script.njk
   `{% include "templates/partials/preloader-script/preloader-script.njk" %}` — `<script type="module">` that imports `Preloader.js` and calls `initPreloader()` (deferred; runs after parse) ^867de8
8. ### social.njk
   `{% include "templates/partials/social/social.njk" %}` — meta description/keywords, author, canonical, Open Graph, Twitter ^7f1918
9. ### manifest.njk
   `{% include "templates/partials/manifest/manifest.njk" %}` — web-app manifest + theme colours ^312247
10. ### favicon.njk
   `{% include "templates/partials/favicon/favicon.njk" %}` — icon set from `site.manifest.icons` ^55bf78

Items 8–10 sit last per the [capo.js](https://rviscomi.github.io/capo.js/) head order: they neither block render nor feed the critical path, so they follow everything that does.

`fonts.njk` was dropped in `9d964f71` (2026-09-21) and restored 2026-09-23. Its old `cdn.sanity.io` preconnect now lives inline here (item 3).

`session-management-script.njk` is **not** here: it is a classic inline script that must see `[data-preloader]`, so `home.njk` includes it in `<body>` directly after `Preloader.render()`. ^899a04

## Role in the System

Classified as a **partial** at the atomic **template** level based on its location under `views/`. It is the top of the first-landing critical path: everything the preloader later gates on (fonts, the choreography bundle, `Preloader.js` and its module graph) is requested from here.

## Data and Context

Used directly:

- `title` — `<title>`
- `scripts` — raw head-script HTML, rendered with `| safe`
- `enableChoreography` — page frontmatter flag (see `specs/frontmatter.spec.md`)
- `runtime.bundleJs` — global data from `eleventy.config.js` (`BUNDLE_JS` env, default `true`)
- `eleventy.env.runMode` — `"build"` vs `"serve"`/`"watch"`

Consumed by the included partials, not by this file:

- `social.njk` — `metaDescription`, `metaKeywords`, `author`, `canonicalUrl`, `ogTitle`, `ogDescription`, `ogImage`, `ogUrl`, `twitterTitle`, `twitterDescription`, `twitterImage`, `twitterSite`. The home page leaves most unset or placeholder — tracked in Frontend task `fix-home-page-head-metadata-for-launch`
- `manifest.njk`, `favicon.njk` — `site.manifest.*`

## Relationships

- Includes:
  - [social.njk](../social/social.njk)
  - [manifest.njk](../manifest/manifest.njk)
  - [favicon.njk](../favicon/favicon.njk)
  - [fonts.njk](../fonts/fonts.njk)
  - [preloader-script.njk](../preloader-script/preloader-script.njk)
- Used by:
  - [base.njk](../../../layouts/base.njk) — `{% include "templates/partials/head/head.njk" %}`
  - [home.njk](../../../pages/home/home.njk) — standalone page, includes it directly
- Related:
  - [session-management-script.njk](../session-management-script/session-management-script.njk) — pre-paint return-visit check; lives in `home.njk`'s `<body>` after the preloader markup, not here
  - [choreography-script.njk](../choreography-script/choreography-script.njk) — the body-end counterpart that actually evaluates the bundle the `modulepreload` warms
  - [gtm-script.njk](../gtm-script/gtm-script.njk) — **no longer included here**; the earlier revision of this sidecar listed it

## Notes for Future Maintenance

- Order matters. `preloader-script.njk` stays after the `bundle.js` hint: as a module it executes after parse regardless of position, so moving it up buys nothing and only pushes its module-graph fetches ahead of `styles.css` and the `bundle.js` hint in discovery order. Only the non-critical metadata partials (items 8–10) follow it.
- `Preloader.js` imports five modules (lumberjack, events, SessionManager, constants, deferred-videos) with no `modulepreload` hints — two serial round trips before `initPreloader` runs. If that becomes a target, the hints belong here, next to the bundle's.
- The `modulepreload` guard is intentional; do not remove the `runMode == "build"` clause to "fix" dev timings.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.
