---
description: "Defines Nunjucks macro: render."
type: template
links:
  - "[hanko](../../../atoms/hanko/hanko.md)"
  - "[breadcrumbs-nav](../../navigation/breadcrumbs-nav.md)"
  - "[featured-image](../../../molecules/figure/featured-image.md)"
---

# Landing Header

Defines Nunjucks macro: `render`.

## Template

- Source: [[landing-header.njk]]
- Path: `views/organisms/header/landing/landing-header.njk`

## Data and Context

`render(params)` accepts:

- `title` — the `<h1>` text (page `title`).
- `docNo` — two-digit document number for the accession label (`DOC 03 / …`); default `00`. Sourced from page frontmatter via `templates/landing/landing.njk`.
- `docTitle` — short label after the doc number (`eleventyNavigation.title`); falls back to `title`.
- `headerStyles` — class-map overrides.

The macro is imported without context, so every value must arrive through `params`.
