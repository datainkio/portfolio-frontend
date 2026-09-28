---
description: Renders a top-level Eleventy page.
type: template
links:
  - "[landing](../../templates/landing/landing.md)"
  - "[project-cards](../../molecules/list/project-cards.md)"
---

# Projects

Renders a top-level Eleventy page.

## Template

- Source: [[projects.njk]]
- Path: `views/pages/projects.njk`

## Purpose

Generates a routed page in the Eleventy build.

## Role in the System

Classified as a **page** at the atomic **page** level based on its location under `views/`.

## Data and Context

- `ProjectCards` — referenced in the template.
- `cms.projectsLanding[0].pageVideo` — optional portrait page video (`videoAsset`). Rendered as a decorative `<figure data-projects-el="video">` beside the landing header (below it on small screens) only when the asset has both a source and a poster. Uses the card video's playback contract: `data-defer-video` + `data-motion-optional` + `data-play-in-view`, hydrated and played near the viewport by `js/preloader/deferred-videos.js`, left on its poster under `prefers-reduced-motion`. When the asset has a `mask`, the PNG is applied as an inline CSS `mask` on the figure (alpha channel, stretched to the 9:16 frame), clipping poster and video alike.

## Relationships

- Extends:
  - [[landing.njk]]
- Imports:
  - [[project-cards.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
