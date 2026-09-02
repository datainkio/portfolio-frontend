---
description: Shortcode that post-processes picture/img markup with classes.
status: stable
tags:
  - shortcodes
aliases:
  - Image shortcode
links:
  - "[[README.shortcodes]]"
  - "[[shortcodes]]"
---

# Image shortcode

Cheerio-based shortcode for rendering responsive images.

| Shortcode                                   | Purpose                                                                          |
| ------------------------------------------- | -------------------------------------------------------------------------------- |
| `picture(html, pictureClasses, imgClasses)` | add classes to `<picture>`/`<img>`, strip `width`/`height` to avoid CSS clipping |

For a lightbox/modal image viewer, use the [[lightbox|molecules/lightbox/lightbox]] molecule instead — the `lightbox` shortcode was removed (it duplicated that component with a more brittle implementation).

> [!note] Shortcode vs filter
> This renders markup. Resolving an image **record by id** is the
> [[image\|filters/image]] filter.

## Source

- Path: `eleventy/shortcodes/image.js`
