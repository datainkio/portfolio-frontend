---
title: "Project"
template: "[[project.njk]]"
templatePath: "views/pages/project/project.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "page"
atomicLevel: "page"
status: "active"
tags:
  - "#eleventy"
  - "#nunjucks"
  - "#template"
  - "#obsidian"
  - "#page"
  - "#project"
  - "#atomic-design"
links:
  - "[base](../../layouts/base.md)"
  - "[project-header](../../organisms/header/project/project-header.md)"
  - "[choreography-script](../../templates/partials/choreography-script.md)"

---

# Project (single)

Renders one Eleventy page per `project` document. The page is emitted by
paginating over the `projectPages` collection in
[`frontend/ia/project.md`](../../../ia/project.md), aliased as `project`,
and routed to `/case-studies/{slug}/`.

## Template

- Source: [[project.njk]]
- Path: `views/pages/project/project.njk`
- Layout: `views/layouts/base.njk`

## Purpose

Per-project detail page (case study). One H1 per page, body headings demote
to H2 and below via the transform. Composition follows
[`content-model/patterns/project-page.md`](../../../../content-model/patterns/project-page.md).

## Role in the System

Classified as a **page** at the atomic **page** level.

## Data and Context

- Pagination source: `collections.projectPages` (registered by
  `frontend/data/sanity/services/sanityService.js`).
- Query: `frontend/data/sanity/queries/project/project-pages.js`
- Projection: `frontend/data/sanity/projections/project/projectPageProjection.js`
- Transform: `frontend/data/sanity/transforms/project.js`
  (`normalizeProjectPageRecords` adds `url` and `bodyHtml`).

### Template inputs (shape of `project`)

| Key              | Source                              | Required |
| ---------------- | ----------------------------------- | -------- |
| `title`          | `project.page.title`                | yes      |
| `slug`           | `project.page.slug.current`         | yes      |
| `abstract`       | `project.page.abstract`             | yes      |
| `featuredImage`  | resolved `imageAsset`               | yes      |
| `organization[]` | resolved organizations (byline)     | yes      |
| `industry`       | resolved taxonomy                   | yes      |
| `roles[]`        | resolved taxonomy                   | yes      |
| `activities[]`   | resolved taxonomy                   | yes      |
| `outcomes[]`     | resolved taxonomy                   | no       |
| `awards[]`       | resolved awards                     | no       |
| `bodyHtml`       | serialized portable text (H2+ only) | yes      |
| `externalLink`   | string or `{ href, label }`         | no       |
| `caseStudyUrl`   | string                              | no       |

## Relationships

- Extends: [[base.njk]]
- Driven by: [[project.md]] (`frontend/ia/project.md`)
- Spec: [`frontend/specs/views/project-page.views-spec.md`](../../../specs/views/project-page.views-spec.md)
- Pattern: [`content-model/patterns/project-page.md`](../../../../content-model/patterns/project-page.md)

## Notes for Future Maintenance

- The template must not call Sanity or contain GROQ. All shape lives in the
  projection + transform.
- Keep the IA region order in sync with the pattern doc.
- After structural changes, run `npm run build` (or `npm start`) from
  `frontend/` to validate the Eleventy build.

## Open Questions

- Outcome treatment: aside vs. between metadata and body (currently aside).
- PDF download pipeline is required by the spec but not yet implemented.
- SEO surface: confirm `project.seo` drives `<title>`, meta description, OG.
