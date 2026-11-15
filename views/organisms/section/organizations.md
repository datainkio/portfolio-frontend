---
description: "Organizations section: logo rows grouped by organization type, each row a marquee when it overflows."
type: template
links:
  - "[section-cap](../../molecules/section-cap.md)"
  - "[organization](../../atoms/organization.md)"
  - "[button](../../atoms/button.md)"
---

# Organizations

Defines Nunjucks macro: `render`.

## Template

- Source: [[organizations.njk]]
- Path: `views/organisms/section/organizations.njk`

## Purpose

Shows the kinds of organizations Russ works with. Logos are grouped into one
labelled row per `organizationType`, so scope, scale and sector read at a glance.

## Role in the System

Classified as a **component** at the atomic **organism** level based on its location under `views/`.

## Params

| Param           | Type   | Description                                                                                                                    |
| --------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `id`            | string | Section id. Defaults to `organizations`.                                                                                       |
| `classes`       | string | Read into a variable but never applied to the `<section>`. No effect.                                                          |
| `copy`          | object | `heading` (`h2`, defaults to "Organizations"), `subheading` (read but not rendered), and `body` (paragraph under the heading). |
| `order`         | string | Read but not used.                                                                                                             |
| `headingId`     | string | Id for the heading and `aria-labelledby`. Defaults to the section id.                                                          |
| `organizations` | array  | Each item is passed as the params of `atoms/organization.njk`. Shows "No organizations found." when empty.                     |

## Structure

- **Rows by type.** Row order and labels mirror the `organizationType` options in
  the Sanity schema (`backend/schemaTypes/documents/content/organization.ts`):
  Corporate, Non-profit, Government, Academic, Startup, Agency. Empty types are
  skipped. Organizations with no type go into a trailing "Other" row, so none
  are dropped.
- Each row is an `<li data-organizations-el="group">` with an `<h3>` label and a
  `<ul data-organizations-el="track">` labelled by it. The track sits in a
  `<div data-organizations-el="viewport">`, a non-semantic clipping box. No
  sectioning element fits there.
- **Static by default.** Tracks render as a wrapped grid. `OrganizationsAnimations`
  sets `data-marquee` on a track only when its row overflows. The Tailwind
  `data-marquee:` variants then switch it to a single scrolling line. Without
  JS, under reduced motion, or for a short row, the logos stay a static grid.
- **Pause control.** `<button data-organizations-el="toggle">` (the `dark` button
  atom) renders `hidden`. JS reveals it only while a marquee runs, because
  WCAG 2.2.2 requires a way to pause motion lasting over 5 seconds. It uses
  `aria-pressed`, and its label stays "Pause motion".
- Items carry trailing padding (`pr-3 pb-3`) rather than a flex gap, so the
  duplicated set loops seamlessly at `-50%`.

## Element hooks

| `data-organizations-el`     | Element                    |
| --------------------------- | -------------------------- |
| `header`, `heading`, `body` | Section header             |
| `toggle`                    | Pause/play button          |
| `list`                      | List of type rows          |
| `group`                     | One type row               |
| `type`                      | Row label (`h3`)           |
| `viewport`                  | Clipping box for the track |
| `track`                     | The moving list of logos   |
| `organization`              | One logo item              |

## Relationships

- Imports:
  - [[organization.njk]]
  - [[button.njk]]
- Used by:
  - `views/pages/home/home.njk`
- Motion: [[OrganizationsAnimations]], [[Organizations]], [[OrganizationsTriggers]]

## Notes for Future Maintenance

- When the "featured" boolean lands, filter `organizations` before grouping. The
  projection already fetches `featured`.
- Keep the `types` list in step with the Sanity schema options.
- Keep this sidecar documentation in sync when the template signature changes.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.
