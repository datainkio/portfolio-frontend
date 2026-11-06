---
description: "Defines Nunjucks macro: render."
type: template
---

# Organization

Defines Nunjucks macro: `render`.

## Template

- Source: [[organization.njk]]
- Path: `views/atoms/organization.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **atom** level based on its location under `views/`.

## Params

| Param       | Type   | Description                                                                                                      |
| ----------- | ------ | ---------------------------------------------------------------------------------------------------------------- |
| `id`        | string | Section id. Defaults to `organizations`. Used to build the default `headingId`.                                  |
| `headingId` | string | Read into a variable but not output. Defaults to `<id>-heading`.                                                 |
| `copy`      | object | `heading` and `body` are read into variables but not rendered.                                                   |
| `title`     | string | Name shown as text. Defaults to "Untitled organization".                                                         |
| `logo`      | object | Read only for `logo.alt`. The image markup is commented out and `logo` is forced to `null`, so no image renders. |
| `logoAlt`   | string | Read as the alt fallback. No effect while the image is disabled.                                                 |
| `logoUrl`   | string | Read but not used.                                                                                               |

## Relationships

- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
