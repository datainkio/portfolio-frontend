---
description: "Reusable partial included by layouts or pages."
type: template
---

# Icon (favicon links)

Reusable partial included by layouts or pages.

## Template

- Source: [[icon.njk]]
- Path: `views/templates/partials/icon.njk`

## Purpose

Emits `<link>` tags for the site's favicon and app icons, including the sized icon set from `site.manifest.icons`. Distinct from the `atoms/icon.njk` SVG icon component — this partial is head-level favicon markup only.

## Role in the System

Classified as a **partial** at the atomic **template** level based on its location under `views/`.

## Data and Context

- `site.manifest.icons` — array of `{type, sizes, src}` icon descriptors.

## Relationships

- Likely used by:
  - [[head.njk|templates/partials/head.njk]]

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.
- Naming collides with [[icon.njk|atoms/icon.njk]] (unrelated component) — the atomic-design docs should note the distinction to avoid confusion when scaffolding.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
