---
description: "HTML-processing filters (Cheerio): extract h2 headings and expand referenced content."
status: stable
tags:
  - filters
aliases:
  - DOM filters
links:
  - "[[README.filters]]"
  - "[[filters]]"
---

# DOM filters

Server-side HTML processing with [Cheerio](https://cheerio.js.org/).

| Filter                  | Purpose                                                          |
| ----------------------- | ---------------------------------------------------------------- |
| `extractHeadings(html)` | collect `<h2 id>` as `[{ id, text }]` (drives in-page nav / TOC) |
| `expand(str, ds)`       | inline referenced `{type, id}` content from a datasource         |

> [!note] Feeds in-page navigation
> `extractHeadings` is the data source for section/TOC links — see the
> [[feat--work-section-navigation]] and [[add-in-page-jump-links-to-header]] work.

## Source

- Path: `eleventy/filters/dom.js`
