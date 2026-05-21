- **Title:** Ruler Display - Hybrid JS Geometry and CSS Presentation
- **Owner(s):** Frontend / Choreography Maintainers
- **Status:** draft
- **Last reviewed:** 2026-04-12
- **Scope:** `Ruler` display rendering in `js/displays/Ruler.js` with utility classes supplied by `js/choreography/config/ruler.js`.
- **Links:** runtime [../../js/displays/Ruler.js](../../js/displays/Ruler.js), defaults [../../js/choreography/config/ruler.js](../../js/choreography/config/ruler.js), intro manager [../../js/choreography/managers/RulerIntroManager.js](../../js/choreography/managers/RulerIntroManager.js), template [../../views/atoms/ruler.njk](../../views/atoms/ruler.njk)

## Hybrid Contract

- JS is responsible for geometry and content:
  - major/minor tick counts and x positions
  - y coordinates based on spacing values
  - numeric label text and edge anchoring
- Config is responsible for Tailwind-friendly class tokens:
  - root utility classes (layout, color, responsive sizing)
  - SVG/line/text utility classes
  - geometry custom properties via Tailwind arbitrary-value utilities

## Geometry Variable Surface

Geometry tokens used by JS (provided via root utility classes):

- `--ruler-height`
- `--ruler-padding-top`
- `--ruler-padding-bottom`
- `--ruler-tick-height`
- `--ruler-subtick-height`
- `--ruler-label-gap`

## Runtime Rules

1. `RULER_DEFAULTS` is the source of truth for ruler utility classes.
2. The renderer applies configured utility classes to:

- root container
- SVG root
- baseline, major ticks, minor ticks, and labels

3. Geometry CSS variables are provided by configured root utility classes.
4. The renderer must not depend on a dedicated `styles/components/ruler.css` stylesheet.
5. Spacing utilities in `rootClasses` should use the Tailwind spacing scale (for example `pt-1`, `pb-1`, `sm:pt-2`) rather than half-step padding tokens.
6. Intro choreography uses a sequenced timeline:

- baseline starts at `scaleX(0)`
- baseline animates to `scaleX(1)`
- tick/label visibility reveal begins after baseline scale-in

7. Intro reveal of ticks/labels must toggle `visibility` only and must not modify `opacity`/`autoAlpha`.
8. Minor tick nodes must include parity classes for downstream styling hooks:

- `tick-odd` for odd minor tick indexes
- `tick-even` for even minor tick indexes
- When utility classes target parity, use Tailwind arbitrary selector variants on the same element (for example `[&.tick-odd]:opacity-0 sm:[&.tick-odd]:opacity-100`).

9. Default responsiveness behavior may target odd minor ticks only; parity-specific responsive behavior should be expressed in `minorTickClasses` and leave `tick-even` unchanged unless explicitly required.

## Validation

- [ ] Ruler still re-renders on container resize without layout break.
- [ ] Tick spacing updates when `intervals` or `subticksPerInterval` change.
- [ ] Visual and responsive tuning can be done by editing class strings in `RULER_DEFAULTS`.
- [ ] Intro timeline performs baseline `scaleX` animation before tick/label reveal.
- [ ] Intro animation does not write inline `opacity` or `autoAlpha` styles.
- [ ] Minor ticks include parity classes (`tick-odd`/`tick-even`) in creation order.
- [ ] When `minorTickClasses` contains odd-only responsive selectors, only `tick-odd` changes across breakpoints.
