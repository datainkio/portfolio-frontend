---
description: "In the current state of the design strategy for the home landing page, the role of this is little view is to communicate context to the user by"
type: template
---

# Section Cap

In the current state of the design strategy for the home landing page, the role of this is little view is to communicate context to the user by

- letting them know what section is currently in view, and
- letting them know where that section sits in terms of their progress on the page.

It contains an instance of BuildInfo - a small view that displays versioning information for the current build.

The SectionCap view stays current by updating itself in response to scroll events. When a section element crosses a given vertical threshold within the viewport the SectionCap view will update to display the title (or id) of the section and its place in relation to the other section elements.

Related files include HomeHeaderManager.js and BuildInfoManager.js. For implementation inspiration, check out WorkNavManager.js

Defines Nunjucks macro: `render`.

## Template

- Source: [[section-cap.njk]]
- Path: `views/molecules/section-cap.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

## Role in the System

Classified as a **component** at the atomic **molecule** level based on its location under `views/`.

## Data and Context

No obvious data dependencies identified from the template alone.

## Relationships

- Likely used by:
  - Unknown

## Open-state layout

The cap `<ul>` is the named flex group `group/cap` and carries `data-buildinfo-el="cap"`. [[BuildInfoManager.js]] toggles a `data-open` presence attribute on it when the build-info disclosure opens. Three items default to `basis-1/3` each; `group-data-[open]/cap:` variants redistribute to **1/6 · 1/6 · 2/3** (title · count · build-info) to make room for the expanded list. Layout is CSS-only — JS just flips the flag.

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
