---
description: "Provides a reusable page shell used by other templates via {% extends %}."
type: template
links:
  - "[base](base.md)"
  - "[landing-header](../organisms/header/landing/landing-header.md)"
---

# Landing

Provides a reusable page shell used by other templates via `{% extends %}`.

## Template

- Source: [[landing.njk]]
- Path: `views/layouts/landing.njk`

## Purpose

Defines the structural shell (head/body wrappers, slots) inherited by pages.

## Role in the System

Classified as a **layout** at the atomic **none** level based on its location under `views/`.

## Data and Context

- `Hanko` — referenced in the template.
- `body` — referenced in the template.
- `content` — referenced in the template.
- `pageBody` — the CMS Body field as HTML (`pageBodyHtml`), set in the route's frontmatter by `ia/docs/index.md`, `ia/projects.md`, `ia/contact.md` and `ia/posts.md`. Rendered as `<section data-landing-body>` after the header: the first block of main content, ahead of what the page template adds. Until 2026-11-24 these routes passed the body as `abstract`, which put it inside the header.
- `abstract` — optional short intro, rendered inside the header as `<section data-doc-abstract>`. No route sets it now.
- `title` — referenced in the template.
- `docNo`, `eleventyNavigation.title` — forwarded to `landing-header.njk` as `docNo` / `docTitle` for the accession label. Set `docNo` in the route's frontmatter (`ia/projects.md` = `02`, `ia/contact.md` = `03`).

## Relationships

- Extends:
  - [[base.njk]]
- Imports:
  - [[hanko.njk]]
- Parent Template Blocks:
	- mainStyles
	- content
- Likely used by:
  - Pages representing primary concepts (e.g. Case Studies, Contact, etc.)

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
