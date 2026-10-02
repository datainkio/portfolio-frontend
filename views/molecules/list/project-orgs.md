---
description: "Macro that renders a comma-separated list of organization titles inside a <p> element."
type: template
tags:
  - component
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
{{ ProjectOrgs.render({ orgs: orgs, classes: "some-class" }) }}
```

| Param   | Type                       | Required | Description                                                          |
| ------- | -------------------------- | -------- | -------------------------------------------------------------------- |
| `orgs`  | `Array<{ title: string }>` | No       | List of organization objects. Renders nothing when empty or omitted. |
| `classes` | string \| variant map \| array | No    | Applied to the wrapping `<span>` through the `classes` filter. |

## Role in the System

Classified as a **macro** at the atomic **molecule** level based on its location under `views/`.

## Data and Context

- `params.orgs` — array of organization objects, each with a `title` property. Sourced from `project.organization` via the Sanity project transform.
- `params.classes` — raw variant map or string; the macro applies `| classes`. See the [Component API spec](../../../specs/views/component-api.views-spec.md).

## Relationships

- Used by:
  - [[project.njk]] (project page, byline slot)

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.
