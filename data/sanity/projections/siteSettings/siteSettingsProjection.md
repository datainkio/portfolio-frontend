---
id: frontend.cms.projections.siteSettingsProjection
role: "GROQ projection fragment — reusable field shape for Site settings documents."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Site settings projection"
tags:
  - "#frontend/cms"
  - "#frontend/cms/projections"
links:
  - "[[README.projections]]"
---

# Site settings projection

GROQ projection fragment — the reusable `{ ... }` field shape selected for **site settings**
documents. Extracted into its own file so queries stay thin and shapes compose consistently.

| Export | Shape of |
| --- | --- |
| `SITE_SETTINGS_PROJECTION` | site settings fields |

## Source

- Path: `data/sanity/projections/siteSettings/siteSettingsProjection.js`

Related: [[README.projections]]
