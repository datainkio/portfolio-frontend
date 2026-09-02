---
description: "Reusable partial included by layouts or pages."
type: template
---

# Social

Reusable partial included by layouts or pages.

## Template

- Source: [[social.njk]]
- Path: `views/templates/partials/social.njk`

## Purpose

Emits SEO and social-sharing `<meta>` tags: description, keywords, canonical URL, Open Graph, and Twitter card fields.

## Role in the System

Classified as a **partial** at the atomic **template** level based on its location under `views/`.

## Data and Context

- `metaDescription`, `metaKeywords`, `canonicalUrl`, `author` — page-level SEO fields, all optional except `author` (defaults to `"Site Author"`).
- `ogTitle`, `ogDescription`, `ogImage`, `ogUrl` — Open Graph fields, all optional.
- `twitterTitle`, `twitterDescription`, `twitterImage`, `twitterSite` — Twitter card fields, all optional.

## Relationships

- Likely used by:
  - [[head.njk|templates/partials/head.njk]]

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
