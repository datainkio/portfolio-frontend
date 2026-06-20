---
id: frontend.cms.transforms.organization
role: "Reserved domain transforms for organizations."
status: planned
surface: internal
scope: frontend
runtime: node
aliases:
  - "Organization transforms"
tags:
  - cms
  - transforms
links:
  - "[[README.transforms]]"
---

# Organization transforms

Pure, stateless normalization between raw Sanity results and Eleventy collections — the semantic
work GROQ can't do (URL resolution from slug trees, Portable Text → HTML, inline SVG, safe defaults).

> [!note] Intentionally minimal
> Organization URL is computed in the `organizationsQuery` GROQ projection; this file is a placeholder for future derived transforms.

## Source

- Path: `data/sanity/transforms/organization.js`

Related: [[README.transforms]]
