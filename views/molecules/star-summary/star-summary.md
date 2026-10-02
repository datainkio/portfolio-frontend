---
description: "Defines Nunjucks macro: render — the project STAR summary as a <dl> inside an Overview section frame."
type: template
links:
  - "[section-frame](../section/section-frame.md)"
---

# STAR Summary

Defines Nunjucks macro: `render`. Contract: [project-page pattern § 4](../../../../content-model/patterns/project-page.md).

## Params

- `params.classes`: appended to the section frame's `<section>` root. See the [Component API spec](../../../specs/views/component-api.views-spec.md).
- `params.project`: reads `situation`, `task`, `action` and `result` (plain `text`, fetched by `data/sanity/projections/project/projectPageProjection.js`).

## Output

- A [section frame](../section/section-frame.md) (`heading: "Overview"`, `id: "overview-heading"`, `tone: "slate-600"`) wrapping one `<dl data-project-summary aria-label="Project summary">`. Terms follow the wireframe, in fixed order: Problem (`situation`), Design Challenge (`task`), Approach (`action`), Outcome (`result`).
- Empty fields are dropped (`selectattr("value")`). The whole section is omitted when all four are empty.
- Values are autoescaped plain text; `whitespace-pre-line` keeps authored line breaks.
- Each `dt`/`dd` pair is wrapped in a `<div>`, the only valid grouping element inside a `<dl>`.
- Layout: `col-span-full`, one column, 2 at `sm`, 4 at `lg`. The border comes from the section frame.

## Template

- Source: [[star-summary.njk]]
- Path: `views/molecules/star-summary/star-summary.njk`
- Used by: `views/pages/project/project.njk`, after project metadata.
