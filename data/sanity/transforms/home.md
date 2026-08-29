---
description: Normalize landing-section records for the homepage.
status: stable
tags:
  - cms
  - transforms
aliases:
  - Home transforms
links:
  - "[[README.transforms]]"
---

# Home transforms

Pure, stateless normalization between raw Sanity results and Eleventy collections — the semantic
work GROQ can't do (URL resolution from slug trees, Portable Text → HTML, inline SVG, safe defaults).

| Export                             | Purpose                                                                                                                                             |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `normalizeLandingRecords(records)` | shape landing records into view models; serialize value-prop/work Portable Text → HTML, and resolve a `url` on each nested `featuredProjects` entry |

## Featured project URLs

The `home` query embeds `featuredProjects[]` via `PROJECT_CARD_PROJECTION`, which
emits `slug`/`caseStudyUrl`/`externalLink` but **no `url`**. `normalizeLandingRecords`
maps each entry through `resolveProjectCardUrl` (from [[dataink.io/frontend/data/sanity/transforms/project|project.js]]) so the
homepage card "View More" link resolves to `/case-studies/<slug>/` — the same source
of truth used by the `projects` / `projectsByIndustry` queries. Without this step the
card's `{% if url %}` guard is never satisfied and no link renders.

## Source

- Path: `data/sanity/transforms/home.js`

Related: [[README.transforms]]
