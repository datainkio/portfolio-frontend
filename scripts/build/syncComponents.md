---
description: Sidecar for syncComponents.js — the sync:components entry point, which writes a Figma component set's colours into the variants map of the template whose sidecar names it.
type: script
tags:
  - figma
  - design-system
  - components
  - build
links:
  - "[[ComponentService]]"
  - "[[VariantsMap]]"
  - "[[PaletteService]]"
  - "[[fetchFigma]]"
---

# syncComponents.js

The `npm run sync:components` orchestrator. Contract:
[component-sync.spec.md](../../specs/component-sync.spec.md).

1. Finds every template under `views/` whose sidecar has a `figma` key in its
   frontmatter: `figma: "25:43"` in `views/atoms/button.md` maps
   `views/atoms/button.njk` to the Button component set.
2. [ComponentService](../../figma/services/ComponentService.md) reads the
   library's variables from a fresh Tokens page, then each component set.
3. [VariantsMap](../../figma/views/nunjucks/VariantsMap.md) writes the colours
   into the template's `variants` map.
4. It prints a table per template: slot · Figma · template · action, with the
   reason for any row that needs a hand.

A colour outside the palette (`extractPalette` names, plus `white` and `black`)
is refused as `unknown variable` and never written.

Needs `FIGMA_TOKEN` and `FIGMA_FILE_ID` in `.env`. Any thrown error exits 1.

## Flags

```bash
npm run sync:components                                   # write
npm run sync:components -- --check                        # write nothing
npm run sync:components -- --component atoms/button.njk   # one template
```

`--check` exits 1 when a row would be `written` (drift) or is
`unknown variable`. **`needs a hand` rows print as warnings and don't fail
it.** That's softer than the spec, which fails on any row that isn't
`unchanged`: Submit's arrow and Icon's glyph are coloured layers the sync can't
map, so they're reported on every run and a strict check could never pass.

A run without `--check` exits 0 once it has written, even with
`needs a hand` or `unknown variable` rows; read the report.

## Exports

`checkStatus(rows)`, `figmaKey(sidecar)`, `findMappedTemplates(viewsDir)` and
`normaliseComponent(path)` are exported for `test/figma/components.test.js`.
The Figma client is imported only when the sync runs, so the tests need no
token.
