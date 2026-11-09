---
description: Context sidecar for industry-section.njk (views/molecules/section/industry-section.njk).
type: template
---

# industry-section

Context sidecar for [[industry-section.njk]] (`views/molecules/section/industry-section.njk`).

## Template

- Source: [[industry-section.njk]]
- Path: `views/molecules/section/industry-section.njk`

## Params

| Param           | Type   | Description                                                                       |
| --------------- | ------ | --------------------------------------------------------------------------------- |
| `industryTitle` | string | Heading text. Its slug is the section's `id` and the target of `aria-labelledby`. |
| `projects`      | array  | Project records, passed to the project cards.                                     |

Fixed design: takes no styling params.
