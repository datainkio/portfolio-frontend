---
title: "Global Footer"
template: "[[global-footer.njk]]"
templatePath: "views/organisms/footer/global-footer.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "component"
atomicLevel: "organism"
status: "active"
tags:
  - "#frontend/eleventy"
  - "#frontend/nunjucks"
  - "#frontend/eleventy/template"
  - "#tooling/Obsidian"
  - "#frontend/eleventy/component"
  - "#design/atomic-design/organism"
  - "#design/atomic-design"
links:
  - "[main-pages](../../molecules/list/main-pages.md)"
  - "[contact section](../section/contact.md)"
---
# Global Footer

Defines Nunjucks macro: `render`.

## Template

- Source: [[global-footer.njk]]
- Path: `views/organisms/footer/global-footer.njk`

## Purpose

Renders the site-wide footer: the **site-global contact form** (via the
[contact section](../section/contact.md)), footer navigation, and copyright.
Because every page renders this footer, the contact form appears site-wide.

## Role in the System

Classified as a **component** at the atomic **organism** level based on its location under `views/`.

## Data and Context

- `main_pages` — footer navigation list molecule.
- `contactSection` — imported `with context` so the contact macro can resolve
  the `env` (Sanity config) and `page` globals.
- `params` — `classes`, `items`, `year`; plus `contact: false` to suppress the
  contact form on a given page, and `contactOrder` to pass a section-cap order.

The contact form is wrapped in a `grid grid-cols-12` container so its
`grid-cols-subgrid` has a parent grid outside of `#page-main`.

## Relationships

- Imports:
  - [[main-pages.njk]]
  - [[contact.njk]]
- Used by:
  - [`base.njk`](../../layouts/base.njk) (most pages)
  - [`home.njk`](../../pages/home/home.njk)

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
