---
id: frontend.cms.queries.image_assets
role: "GROQ query definition registered as an Eleventy collection (Image assets)."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Image assets query"
tags:
  - "#frontend/cms"
  - "#frontend/cms/queries"
links:
  - "[[README.queries]]"
  - "[[featuredImageProjection]]"
---

# Image assets query

GROQ query definition fetched by the service layer and registered as the **`imageAssets`** Eleventy
collection.

| Export | Collection id |
| --- | --- |
| `imageAssetsQuery` | `imageAssets` |
- Projection: [[featuredImageProjection]]

## Source

- Path: `data/sanity/queries/image/image-assets.js`

Related: [[README.queries]], [[queries]]
