# Canonical template patterns

## Macro render pattern (preferred)

- Macro-exported component: [views/organisms/section/hero.njk](../../../views/organisms/section/hero.njk)
  - Exports `render(params = {})`
  - Keeps defaults local and explicit

## Import + render usage

- Page importing a component and calling `render`: [ia/playground/hero-playground.md](../../../ia/playground/hero-playground.md)

## Constraints to preserve

- Templates must render meaningful HTML without JS.
- Prefer semantic structure + accessibility (headings, labels, alt text).
- Keep logic declarative; move computation to data where possible.
