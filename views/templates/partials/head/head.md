---
description: "The `<head>` partial — title, render-blocking stylesheet, social/manifest/favicon/font partials, a build-only `modulepreload` for the choreography bundle, then the pre-paint session script and the preloader bootstrap module."
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

One place for document metadata, the critical stylesheet, resource hints, and the two head scripts the preloader strategy depends on. Layouts and standalone pages include it wholesale rather than assembling their own `<head>`.

## What it emits, in document order

1. ### charset, viewport, title
   `charset`, `viewport`, `<title>{{ title }}</title>` ^f64d29
2. ### styles.css (rel: preload)
   `styles.css` — `<link rel="preload" as="style">` ^e239e1
3. ### styles.css (rel: stylesheet)
   `styles.css` - `<link rel="stylesheet">` ^8e23d7
4. ### social.njk
   `{% include "templates/partials/social/social.njk" %}` — meta description/keywords, author, canonical, Open Graph ^7f1918
5. ### manifest.njk
   `{% include "templates/partials/manifest/manifest.njk" %}` — web-app manifest + theme colours ^312247
6. ### favicon.njk
   `{% include "templates/partials/favicon/favicon.njk" %}` — icon set from `site.manifest.icons` ^55bf78
7. ### fonts.njk
   `{% include "templates/partials/fonts/fonts.njk" %}` — preconnects, Google Fonts (Plex render-blocking, Cormorant `media="print"`), `DRAFTPAPER.woff2` preload
8. ### bundle.js
   `<link rel="modulepreload" href="/assets/js/choreography/bundle.js">` — **conditional**: only when `enableChoreography and runtime.bundleJs and eleventy.env.runMode == "build"`. Warms the bundle early because `director:ready` gates the hero reveal (LCP). Deliberately off in `serve`/`watch`, where the bundle is a multi-MB sourcemapped artifact — so dev timings show the bundle fetch starting at the body-end `import()`, not here. ^40856c
9. ### scripts block
   `{{ scripts | safe }}` — page-supplied head scripts, unescaped ^8437d2
10. ### session-management-script.njk
    `{% include "templates/partials/session-management-script/session-management-script.njk" %}` — inline, synchronous pre-paint script; on a return visit hides `[data-preloader]` before first paint ^899a04
11. ### preloader-script.njk
    `{% include "templates/partials/preloader-script/preloader-script.njk" %}` — `<script type="module">` that imports `Preloader.js` and calls `initPreloader()` (deferred; runs after parse) ^867de8
12. ### extraHeadContent block
    `{% block extraHeadContent %}{% endblock %}` — extension point for pages that extend the layout ^4c3622

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

- `social.njk` — `metaDescription`, `metaKeywords`, `author`, `canonicalUrl`, `ogTitle`, `ogDescription`, `ogImage`, `ogUrl`
- `manifest.njk`, `favicon.njk` — `site.manifest.*`

## Relationships

- Includes:
  - [social.njk](../social/social.njk)
  - [manifest.njk](../manifest/manifest.njk)
  - [favicon.njk](../favicon/favicon.njk)
  - [fonts.njk](../fonts/fonts.njk)
  - [session-management-script.njk](../session-management-script/session-management-script.njk)
  - [preloader-script.njk](../preloader-script/preloader-script.njk)
- Used by:
  - [base.njk](../../../layouts/base.njk) — `{% include "templates/partials/head/head.njk" %}`
  - [home.njk](../../../pages/home/home.njk) — standalone page, includes it directly
- Related:
  - [choreography-script.njk](../choreography-script/choreography-script.njk) — the body-end counterpart that actually evaluates the bundle the `modulepreload` warms
  - [gtm-script.njk](../gtm-script/gtm-script.njk) — **no longer included here**; the earlier revision of this sidecar listed it

## Notes for Future Maintenance

- Order matters. The stylesheet must stay ahead of the inline session script (a classic `<script>` blocks on pending CSS), and the session script must stay ahead of the preloader module so `hidden` is set before `initPreloader()` can observe it.
- `Preloader.js` imports five modules (lumberjack, events, SessionManager, constants, deferred-videos) with no `modulepreload` hints — two serial round trips before `initPreloader` runs. If that becomes a target, the hints belong here, next to the bundle's.
- The `modulepreload` guard is intentional; do not remove the `runMode == "build"` clause to "fix" dev timings.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.
