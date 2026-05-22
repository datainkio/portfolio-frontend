---
title: Project Metadata Band
template: "[[project-metadata-band.njk]]"
templatePath: views/organisms/project-metadata-band/project-metadata-band.njk
engine: Nunjucks
system: Eleventy
type: component
templateRole: organism
atomicLevel: organism
status: active
tags:
  - eleventy
  - nunjucks
  - template
  - organism
  - project
  - metadata
  - case-study
---
# Project Metadata Band

Renders the metadata band for a single project page, including awards, roles, industry, and activities, as a responsive grid. Consumes the raw `project` object and handles all formatting and value joining internally.

## Template

- Source: [[project-metadata-band.njk]]
- Path: `views/organisms/project-metadata-band/project-metadata-band.njk`

## Purpose

Encapsulates the project metadata region as defined in the project page IA and spec. Used by the single-project page and any other context needing a full metadata band.

## Data and Context

- Input: `{ project, classes }`
  - `project`: The full project object (as shaped by the transform)
  - `classes`: Optional responsive grid classes (default matches page spec)

## Relationships

- Uses: [[stats.njk]] (molecule)
- Used by: project page template, related-projects rails, etc.

## Notes for Future Maintenance

- Update field mapping if the project IA changes (e.g. new metadata fields, label changes).
- All value joining and empty-state logic is handled internally; callers pass only the raw project.
- Responsive grid classes can be overridden per context.
