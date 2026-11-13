---
description: Normalize landing-section records for the homepage.
status: stable
tags:
  - cms
  - transforms
aliases:
  - Home transforms
links:
  - "[[data/sanity/transforms/README|transforms]]"
---

# Home transforms

Pure, stateless normalization between raw Sanity results and Eleventy collections — the semantic
work GROQ can't do (URL resolution from slug trees, Portable Text → HTML, inline SVG, safe defaults).

| Export                                | Purpose                                                                                                                                                                                                                                                                                                                   |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `normalizeLandingRecords(records)`    | shape landing records into view models; serialize value-prop/work Portable Text → HTML, map `statements[]` to `{ subheading, body (HTML), image }` for the hero, and resolve a `url` on each nested `featuredProjects` entry                                                                                              |
| `hydrateStatementInlineSvgs(records)` | async. After `normalizeLandingRecords`, adds an optional `imageInline` (the SVG markup) to each `statements[]` entry whose `image.asset.url` ends in `.svg`, fetched at build time via `fetchSvgMarkup` from [award.js](award.js). A failed fetch leaves the statement unchanged, so it falls back to the `<img>` render. |

## Featured project URLs

The `home` query embeds `featuredProjects[]` via `PROJECT_CARD_PROJECTION`, which
emits `slug`/`caseStudyUrl`/`externalLink` but **no `url`**. `normalizeLandingRecords`
maps each entry through `resolveProjectCardUrl` (from [[dataink.io/frontend/data/sanity/transforms/project|project.js]]) so the
homepage card "View More" link resolves to `/case-studies/<slug>/` — the same source
of truth used by the `projects` / `projectsByIndustry` queries. Without this step the
card's `{% if url %}` guard is never satisfied and no link renders.

## Statement inline SVGs

`hydrateStatementInlineSvgs` is the one exception to "pure": it fetches each SVG
statement image over the network at build time. `fetchSvgMarkup` caches results at
module scope in `award.js`, so a URL shared with award logos is fetched once. The
URL test is on the pathname only, since `imageUrl()` leaves SVG URLs unparameterised.
The statement then renders inline in [section-statement.njk](../../../views/molecules/section/section-statement.md).

## Source

- Path: `data/sanity/transforms/home.js`

Related: [[data/sanity/transforms/README|transforms]]
