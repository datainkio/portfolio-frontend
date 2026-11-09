---
description: "Filters for the living design-system reference: resolve bound data into specimen params, and print the Nunjucks call a specimen renders."
tags:
  - filters
  - design-system
aliases:
  - Design filters
links:
  - "[[eleventy/filters/README|filters]]"
  - "[[filters]]"
  - "[[design-doc]]"
---

# Design filters

Used by [[design-doc]] to render component specimens declared in the
frontmatter of `ia/docs/design/**` pages.

| Filter                                       | Purpose                                                                                                                                                     |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `specimenParams(params, bind, roots)`        | Clones literal `params`, then sets each `bind` key (a param path) to the value at its data path under `roots`.                                              |
| `specimenCall(alias, params, bind, content)` | The `{{ Alias.render({...}) }}` source for a specimen, with bound values printed as their data path. A `content` string turns it into a `{% call %}` block. |

YAML can't hold live data, so a specimen names it by path:
`bind: { items: "cms.organizations" }`. The layout passes the roots that
paths may start from (`cms`, `collections`, `colors`, `designTokens`,
`buildDate`, `site`), so a path outside them resolves to `undefined`.

A path segment is a key, an array index, or `field=value`, which picks the
first array item whose field equals the value:
`collections.projectPages.slug=enquos.awards`. Bind CMS collections by slug,
because an index points at a different record when the CMS order changes.
Indexes are fine inside one document (`decisions.0`) and for singletons
(`cms.home.0`). `specimenCall` prints a `field=value` segment as
`(… | filterByKey("field", "value") | first)`, which is valid Nunjucks.

## Source

- Path: `eleventy/filters/design.js`
