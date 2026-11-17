---
description: "The fixed top-left badge button that opens a full-bleed site-map dialog with the build info and a close button."
type: template
links:
  - "[button](../../atoms/button.md)"
  - "[icon](../../atoms/icon.md)"
  - "[hanko](../../atoms/hanko/hanko.md)"
  - "[sitemap](../navigation/sitemap.md)"
  - "[BadgeManager](../../../js/choreography/managers/BadgeManager/BadgeManager.md)"
---

# Badge

Defines Nunjucks macro: `render`. Replaced the global header on 2026-11-17.

## Template

- Source: [[badge.njk]]
- Path: `views/organisms/header/badge.njk`

## Purpose

Site chrome reduced to one control. A `<button>` fixed at the top left shows
the Hanko mark, styled like the old header's home link. It opens a native
`<dialog>`, full bleed and opaque, holding:

- a top bar with the build info ([[build-view.njk]], used as-is) and a close
  button (the `close` icon in the `icon` button variant), upper right;
- the [[sitemap.njk]] below it.

Home is reached from the site map, not from the badge.

## Role in the System

An **organism** composed of the [[button.njk]], [[icon.njk]] and
[[hanko.njk]] atoms and the [[sitemap.njk]] and [[build-view.njk]]
organisms. Rendered by [[base.njk]] and [[home.njk]], outside
`#page-main-content` so `position: fixed` holds under ScrollSmoother.

## Params

| Param           | Type   | Description                                                                 |
| --------------- | ------ | --------------------------------------------------------------------------- |
| `logoSvg`       | string | Hanko SVG markup for the badge. Without it the badge shows the text "Home". |
| `pages`         | array  | `collections.all`, passed to the site map.                                  |
| `currentUrl`    | string | Passed to the site map.                                                     |
| `buildDate`     | Date   | Passed to the build info.                                                   |
| `buildVersions` | object | Passed to the build info.                                                   |

## Behaviour

[[BadgeManager.js]] binds to `data-badge-el="toggle" | "dialog" | "close"`.
It removes `hidden` from the badge (cued by `hero:intro:complete` on home,
immediately elsewhere), hides it on scroll down and shows it on scroll up,
opens the dialog and animates the close button in. `aria-expanded` on the
badge tracks the dialog. A CSS rule in `styles/base.css` locks page scroll
while the dialog is open.

## Accessibility

- The badge is a `<button>` with `aria-label="Site map"`,
  `aria-haspopup="dialog"`, `aria-controls="badge-dialog"` and
  `aria-expanded`.
- The dialog is labelled "Site map"; the native modal traps focus, closes on
  Escape and returns focus to the badge.

## Without JavaScript

The badge stays `hidden`: it can't open the dialog without script. The
footer's primary nav still links every landing page.

## Stacking

The top bar is `relative z-10` with a `-z-10` backdrop, the arrangement the
old header used: the build-info drawer (`-z-20`) tucks behind the bar when
closed and slides out over the site map when open.

## Notes

- One instance per page: the dialog id `badge-dialog` is fixed, and
  [[build-view.njk]] carries the fixed id `build-info-list`.
