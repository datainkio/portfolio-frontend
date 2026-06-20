---
id: frontend.cms.queries.siteSettings
role: "GROQ query definition registered as an Eleventy collection (Site settings)."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Site settings query"
tags:
  - cms
  - queries
links:
  - "[[README.queries]]"
  - "[[siteSettingsProjection]]"
---

# Site settings query

GROQ query definition fetched by the service layer and registered as the **`siteSettings`** Eleventy
collection.

| Export | Collection id |
| --- | --- |
| `siteSettingsQuery` | `siteSettings` |
- Projection: [[siteSettingsProjection]]

## Source

- Path: `data/sanity/queries/siteSettings/siteSettings.js`

Related: [[README.queries]], [[queries]]
