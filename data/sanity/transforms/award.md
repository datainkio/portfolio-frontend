---
id: frontend.cms.transforms.award
role: "Hydrate award records with inline SVG logo markup."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Award transforms"
tags:
  - cms
  - transforms
links:
  - "[[README.transforms]]"
---

# Award transforms

Pure, stateless normalization between raw Sanity results and Eleventy collections — the semantic
work GROQ can't do (URL resolution from slug trees, Portable Text → HTML, inline SVG, safe defaults).

| Export | Purpose |
| --- | --- |
| `fetchSvgMarkup(url)` | fetch remote SVG markup |
| `hydrateAwardInlineLogos(records)` | inline each award's logo SVG |

## Source

- Path: `data/sanity/transforms/award.js`

Related: [[README.transforms]]
