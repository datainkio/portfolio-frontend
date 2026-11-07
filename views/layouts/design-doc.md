---
description: "Layout for the living design-system reference: renders a component page's live specimens, the call behind each, and the params read from its sidecar."
type: template
tags:
  - layout
  - design-system
links:
  - "[cols-2-before](cols-2-before.md)"
  - "[design-pages](../molecules/list/design-pages.md)"
  - "[design filters](../../eleventy/filters/design.md)"
  - "[design system readers](../../eleventy/collections/designSystem.md)"
---

# Design Doc

Layout for every page under `ia/docs/design/`, set by that folder's
`design.11tydata.js`. Extends [[cols-2-before.njk]].

## Template

- Source: [[design-doc.njk]]
- Path: `views/layouts/design-doc.njk`

## Page shapes

| Page                                 | Renders                                                                            |
| ------------------------------------ | ---------------------------------------------------------------------------------- |
| Frontmatter names a `component`      | Header with source, sidecar, and import line; Specimens; In context; Params; Notes |
| Anything else (READMEs, token pages) | Header, then the page's own content in `prose prose-invert`                        |

The sidebar is [[design-pages.njk]], fed
`collections.all | eleventyNavigation("Design")`. The directory data file
computes every page's `eleventyNavigation` entry.

## Component page frontmatter

```yaml
title: Button
description: One sentence for the page header.
type: reference
component: atoms/button.njk # path under views/
specimens:
  - title: Call to action
    note: Optional line under the title.
    params: { label: "Get in touch", variant: "cta" }
    bind: { items: "cms.organizations" } # param path: data path
    content: "<span>Call body</span>" # renders with {% call %}
    surface: paper # dark (default) | paper | slate | primary | graph
    frame: "max-w-md" # classes added to the specimen frame
specimenNote: Why there's no specimen, when `specimens` is empty.
inContext:
  - { url: "/", label: "Homepage hero" }
```

- `bind` paths start from `cms`, `collections`, `colors`, `designTokens`,
  `buildDate`, `buildVersions`, or `site`. Pick a CMS record by slug, not
  index: `collections.projects.slug=enquos`. See [design filters](../../eleventy/filters/design.md).
- The markdown body, when present, renders under **Notes**.
- Each specimen prints the Nunjucks call that renders it, built from the same
  params, so the code can't drift from the output.

## Data and Context

- `componentDoc` — `{ source, sidecar, importPath, alias, description, params }` from `readComponentSidecar()`.
- `specimens`, `specimenNote`, `inContext` — page frontmatter, above.
- `title`, `description`, `content`, `page.filePathStem` — page data. The tier eyebrow is the folder after `docs/design/`.
- `cms`, `collections`, `colors`, `designTokens`, `buildDate`, `buildVersions`, `site` — the roots `bind` resolves against.

## Relationships

- Extends:
  - [[cols-2-before.njk]]
- Imports:
  - [[design-pages.njk]]
  - The page's `component`, dynamically, as `C`
- Used by:
  - Every page under `ia/docs/design/`

## Notes for Future Maintenance

- The specimen frame and the sidebar wrapper are a `<div>` and an `<aside>`. The frame has no meaning of its own, because the component inside supplies it.
- From `lg` the sidebar is sticky at `top-24` and scrolls on its own, capped at the viewport height less 7rem. That needs `<body>` to be `overflow-x: clip`, set in `styles/docs.css`: the site-wide `overflow-x-hidden` makes body a scroll container that never scrolls, so nothing in it can stick. Below `lg` the sidebar is a scrollable box capped at `max-h-72`, so the content isn't pushed below a hundred links.
- Reference pages load `/assets/docs.css`, not `styles.css` (the `stylesheet` key in `design.11tydata.js`). It's the site stylesheet plus the classes used only here, which `main.css` excludes.
- The frame is `transform-gpu`, which makes it the containing block for `position: fixed` descendants, so drawers and fixed headers stay inside it.
- Specimens render without the choreography bundle, which docs pages don't load. A component that starts hidden and waits for motion to reveal it renders in its initial state here.
- Components that emit an `id` should get a unique one per specimen, because the header and footer already render on the page.
