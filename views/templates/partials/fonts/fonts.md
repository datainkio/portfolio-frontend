---
description: Reusable partial included by layouts or pages.
type: template
---

# fonts.njk

Reusable partial included by layouts or pages. Supplies the inline pre-paint script as part of the #preloader strategy; on return visits (gating on) reads sessionStorage.dataink_session.visited and sets data-preloader-state="exit" before first paint. ^79a140

## Template

- Source: [[fonts.njk]]
- Path: `views/templates/partials/fonts.njk`

## Purpose

Provides a focused fragment intended to be included by larger templates.

## Role in the System

Classified as a **partial** at the atomic **template** level based on its location under `views/`.

## Data and Context

No obvious data dependencies identified from the template alone.

## Relationships

- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
