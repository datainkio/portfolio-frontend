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
  - atomic-design
  - component
  - eleventy
  - nunjucks
  - Obsidian
  - organism
  - template
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

Renders the biography section of the landing page. Displays a heading, subheading, and body copy within a full-viewport `<header>`. Targeted by the choreography system via `data-bio-el` attributes. During scroll-out, the section root is pinned by a dedicated ScrollTrigger (`bio-outro-pin`, see `BioTriggers.md`) for a four-beat scrub: the H2 lines fade out last-to-first, the `gel_bio` background band grows from its own vertical center to fill the viewport, then `[data-bio-el="mission-statement"]` and `[data-bio-el="aside"]` translate (`y`) up to rest vertically centered, with scroll snapping to each beat's rest point. The pin releases when the sequence completes.

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

- `data-bio-el` attributes present in markup: `header`, `context`, `heading`, `mission-statement`, `overview`, `aside` — choreography hooks, do not rename without updating the bio-motion variants and `selectors.js`. The Blockframes 6x6 grid (`blockframes`, `blockframes-grid`, `blockframes-visible`) has moved to the Process section ([[process.njk]] / `choreography/molecules/process-motion`) and no longer lives here.
- `mission-statement` and `aside` are transform targets during the outro pin — their `y` is owned by `split.js`'s `outro()` timeline (see `BioTriggers.md`), not by normal document scroll, for the duration of the pin.
- `data-scroll-section` is required for ScrollSmoother section detection.
- The `<header>` is `h-dvh flex flex-col justify-between`, bottom-anchoring the `context` `<p>` and `heading` `<h2>` — there is no `<time>` element in current markup.
- Keep this sidecar in sync when the macro signature or `data-bio-el` hook set changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Is `params.copy.body` intended to be rendered as block content (Portable Text)? Currently captured but not output.
- Should `PrintMarks` be removed from the import if it remains unused?
