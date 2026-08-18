---
id: frontend.cms.projections.projectCardProjection
role: "GROQ projection fragment — reusable field shape for Project card documents."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Project card projection"
tags:
  - cms
  - projections
links:
  - "[[README.projections]]"
---

# Project card projection

GROQ projection fragment — the reusable `{ ... }` field shape selected for **project card**
documents. Extracted into its own file so queries stay thin and shapes compose consistently.

| Export | Shape of |
| --- | --- |
| `PROJECT_CARD_PROJECTION` | project card fields |

## Media fields

The card resolves two media fields, and the still is never optional:

- `featuredImage` — dereferenced `imageAsset`. Always present (schema-required on `project`). Supplies the `<img>` in the default case and the `poster` attribute when a video is present.
- `featuredVideo` — dereferenced `videoAsset`, optional. Flattens the file asset to `url` + `mimeType`, carries `videoUrl` for externally hosted video, and resolves its own optional `poster` image. Playback defaults (`loop`, `muted`, `autoplay`) come through as booleans; the card treats anything other than an explicit `false` as on.

Poster precedence in the template is `featuredVideo.poster.url` → `featuredImage` asset URL.

## Source

- Path: `data/sanity/projections/project/projectCardProjection.js`

Related: [[README.projections]]
