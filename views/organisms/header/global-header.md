---
description: "Defines Nunjucks macro: render."
type: template
links:
  - "[primary-nav](../navigation/primary-nav.md)"
---

# Global Header

Defines Nunjucks macro: `render`.

## Template

- Source: [[global-header.njk]]
- Path: `views/organisms/header/global-header.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **organism** level based on its location under `views/`.

## Params

| Param           | Type                          | Description                                                                    |
| --------------- | ----------------------------- | ------------------------------------------------------------------------------ |
| `logoSvg`       | string                        | Hanko SVG markup for the home link. Without it the link shows the text "Home". |
| `classes`       | string, variant map, or array | Applied to the `<header>` through `classes`, after the header baseline.        |
| `docNo`         | string                        | Shown as "DOC {docNo}". Defaults to `00`.                                      |
| `sectionTitle`  | string                        | Text in the section cell.                                                      |
| `buildDate`     | Date                          | Passed to the build info.                                                      |
| `buildVersions` | object                        | Passed to the build info.                                                      |
| `cms`           | object                        | Passed to the primary nav.                                                     |
| `pages`         | array                         | Passed to the primary nav.                                                     |
| `currentUrl`    | string                        | Passed to the primary nav.                                                     |

## Visibility

The header ships `hidden`; `GlobalHeaderManager` removes it at runtime (cued by `hero:intro:complete` on home, immediately elsewhere). With JavaScript off, `[@media(scripting:none)]:grid` restores its display, so the header is visible without the manager.

## Relationships

- Imports:
  - [[primary-nav.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
