---
description: "Macro that renders the homepage hero: a full-viewport header (accession label + h1), then one section-statement per statement, alternating left and right."
type: template
tags:
  - component
links:
  - "[section-statement](../../molecules/section/section-statement.md)"
  - "[accession-label](../../molecules/labels/accession-label.md)"
  - "[HeroTriggers](../../../js/choreography/organisms/hero/HeroTriggers.md)"
---

# Hero

Defines Nunjucks macro: `render`.

## Template

- Source: [[hero.njk]]
- Path: `views/organisms/section/hero.njk`

## Purpose

The homepage's opening section (DOM id `manifesto`). A full-viewport `<header>` holds the accession label and the `<h1>`. Below it, each statement renders as its own full-viewport [[section-statement.njk|section-statement]], and the layouts alternate: `left` on odd statements, `right` on even ones (`loop.index % 2`). The choreography binds through `data-hero-el` attributes. `HeroTriggers.js` pins each statement at the viewport top and pins the section root for the outro (`hero-outro-pin`); see `HeroTriggers.md`.

## Role in the System

Classified as a **component** at the atomic **organism** level based on its location under `views/`.

## Data and Context

| Param             | Type   | Description                                                                                                                                                                                                                                                                     |
| ----------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`              | string | Section element ID; defaults to `"hero"`. The homepage passes `"manifesto"`.                                                                                                                                                                                                    |
| `copy.heading`    | string | `<h1>` text.                                                                                                                                                                                                                                                                    |
| `copy.subheading` | string | The fallback statement's heading, used only when `statements` is absent.                                                                                                                                                                                                        |
| `copy.body`       | string | The fallback statement's body HTML, used only when `statements` is absent.                                                                                                                                                                                                      |
| `statements`      | array  | Items of `{ subheading, body, image }`, each passed to [[section-statement.njk\|section-statement]]. `home.njk` passes `cms.home[0].statements`, serialized by `data/sanity/transforms/home.js`. Without it, a single statement renders from `copy.subheading` and `copy.body`. |
| `headingId`       | string | The `<h1>` id and the section's `aria-labelledby`. Defaults to `id`.                                                                                                                                                                                                            |
| `buildDate`       | date   | Sets the end year of the accession label's scope (`2008-<year>`).                                                                                                                                                                                                               |

`classes` and `order` are read into variables but not applied to the markup.

## Layout

The section is `grid grid-cols-12 px-4`. The header is `h-dvh`, vertically centred (`flex flex-col justify-center`), and spans the full width at base, then 9, 8 and 6 columns at md, lg and xl. Each statement spans all 12 columns; its own column placement is in [section-statement](../../molecules/section/section-statement.md).

## Relationships

- Imports:
  - [[accession-label.njk|molecules/labels/accession-label.njk]]
  - [[section-statement.njk|molecules/section/section-statement.njk]]
- Used by:
  - [[home.njk|views/pages/home/home.njk]]

## Notes for Future Maintenance

- `data-hero-el` hooks in the rendered markup: `header`, `context` (the label), `heading` (the `<h1>`), and, from section-statement, `mission-statement` (each statement `<section>`) and `statement-heading` (its `<h2>`). Don't rename them in markup alone; the shared ones live in `HERO_SELECTORS` in `selectors.js`.
- The choreography also looks up `band` (`split.js`) and `overview` (`mission-statement.js`, `overview-gel.js`), which no longer exist in this markup. Those lookups find nothing.
- `data-scroll-section` is required for ScrollSmoother section detection.
- Keep this sidecar in sync when the macro signature or `data-hero-el` hook set changes.

## Open Questions

- Statement motion binds only the first `mission-statement` section. Generalise it to every statement.
- Remove the unused `classes` and `order` params, or apply them?
- Remove the dead `band` and `overview` lookups from the hero motion, or restore the elements?
