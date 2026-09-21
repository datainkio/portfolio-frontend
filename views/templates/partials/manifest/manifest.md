---
description: "Reusable partial included by layouts or pages."
type: template
---

# Manifest

Reusable partial included by layouts or pages.

## Template

- Source: [[manifest.njk]]
- Path: `views/templates/partials/manifest.njk`

## Purpose

Emits the web app manifest link and PWA-related meta tags (theme color, light/dark variants, application name, apple-mobile-web-app tags).

## Role in the System

Classified as a **partial** at the atomic **template** level based on its location under `views/`.

## Data and Context

- `site.manifest.theme_color`, `site.manifest.theme_color_dark` — theme color meta values.
- `site.manifest.short_name` — application name.

## Relationships

- Likely used by:
  - [[head.njk|templates/partials/head.njk]]

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
