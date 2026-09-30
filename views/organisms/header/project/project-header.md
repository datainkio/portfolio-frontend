---
description: "Defines Nunjucks macro: render."
type: template
links:
  - "[breadcrumbs-nav](../../navigation/breadcrumbs-nav.md)"
  - "[project-metadata](../../project-metadata/project-metadata.md)"
  - "[project-orgs](../../../molecules/list/project-orgs.md)"
  - "[featured-image](../../../molecules/figure/featured-image.md)"
---

# Project Header

Defines Nunjucks macro: `render`.

## Template

- Source: [[project-header.njk]]
- Path: `views/organisms/header/project/project-header.njk`

## STAR summary

Rendered by the [star-summary](../../../molecules/star-summary/star-summary.md) molecule after the featured image: `StarSummary.render({ project: params.project })`. Field rules and layout live in that sidecar.
