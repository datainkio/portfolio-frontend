---
description: "Defines Nunjucks macro: render."
type: template
tags:
  - lightbox
links:
  - "[Lightbox.js](../../../js/lightbox/Lightbox.md)"
---

# Lightbox

Defines Nunjucks macro: `render`.

## Template

- Source: [[lightbox.njk]]
- Path: `views/molecules/lightbox/lightbox.njk`

## Purpose

Renders a clickable image that opens a full-size view in a native `<dialog>`.
Click the trigger image to open; click the "Close" button (or click the
backdrop, or press Escape) to close. Self-contained — usable anywhere a single
image needs a click-to-enlarge view.

## Params

| Param        | Required | Description                                                                                                              |
| ------------ | -------- | ------------------------------------------------------------------------------------------------------------------------ |
| `src`        | yes      | Image URL, reused at both thumbnail and full size (spec decision: no separate full-res field).                           |
| `alt`        | no       | Alt text; also used as the dialog's accessible label.                                                                    |
| `caption`    | no       | Optional caption; rendered as a `<figcaption>` under the thumbnail (visible in normal flow, not just inside the dialog). |
| `imgClasses` | no       | Override classes for the thumbnail `<img>`; defaults to `w-full h-full object-cover`.                                    |

## Role in the System

Classified as a **component** at the atomic **molecule** level based on its
location under `views/`.

## Data and Context

Takes plain params, not a Sanity document shape — callers pass `image.asset.url`
(or equivalent) directly.

## Relationships

- Behavior wired by [[Lightbox.js]] (`js/lightbox/Lightbox.js`), loaded via an
  inline `<script type="module">` at the end of the macro.
- Not currently wired into any existing template (e.g. `card.njk`) — standalone
  component only, per scope decision at introduction.
- Same `data-lightbox-el` markup contract as the PortableText image serializer
  (`data/sanity/transforms/portableText.js`, `types.image`), which hand-builds
  the equivalent HTML string since `@portabletext/to-html` serializers aren't
  Nunjucks. Keep caption placement (figure-level `<figcaption>`, not inside the
  dialog) in sync between the two if either changes.

## Notes for Future Maintenance

- Uses native `<dialog>` (`showModal`/`close`) for focus trapping and
  Escape-to-close instead of hand-rolled focus management.
- Root wrapper is `<figure class="contents">` (`display: contents`) so the
  component drops into a grid/flex layout (e.g. a card figure slot) without
  adding its own box.
- Any open/close transition added later is auto-disabled for
  `prefers-reduced-motion` by the global rule in
  `styles/utilities/reduced-motion.css` — no extra guard needed.
- Run `npm run quick` after structural changes to validate the Eleventy build.

## Open Questions

- None at introduction.
