---
title: Maintenance
description: How to change, build, and check this reference, and where the design decisions are recorded.
type: reference
---

## Updating tokens

- Edit colour, spacing, radius, shadow, and type in Figma, then run
  `npm run build:design`. Font families are the exception: edit
  `styles/typography/fontFamilies.css` by hand.
- Edit motion in `js/choreography/tokens/motion/motion.js`, then run
  `npm run build:motion`.
- Never edit `styles/colors.css`, `styles/tokens.css`, or `styles/motion.css`
  by hand. The next sync overwrites them.
- The [Tokens](/docs/design/tokens/) page has the table of where each group
  comes from and how to change it.

## Adding a component page

- A component page is a Markdown file at
  `ia/docs/design/<path under views/>.md`, with frontmatter naming the
  `component` and listing `specimens`. The contract is in
  `views/layouts/design-doc.md`.
- Give a new component a page when you add it. `npm run scaffold:component`
  generates the component.
- Add the page to its group in `GROUPS` in
  `ia/docs/design/design.11tydata.js`. A page the table doesn't list still
  renders, under "Ungrouped".

## Adding a choreography module

- Edit the sidecar, not a page here. A new module needs only its sidecar: the
  next build gives it a page and a sidebar entry.
- The contract is in `ia/docs/design/choreography/choreography.11tydata.md`.

## Building and previewing

- `npm run document` builds the site with `/docs/`.
- `npm run start:docs` serves it, and watches `docs.css` and the choreography
  sidecars.
- `npm start` and `npm run quick` skip `/docs/`.
- Markdown headings on these pages get an `id` at build time, so a section can
  be linked. The id is the heading text, lower-cased and hyphenated (`Adding a
component page` becomes `#adding-a-component-page`), with `-2`, `-3` on a
  repeat. A heading that already has an `id` keeps it. Headings written in
  HTML, in the layout or in a specimen, are not touched.

## Checks

- `npm test` runs the logger, choreography, and Figma token tests.
- `npm run validate` runs every check: formatting, frontmatter, palette,
  motion tokens, sidecars, and the tests.
- `npm run check:motion` fails when `styles/motion.css` has drifted from
  `motion.js`.

## Decisions

The decision records are in `docs/design-system/`:

- `adr-0001-figma-owns-design-tokens.md`
- `adr-0002-figma-library-variables-are-the-design-tokens.md`
- `adr-0003-figma-owns-mapped-component-colours.md`
- `adr-0004-gsap-runs-motion-eases-as-mapped-core-eases.md`
