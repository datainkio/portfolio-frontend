---
description: Template filter to resolve an image record by id from a collection.
status: stable
tags:
  - filters
aliases:
  - Image filter
links:
  - "[[README.filters]]"
  - "[[filters]]"
---

# Image filter

Lookup filter that resolves an image record from a collection by id (null-safe).

| Filter                      | Purpose                                     |
| --------------------------- | ------------------------------------------- |
| `findImage(id, collection)` | return the matching image record, or `null` |

> [!note] Filter vs shortcode
> This is the **data lookup** filter. Rendering `<picture>`/lightbox markup lives in the
> [[image\|shortcodes/image]] shortcode module.

## Source

- Path: `eleventy/filters/image.js`
