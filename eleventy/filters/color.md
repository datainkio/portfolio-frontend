---
id: frontend.eleventy.filters.color
role: "Color math filters: multiply-blend two hex colors and convert between hex and RGB."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Color filters"
tags:
  - eleventy
  - filters
links:
  - "[[README.filters]]"
  - "[[filters]]"
---

# Color filters

Hex/RGB color math for templates — used to precompute blended gel/background tints at
build time.

| Filter | Purpose |
| --- | --- |
| `multiplyBlend(hexA, hexB)` | multiply-blend two hex colors |
| `hexToRgb(hex)` | hex → `{r,g,b}` |
| `rgbToHex({r,g,b})` | RGB → hex |

## Source

- Path: `eleventy/filters/color.js`
