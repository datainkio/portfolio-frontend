---
title: "Project Orgs"
template: "[[project-orgs.njk]]"
templatePath: "views/molecules/list/project-orgs.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "macro"
atomicLevel: "molecule"
status: "active"
tags:
  - "#eleventy"
  - "#nunjucks"
  - "#template"
  - "#obsidian"
  - "#component"
  - "#molecule"
  - "#atomic-design"
---
# Project Orgs

Macro that renders a comma-separated list of organization titles inside a `<p>` element.

## Template

- Source: [[project-orgs.njk]]
- Path: `views/molecules/list/project-orgs.njk`

## Purpose

Encapsulates the byline pattern — a comma-delimited list of organizations — used on the project page header. Handles its own empty-guard so call sites need no conditional wrapper.

## Macro Signature

```njk
{% import "molecules/list/project-orgs.njk" as ProjectOrgs %}
{{ ProjectOrgs.render({ orgs: orgs, class: "some-class" }) }}
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `orgs` | `Array<{ title: string }>` | No | List of organization objects. Renders nothing when empty or omitted. |
| `class` | `string` | No | CSS class string applied to the wrapping `<p>`. |

## Role in the System

Classified as a **macro** at the atomic **molecule** level based on its location under `views/`.

## Data and Context

- `params.orgs` — array of organization objects, each with a `title` property. Sourced from `project.organization` via the Sanity project transform.
- `params.class` — typically the result of the `byline | classes` filter applied in the consuming template.

## Relationships

- Used by:
  - [[project.njk]] (project page, byline slot)

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.
