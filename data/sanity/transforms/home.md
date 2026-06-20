---
id: frontend.cms.transforms.home
role: "Normalize landing-section records for the homepage."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Home transforms"
tags:
  - "#frontend/cms"
  - "#frontend/cms/transforms"
links:
  - "[[README.transforms]]"
---

# Home transforms

Pure, stateless normalization between raw Sanity results and Eleventy collections — the semantic
work GROQ can't do (URL resolution from slug trees, Portable Text → HTML, inline SVG, safe defaults).

| Export | Purpose |
| --- | --- |
| `normalizeLandingRecords(records)` | shape landing records into view models |

## Source

- Path: `data/sanity/transforms/home.js`

Related: [[README.transforms]]
