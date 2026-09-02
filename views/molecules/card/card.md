---
description: "Defines Nunjucks macro: render."
type: template
links:
  - "[heading](../../atoms/heading.md)"
  - "[cta](../../atoms/cta.md)"
  - "[stats](../stats/stats.md)"
  - "[trim-marks](../../atoms/printmarks/trim-marks.md)"
---

# Card

Defines Nunjucks macro: `render`.

## Template

- Source: [[card.njk]]
- Path: `views/molecules/card/card.njk`

## Purpose

Encapsulates reusable markup as Nunjucks macros for use by other templates.

When a truthy `url` param is passed, the card footer renders a **"View More"**
CTA (via [[cta.njk]]) linking to the associated case study. The guard is
`{% if url %}`, so callers that omit `url` render no link. For project cards the
`url` is supplied upstream by the data transforms (see [[home|home.js transform]]
and `resolveProjectCardUrl`), not built in the template.

## Card media: image, or video over image

The `<figure>` renders one of two elements, never both:

- **`video` param absent** — an `<img>` from `image`, exactly as before.
- **`video` param present** — a `<video>` whose `poster` is `video.poster.url` if the asset carries its own still, otherwise the `image` param. The image is therefore always required, even for video cards; it is the poster and the fallback, not a redundant second asset.

Both elements share the same `width`/`height` (taken from the image dimensions) and the same classes, so the aspect ratio and layout stability are identical across the two branches.

The video is **decorative**: `aria-hidden="true"`, `tabindex="-1"`, no `controls`, always `playsinline`. The accessible name for the card comes from the heading. Playback attributes (`muted`, `loop`, `autoplay`) render unless the data explicitly says `false`.

### Reduced motion

The `<video>` ships with no `src` — only `data-src` plus `data-defer-video`, hydrated later by [[deferred-videos]]. It is additionally marked `data-motion-optional`, which tells that hydrator to skip it entirely when `prefers-reduced-motion: reduce` matches. With no source ever assigned the element renders its poster and stays still, so the reduced-motion fallback is the absence of an action rather than an extra code path. Videos without `data-motion-optional` (e.g. the sizzle background) hydrate as they always have.

## Motion

Card motion is choreographed and responsive to breakpoint:

- **base–md**: sticky figure (sticky.js) — the figure pins to the viewport while the body scrolls over it
- **lg+**: parallax (parallax.js) — subtle vertical parallax between body and figure, body moves 12% upward on scroll while figure remains at default speed
- **reduced motion**: all motion disabled; card renders from CSS alone

See [[Card.js]] for the organism controller and [[card-motion.js]] for the motion factories.

## Role in the System

Classified as a **component** at the atomic **molecule** level based on its location under `views/`.

## Data and Context

- `CTA` — referenced in the template.
- `Details` — referenced in the template.
- `HeadingBlock` — referenced in the template.
- `TrimMarks` — referenced in the template.

## Relationships

- Imports:
  - [[heading.njk]]
  - [[cta.njk]]
  - [[stats.njk]]
  - [[trim-marks.njk]]
- Likely used by:
  - Unknown

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
