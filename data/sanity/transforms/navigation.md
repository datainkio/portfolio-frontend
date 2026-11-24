---
description: Resolve hrefs/labels and normalize navigation records.
status: stable
tags:
  - cms
  - transforms
aliases:
  - Navigation transforms
links:
  - "[[data/sanity/transforms/README|transforms]]"
---

# Navigation transforms

Pure, stateless normalization between raw Sanity results and Eleventy collections — the semantic
work GROQ can't do (URL resolution from slug trees, Portable Text → HTML, inline SVG, safe defaults).

| Export                                         | Purpose                                                                                           |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `resolveNavigationHref(item, urlById)`         | compute an item's href; `urlById` (sitePage `_id` → URL, default empty) resolves `sitePage` items |
| `resolveNavigationLabel(item)`                 | compute an item's label                                                                           |
| `normalizeNavigationItems(items, urlById)`     | shape nav items                                                                                   |
| `normalizeNavigationRecords(records, urlById)` | shape nav records                                                                                 |

`sanityService.js` normalises navigation after all queries resolve, so it can pass the `sitePages` URL
map. `documentation_landing` resolves to `/docs/`.

## Source

- Path: `data/sanity/transforms/navigation.js`

Related: [[data/sanity/transforms/README|transforms]]
