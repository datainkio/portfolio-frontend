---
id: frontend.cms.queries.organizations
role: "GROQ query definition registered as an Eleventy collection (Organizations)."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Organizations query"
tags:
  - "#frontend/cms"
  - "#frontend/cms/queries"
links:
  - "[[README.queries]]"
  - "[[organizationProjection]]"
---

# Organizations query

GROQ query definition fetched by the service layer and registered as the **`organizations`** Eleventy
collection.

| Export | Collection id |
| --- | --- |
| `organizationsQuery` | `organizations` |
- Projection: [[organizationProjection]]

## Source

- Path: `data/sanity/queries/organization/organizations.js`

Related: [[README.queries]], [[queries]]
