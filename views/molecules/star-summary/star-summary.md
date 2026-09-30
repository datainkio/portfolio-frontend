---
description: "Defines Nunjucks macro: render — the project STAR summary as a single <dl>."
type: template
links:
  - "[project-header](../../organisms/header/project/project-header.md)"
---

# STAR Summary

Defines Nunjucks macro: `render`. Contract: [project-page pattern § 4](../../../../content-model/patterns/project-page.md).

## Params

- `params.project`: reads `situation`, `task`, `action` and `result` (plain `text`, fetched by `data/sanity/projections/project/projectPageProjection.js`).

## Output

- One `<dl data-project-summary aria-label="Project summary">`. Terms follow the wireframe, in fixed order: Problem (`situation`), Design Challenge (`task`), Approach (`action`), Outcome (`result`).
- Empty fields are dropped (`selectattr("value")`). The `<dl>` is omitted when all four are empty.
- Values are autoescaped plain text; `whitespace-pre-line` keeps authored line breaks.
- Each `dt`/`dd` pair is wrapped in a `<div>`, the only valid grouping element inside a `<dl>`.
- Layout: `col-span-full`, one column, 2 at `sm`, 4 at `lg`, with 1px slate dividers.

## Template

- Source: [[star-summary.njk]]
- Path: `views/molecules/star-summary/star-summary.njk`
- Used by: `views/organisms/header/project/project-header.njk`, after the featured image.
