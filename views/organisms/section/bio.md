---
title: "Bio"
template: "[[bio.njk]]"
templatePath: "views/organisms/section/bio.njk"
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
  - "[section-cap](../../molecules/section-cap.md)"
  - "[printmarks](../../molecules/printmarks.md)"
---
# Bio

Defines Nunjucks macro: `render`.

## Template

- Source: [[bio.njk]]
- Path: `views/organisms/section/bio.njk`

## Purpose

Renders the biography section of the landing page. Displays a heading, subheading, and body copy within a full-viewport pinned section. Targeted by the choreography system via `data-bio-el` attributes.

## Role in the System

Classified as a **component** at the atomic **organism** level based on its location under `views/`.

## Data and Context

- `params.id` — section element ID; defaults to `"bio"`.
- `params.classes` — additional CSS classes applied to the section root.
- `params.copy.heading` — primary heading text.
- `params.copy.subheading` — subheading text.
- `params.copy.body` — body copy (currently bound but not rendered in markup).
- `params.order` — display count passed to the section cap.
- `params.headingId` — overrides the default heading element ID (`{sectionId}-heading`).
- `params.buildDate` — passed to the section cap for build metadata display.

## Relationships

- Imports:
  - [[section-cap.njk]]
  - [[printmarks.njk]] _(imported but not currently used in rendered output)_
- Likely used by:
  - [[introduction.njk]]

## Notes for Future Maintenance

- `data-bio-el` attributes (`header`, `heading`, `subheading`) are choreography hooks — do not rename without updating `BioAnimations.js` and `selectors.js`.
- `data-scroll-section` is required for ScrollSmoother section detection.
- The `<header>` is the flex container (`flex flex-wrap items-center [&>time]:ml-auto`); it positions the SectionCap spans left and the `<time>` right. The `<h2>` and `<p>` use `basis-full` to each occupy their own row.
- Keep this sidecar in sync when the macro signature or `data-bio-el` hook set changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Is `params.copy.body` intended to be rendered as block content (Portable Text)? Currently captured but not output.
- Should `PrintMarks` be removed from the import if it remains unused?
