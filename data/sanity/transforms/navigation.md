---
description: Resolve hrefs/labels and normalize navigation records.
status: stable
tags:
  - cms
  - transforms
aliases:
  - Navigation transforms
links:
  - "[[README.transforms]]"
---

# Navigation transforms

Pure, stateless normalization between raw Sanity results and Eleventy collections — the semantic
work GROQ can't do (URL resolution from slug trees, Portable Text → HTML, inline SVG, safe defaults).

| Export                                | Purpose                 |
| ------------------------------------- | ----------------------- |
| `resolveNavigationHref(item)`         | compute an item's href  |
| `resolveNavigationLabel(item)`        | compute an item's label |
| `normalizeNavigationItems(items)`     | shape nav items         |
| `normalizeNavigationRecords(records)` | shape nav records       |

## Source

- Path: `data/sanity/transforms/navigation.js`

Related: [[README.transforms]]
