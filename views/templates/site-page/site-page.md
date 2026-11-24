---
description: Sidecar for site-page.njk. The general-use page template.
type: template
status: stable
tags:
  - template
  - cms
---

# Site page template

Renders one `sitePage` document. Paginated by `ia/site-page.md` over `collections.sitePages`, aliased
as `sitePage`.

- Extends `layouts/base.njk`.
- `<article>` with a `<header>` (breadcrumbs from `sitePage.trail`, `<h1>`, abstract as lead
  paragraph when present), then `sitePage.bodyHtml` in a prose container.
- The prose container is a `<section aria-label="Page content">` around the serialized body HTML.
- No choreography and no page JavaScript.

Data shape: `data/sanity/transforms/sitePage.js`. Contract: `content-model/documents/pages/sitePage.md`.
