---
id: frontend.eleventy.shortcodes.image
role: "Shortcodes that post-process picture/img markup with classes and wrap images in a lightbox modal."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Image shortcode"
tags:
  - "#frontend/eleventy"
  - "#frontend/eleventy/shortcodes"
links:
  - "[[README.shortcodes]]"
  - "[[shortcodes]]"
---

# Image shortcode

Cheerio-based shortcodes for rendering responsive images.

| Shortcode | Purpose |
| --- | --- |
| `picture(html, pictureClasses, imgClasses)` | add classes to `<picture>`/`<img>`, strip `width`/`height` to avoid CSS clipping |
| `lightbox(html, title, caption, …)` | wrap an image in a `<dialog>` modal trigger |

> [!note] Shortcode vs filter
> This renders markup. Resolving an image **record by id** is the
> [[image\|filters/image]] filter.

## Source

- Path: `eleventy/shortcodes/image.js`
