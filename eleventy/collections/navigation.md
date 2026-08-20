---
id: frontend.eleventy.collections.navigation
role: "Registers the navigation collections with 11ty and delegates all processing to the NavigationBuilder service."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Navigation collection"
system: "Eleventy"
tags:
  - collection
links:
  - "[[README.collections]]"
  - "[[NavigationBuilder]]"
  - "[[index]]"
---

# Navigation collection

Thin registration layer: declares the navigation collections and hands every piece of
processing to the [[NavigationBuilder]] service (Single Responsibility — registration
stays separate from business logic).

## Registers

| Collection | Built from |
| --- | --- |
| `nav_dirs` | `ia/` route structure + frontmatter titles |
| `nav_projects` | Sanity projects data |
| `nav_primary` | merge of the two into a hierarchical tree |

> [!warning] Downstream coupling
> GSAP choreography and the navigation organisms read the specific DOM structure this
> collection generates. Requires `site.directories.nav` in `site.json`. Changing the
> shape here can break [[WorkNavManager]] and templates in `organisms/navigation/`.

## Source

- Path: `eleventy/collections/navigation.js`
