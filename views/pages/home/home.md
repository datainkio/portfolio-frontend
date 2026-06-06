---
title: "Home"
template: "[[home.njk]]"
templatePath: "views/pages/home/home.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "page"
atomicLevel: "page"
status: "active"
tags:
  - "#frontend/eleventy"
  - "#frontend/nunjucks"
  - "#frontend/eleventy/template"
  - "#tooling/Obsidian"
  - "#design/atomic-design/page"
  - "#design/atomic-design"
links:
  - "[SitePreloader](../../organisms/SitePreloader.md)"
  - "[global-header](../../organisms/header/global-header.md)"
  - "[global-footer](../../organisms/footer/global-footer.md)"
  - "[skip-links-nav](organisms/navigation/skip-links-nav.njk)"
  - "[sizzle-background](../../molecules/background/sizzle-background.md)"
  - "[hero](../../organisms/section/hero.md)"
  - "[bio](../../organisms/section/bio.md)"
  - "[awards](../../organisms/section/awards.md)"
  - "[work](../../organisms/section/work.md)"
  - "[organizations](../../organisms/section/organizations.md)"
  - "[contact](../../organisms/section/contact.md)"
  - "[head](../../templates/partials/head.md)"
  - "[gtm-noscript](../../templates/partials/gtm-noscript.md)"
  - "[choreography-script](../../templates/partials/choreography-script.md)"
---

# Home

Renders a top-level Eleventy page.

## Template

- Source: [[home.njk]]
- Path: `views/pages/home.njk`

## Purpose

Generates a routed page in the Eleventy build.

## Role in the System

Classified as a **page** at the atomic **page** level based on its location under `views/`.

## Data and Context

- `Background` — referenced in the template.
- `Footer` — referenced in the template.
- `Header` — referenced in the template.
- `Preloader` — referenced in the template.
- `SkipLinksNav` — referenced in the template.
- `awardsSection` — referenced in the template.
- `bioSection` — referenced in the template.
- `heroSection` — referenced in the template.
- `projectsSection` — referenced in the template.

## Relationships

- Includes:
  - [[head.njk]]
  - [[gtm-noscript.njk]]
  - [[choreography-script.njk]]
- Imports:
  - [[SitePreloader.njk]]
  - [[global-header.njk]]
  - [[global-footer.njk]]
  - [[skip-links-nav.njk]]
  - [[sizzle-background.njk]]
  - [[hero.njk]]
  - [[bio.njk]]
  - [[awards.njk]]
  - [[work.njk]]
  - [[organizations.njk]]
  - [[contact.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
