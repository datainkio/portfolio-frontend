---
id: frontend.eleventy.filters.string
role: "Text-processing filters: markdown rendering, truncation, case, and class injection."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "String filters"
system: "Eleventy"
tags:
  - filters
links:
  - "[[README.filters]]"
  - "[[filters]]"
---

# String filters

Text utilities for templates, backed by `markdown-it` and Cheerio.

| Filter | Purpose |
| --- | --- |
| `markdownify` | Markdown → HTML (inline HTML allowed) |
| `truncate(n)` | shorten with ellipsis |
| `prettify(classes)` | markdown render + inject CSS classes |
| `uppercase` | UPPERCASE |

## Source

- Path: `eleventy/filters/string.js`
