---
description: "Defines Nunjucks macro: render."
type: template
links:
  - "[hanko](../../../atoms/hanko/hanko.md)"
---

# Article Header

Defines Nunjucks macro: `render`.

## Template

- Source: [[article-header.njk]]
- Path: `views/organisms/header/article/article-header.njk`

## Params

| Param      | Type   | Description                                                               |
| ---------- | ------ | ------------------------------------------------------------------------- |
| `logoSvg`  | string | Inlined SVG markup for the hanko mark, output through the hanko atom.     |
| `title`    | string | `h1` text. Defaults to "Untitled".                                        |
| `abstract` | string | HTML, output with `safe`. The abstract `<section>` is omitted when empty. |

Fixed design: takes no styling params.
