---
description: "Macro that renders the project page header: industry, title, abstract, and featured image."
type: template
links:
  - "[media](../../../molecules/figure/media.md)"
  - "[Component API spec](../../../../specs/views/component-api.views-spec.md)"
---

# Project Header

Macro that renders the project page's `<header>`: the industry caption, the `h1` title, the abstract, and the featured image.

## Template

- Source: [[project-header.njk]]
- Path: `views/organisms/header/project/project-header.njk`

## Macro Signature

```njk
{% import "organisms/header/project/project-header.njk" as ProjectHeader %}
{{ ProjectHeader.render({ project: project }) }}
```

| Param     | Type                      | Required | Description |
| --------- | ------------------------- | -------- | ----------- |
| `project` | object                    | Yes      | Project page object. Reads `industry.title`, `title`, `abstract`, `featuredImage`. |
| `classes` | string \| variant map \| array | No | Appended to the `<header>` root. |

Follows the [Component API spec](../../../../specs/views/component-api.views-spec.md).

## Relationships

- Used by: [[project.njk|pages/project/project.njk]]
- Imports: [[media.njk|molecules/figure/media.njk]] (featured image)

Project metadata and the STAR summary render at page level in `project.njk`, not in this header.
