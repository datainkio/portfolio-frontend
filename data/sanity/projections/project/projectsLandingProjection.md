---
description: "GROQ projection fragment — reusable field shape for Projects landing documents."
status: stable
tags:
  - cms
  - projections
aliases:
  - Projects landing projection
links:
  - "[[README.projections]]"
---

# Projects landing projection

GROQ projection fragment — the reusable `{ ... }` field shape selected for **projects landing**
documents. Extracted into its own file so queries stay thin and shapes compose consistently.

| Export                        | Shape of                |
| ----------------------------- | ----------------------- |
| `PROJECTS_LANDING_PROJECTION` | projects landing fields |

## Fields of note

- `pageVideo` — dereferenced `videoAsset`: `url` (uploaded file) or `videoUrl` (external), `mimeType`, `alt`, `poster { url, alt }`, `mask` (alpha-mask PNG URL, `null` when unset), and the playback defaults `loop`, `muted`, `autoplay`. Same shape as `featuredVideo`, plus `mask`, in [projectCardProjection](projectCardProjection.md). `null` when unset.

## Source

- Path: `data/sanity/projections/project/projectsLandingProjection.js`

Related: [[README.projections]]
