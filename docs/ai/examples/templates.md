# Canonical template patterns

## Macro render pattern (preferred)

- Macro-exported component: [njk/\_includes/organisms/section/hero.njk](../../../njk/_includes/organisms/section/hero.njk)
  - Exports `render(params = {})`
  - Keeps defaults local and explicit

## Import + render usage

- Page importing a component and calling `render`: [njk/\_pages/playground/hero-playground.njk](../../../njk/_pages/playground/hero-playground.njk)

## Constraints to preserve

- Templates must render meaningful HTML without JS.
- Prefer semantic structure + accessibility (headings, labels, alt text).
- Keep logic declarative; move computation to data where possible.
