---
title: Article header
description: The article title block, with the hanko mark beside an h1 and an optional abstract.
type: reference
component: organisms/header/article/article-header.njk
specimens:
  - title: Title only
    note: The article template passes a title and the brand logo, with no abstract. The logo is an inlined SVG built by a filter, which a bound path can't reproduce, so the mark is empty here.
    params:
      title: How this portfolio is built
    frame: flex items-end gap-2
  - title: With abstract
    params:
      title: How this portfolio is built
      abstract: "<p>A short abstract renders under the title as a section.</p>"
    frame: flex flex-wrap items-end gap-2
inContext:
  - { url: /about/, label: About page }
---

The caller wraps this in its own `<header>`. The macro emits the mark, the h1, and the abstract only.
