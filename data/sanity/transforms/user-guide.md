---
id: frontend.cms.transforms.user_guide
role: "Normalize user-guide records."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "User guide transforms"
tags:
  - "#frontend/cms"
  - "#frontend/cms/transforms"
links:
  - "[[README.transforms]]"
---

# User guide transforms

Pure, stateless normalization between raw Sanity results and Eleventy collections — the semantic
work GROQ can't do (URL resolution from slug trees, Portable Text → HTML, inline SVG, safe defaults).

| Export | Purpose |
| --- | --- |
| `normalizeUserGuideRecords(records)` | shape user-guide records |

## Source

- Path: `data/sanity/transforms/user-guide.js`

Related: [[README.transforms]]
