---
description: "Organization logo tile for the homepage organizations marquee: a muted Sanity logo, with the name as alt text."
type: template
---

# Organization

Defines Nunjucks macro: `render`.

## Template

- Source: [[organization.njk]]
- Path: `views/atoms/organization.njk`

## Purpose

Renders one organization as a logo tile for the homepage organizations marquee.

## Role in the System

Classified as a **component** at the atomic **atom** level based on its location under `views/`.

## Params

| Param     | Type   | Description                                                                                               |
| --------- | ------ | --------------------------------------------------------------------------------------------------------- |
| `title`   | string | Organization name, trimmed. Used as the alt text. Defaults to "Untitled organization".                    |
| `logo`    | object | Sanity logo: `asset.url` and `asset.metadata.dimensions`. Without it, the atom renders the title as text. |
| `classes` | string | Appended to the `<img>` classes through the `classes` filter.                                             |

## Behavior

- The Sanity logos are opaque 16:9 brand tiles, not transparent marks. The atom
  mutes them with `grayscale` and `opacity-60`, and restores colour on hover.
  The transition uses the motion tokens `--transition-duration-base` and
  `--ease-standard`, and is off under `motion-reduce`.
- Alt text is the organization name, not `logo.alt`: the logo communicates the
  name, and the Sanity alt values are inconsistent ("QVC Company Logo", null, …).
- The image is requested at `w=320` (2× the widest tile) through `imageUrl`. The
  `width`/`height` attributes come from the asset dimensions, so the tile
  reserves its space before it loads.

## History

- 2026-08-23 (`dc5ff743`): logos switched off; the list became text-only.
- 2026-11-15: logos restored for the marquee, muted.

## Relationships

- Used by:
  - [[organizations.njk]] (`views/organisms/section/organizations.njk`), one per marquee item

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.
