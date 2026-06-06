---
title: "Project Metadata Band"
template: "[[project-metadata.njk]]"
templatePath: "views/organisms/project-metadata/project-metadata.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "component"
atomicLevel: "organism"
status: "active"
tags:
  - "#frontend/eleventy"
  - "#frontend/nunjucks"
  - "#frontend/eleventy/template"
  - "#tooling/Obsidian"
  - "#frontend/eleventy/component"
  - "#design/atomic-design/organism"
  - "#design/atomic-design"
links:
  - "[stats](../../molecules/stats/stats.md)"
---

# Project Metadata Band

Encapsulates the project metadata band as a reusable Nunjucks macro for project/case study pages.

## Template

- Source: [[project-metadata.njk]]
- Path: `views/organisms/project-metadata/project-metadata.njk`

## Purpose

Renders a metadata band for a project, displaying awards, roles, industry, and activities as a `<dl>` using the Stats macro. Follows atomic design conventions (organism).

## Role in the System

Classified as a **component** at the atomic **organism** level based on its location under `views/`.

## Macro Contract

- Macro: `render(params = {})`
  - `params.project` — Project object (required; see data shape below)
  - `params.classes` — Responsive class object or string (optional)
  - `params.aria` — ARIA label for the band (optional)

## Data and Context

- `project` — Must include:
  - `awards[]` (array of { title })
  - `roles[]` (array of { title })
  - `industry` (object with `title`)
  - `activities[]` (array of { title })

## Relationships

- Imports:
  - [[molecules/stats/stats.njk]]
- Used by:
  - [[views/pages/project/project.njk]]

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the macro signature or data shape changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are all data dependencies explicit, or are some supplied indirectly (front matter, computed data, Sanity transforms)?
