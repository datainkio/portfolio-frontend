---
description: "Text-processing filters: markdown rendering, truncation, case, and class injection."
status: stable
tags:
  - filters
aliases:
  - String filters
links:
  - "[[eleventy/filters/README|filters]]"
  - "[[filters]]"
---

# String filters

Text utilities for templates, backed by `markdown-it` and Cheerio.

| Filter              | Purpose                                                                                               |
| ------------------- | ----------------------------------------------------------------------------------------------------- |
| `markdownify`       | Markdown → HTML (inline HTML allowed); `markdownify(true)` also gives headings ids, on `/docs/` pages |
| `truncate(n)`       | shorten with ellipsis                                                                                 |
| `prettify(classes)` | markdown render + inject CSS classes                                                                  |
| `uppercase`         | UPPERCASE                                                                                             |

## Source

- Path: `eleventy/filters/string.js`

## Heading ids

`headingIdsRule(md, getUrl)` is a markdown-it core rule that gives each heading without an `id` the slug of its text (`slugify`), with `-2`, `-3` on a repeat. It acts only when `getUrl(env)` returns a URL under `/docs/`, so no other page changes. Used ids are kept per page URL and cleared on `eleventy.before`, so every render of a page shares them.

- Page content: `amendLibrary("md", …)` applies the rule to Eleventy's markdown library; the URL is `env.page.url`.
- `markdownify(true)`: the filter reads `this.page.url`. Used only by the reference layout (`design-doc.njk`) and the choreography layer index (`layer.njk`); plain `markdownify` is unchanged.
