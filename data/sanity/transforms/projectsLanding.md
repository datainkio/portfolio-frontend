---
id: frontend.cms.transforms.projectsLanding
role: "Normalize records for the projects landing page."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Projects landing transforms"
tags:
  - cms
  - transforms
links:
  - "[[README.transforms]]"
---

# Projects landing transforms

Pure, stateless normalization between raw Sanity results and Eleventy collections — the semantic
work GROQ can't do (URL resolution from slug trees, Portable Text → HTML, inline SVG, safe defaults).

| Export | Purpose |
| --- | --- |
| `normalizeProjectsLandingRecords(records)` | shape projects-landing records |

## Source

- Path: `data/sanity/transforms/projectsLanding.js`

Related: [[README.transforms]]
