---
id: frontend.cms.transforms.project
role: "Derive project URLs and normalize project page records."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Project transforms"
tags:
  - "#frontend/cms"
  - "#frontend/cms/transforms"
links:
  - "[[README.transforms]]"
---

# Project transforms

Pure, stateless normalization between raw Sanity results and Eleventy collections — the semantic
work GROQ can't do (URL resolution from slug trees, Portable Text → HTML, inline SVG, safe defaults).

| Export | Purpose |
| --- | --- |
| `resolveProjectCardUrl(project)` | compute a card's URL |
| `addProjectUrls(records)` | attach URLs to projects |
| `addUrlsToProjectsByIndustry(records)` | attach URLs to by-industry groups |
| `normalizeProjectPageRecords(records)` | shape project page records |

## Source

- Path: `data/sanity/transforms/project.js`

Related: [[README.transforms]]
