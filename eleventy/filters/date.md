---
id: frontend.eleventy.filters.date
role: "Human-readable date formatting for templates, backed by Luxon."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Date filters"
tags:
  - eleventy
  - filters
links:
  - "[[README.filters]]"
  - "[[filters]]"
---

# Date filters

Formats dates for display using [Luxon](https://moment.github.io/luxon/). Accepts JS
`Date` objects and ISO 8601 strings.

| Filter | Output |
| --- | --- |
| `postDate` | `Jan 1, 2024` (medium format) |

```njk
{{ post.published | postDate }}
```

## Source

- Path: `eleventy/filters/date.js`
