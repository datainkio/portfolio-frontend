---
description: "Layout for the living design-system reference: renders a component page's live specimens, the call behind each, and the params read from its sidecar."
type: template
tags:
  - layout
  - design-system
links:
  - "[cols-3](cols-3.md)"
  - "[design-pages](../molecules/list/design-pages.md)"
  - "[design filters](../../eleventy/filters/design.md)"
  - "[design system readers](../../eleventy/collections/designSystem.md)"
---

# Design Doc

Layout for every page under `ia/docs/design/`, set by that folder's
`design.11tydata.js`. Extends [[cols-3.njk]] for its third column.

## Template

- Source: [[design-doc.njk]]
- Path: `views/layouts/design-doc.njk`

## Three columns

| Column                    | Content                                                                | On                          |
| -------------------------- | ------------------------------------------------------------------------ | ---------------------------- |
| `sidebarBefore` (left)      | [[design-pages.njk]] — the sidebar nav                                   | Every page                  |
| `content` (centre)          | Header, then Specimens, Params, Notes (component page) or the page's own content | Every page, in `prose prose-invert` |
| `sidebarAfter` (right)      | Component, In context, Related                                           | Only when the page names a `component` |

`sidebarAfter` being set (or not) is what turns the third column on or off
in `cols-3.njk` — a page with no `componentDoc` has nothing to put there.
`main` itself carries `prose prose-invert` (`max-w-none`, so specimens can
run full width); markup that isn't prose (`dl`s, the specimen frames, both
asides) is marked `not-prose` so the typography plugin doesn't restyle it.

## Page shapes

| Page                                 | Renders                                                                            |
| ------------------------------------ | ---------------------------------------------------------------------------------- |
| Frontmatter names a `component`      | Centre: header, Specimens, Params, Notes. Right: Component (source, sidecar, import), In context, Related |
| Anything else (READMEs, token pages) | Centre only: header, then the page's own content                                   |

The sidebar is [[design-pages.njk]], fed
`collections.all | eleventyNavigation("Design")`. The directory data file
computes every page's `eleventyNavigation` entry.

### Related

`componentDoc.related` is `{ composedOf, usedIn }` from
[[designSystem.js|../../eleventy/collections/designSystem.md]]'s import
graph — what this component's file imports, and every component that
imports it — each resolved to a reference-page link where one exists. It
replaces a hand-written "Relationships" list in the component's own
sidecar, which could say something the file no longer does; this reads the
files themselves, every build, so it can't drift. The section itself is
left out when both lists are empty.

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

- `componentDoc` — `{ source, sidecar, importPath, alias, description, params, related }` from `readComponentSidecar()`.
- `specimens`, `specimenNote`, `inContext` — page frontmatter, above.
- `title`, `description`, `content`, `page.filePathStem` — page data. The tier eyebrow is the folder after `docs/design/`.
- `cms`, `collections`, `colors`, `designTokens`, `buildDate`, `buildVersions`, `site` — the roots `bind` resolves against.

## Relationships

- Extends:
  - [[cols-3.njk]]
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
- `cols-3.njk`'s own `{% if sidebarAfter %}<aside>` block at its top level never renders when a template `{% extends %}` it — Nunjucks only runs what a child's blocks call. The `<aside>` that actually renders is `base.njk`'s, gated by the same top-level `{% if sidebarAfter %}` there; setting `sidebarAfter` in a template anywhere in the extends chain reaches it, because Nunjucks shares one template context across `{% extends %}`.
