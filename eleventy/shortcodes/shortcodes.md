---
description: "Barrel that registers all shortcodes (lorem generators + image picture) with 11ty."
status: stable
tags:
  - shortcodes
aliases:
  - Shortcodes barrel
links:
  - "[[README.shortcodes]]"
  - "[[loremipsatron]]"
---

# Shortcodes barrel

Single registration surface for shortcodes; imported by [[eleventy.config]].

## Registers

| Shortcode                 | Source                      |
| ------------------------- | --------------------------- |
| `loremChars`, `loremPars` | [[loremipsatron]]           |
| `picture`                 | [[image\|shortcodes/image]] |

## Source

- Path: `eleventy/shortcodes/shortcodes.js`
