---
description: "Defines Nunjucks macro: render."
type: template
---

# Category

Defines Nunjucks macro: `render`.

## Template

- Source: [[category.njk]]
- Path: `views/molecules/card/category.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **molecule** level based on its location under `views/`.

## Params

| Param             | Type    | Description                                                                                                                  |
| ----------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `category`        | object  | `slug` (used as the article `id`), `title` (the heading), and `projects` (project ids, looked up in `collections.projects`). |
| `collections`     | object  | Lookup source. Reads `projects` and `awards` collections.                                                                    |
| `maxProjects`     | number  | Number of project titles listed. Defaults to 3.                                                                              |
| `showRecognition` | boolean | Shows a "Recognition" list of the awards on the category's projects. Defaults to `true`.                                     |
| `showOutcomes`    | boolean | Shows an "Outcomes" heading. No content follows it. Defaults to `true`.                                                      |

Fixed design: takes no styling params.

## Relationships

- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
