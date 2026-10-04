---
description: Context sidecar for skip-links-nav.njk (views/organisms/navigation/skip-links-nav.njk).
type: template
---

# skip-links-nav

Context sidecar for [[skip-links-nav.njk]] (`views/organisms/navigation/skip-links-nav.njk`).

## Template

- Source: [[skip-links-nav.njk]]
- Path: `views/organisms/navigation/skip-links-nav.njk`

## Contract

- Renders on every page: `base.njk` and `home.njk` call `render()` as the first focusable element in `<body>`.
- The "Skip to main content" link targets `<main id="page-main-content" tabindex="-1">`. Not `#page-main`: that ScrollSmoother wrapper also contains the `sidebarBefore` navigation the link exists to skip, and it only exists on `smoothScroll` pages.
- `<main>` carries `#page-main-content` on every page and `tabindex="-1"` so focus lands inside it. Under ScrollSmoother, `ScrollSmootherManager`'s hash handler scrolls and focuses it; elsewhere native fragment navigation does.
- Visually hidden (`sr-only`) until focused, then shown fixed top-left at `z-30`, above the global header (`z-20`).
- `params.items` (optional): an array of section ids, rendered as an extra visually hidden list of in-page links.
