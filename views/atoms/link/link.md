---
description: Reusable presentational component.
type: template
links:
  - "[icon](../icon.md)"
  - "[Component API spec](../../../specs/views/component-api.views-spec.md)"
---

# Link

Reusable presentational component.

## Template

- Source: [[link.njk]]
- Path: `views/atoms/link/link.njk`

## Purpose

Encapsulates a reusable atom per the project's atomic design conventions.

## Role in the System

Classified as a **component** at the atomic **atom** level based on its location under `views/`.

## Data and Context

Params are documented in the header comment of `link.njk`: `url`, `text`, `title`, `classes`, `rel`, `ariaLabel`, `ariaCurrent`, `download`, `attrs`. Content can be passed via `{% call %}` instead of `text`.

- `classes` replaced `class` on 2026-10-02. Callers migrated: `blog.njk`, `skip-links-nav.njk`, `design-pages.njk`.
- `rel` merges with the automatic `noopener noreferrer` on external links, so the element never gets two `rel` attributes.
- Follows the [Component API spec](../../../specs/views/component-api.views-spec.md).

## Relationships

- Imports:
  - [[icon.njk|atoms/icon.njk]] (external-link indicator)
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
