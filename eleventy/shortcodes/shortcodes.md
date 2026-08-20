---
id: frontend.eleventy.shortcodes.shortcodes
role: "Barrel that registers all shortcodes (lorem generators + image picture/lightbox) with 11ty."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Shortcodes barrel"
system: "Eleventy"
tags:
  - shortcodes
links:
  - "[[README.shortcodes]]"
  - "[[loremipsatron]]"
---

# Shortcodes barrel

Single registration surface for shortcodes; imported by [[.eleventy]].

## Registers

| Shortcode | Source |
| --- | --- |
| `loremChars`, `loremPars` | [[loremipsatron]] |
| `picture`, `lightbox` | [[image\|shortcodes/image]] |

## Source

- Path: `eleventy/shortcodes/shortcodes.js`
