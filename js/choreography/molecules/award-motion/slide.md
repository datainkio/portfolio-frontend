---
id: frontend.js.choreography.molecules.award-motion.slide
role: "Awards `slide` variant — two gel sheets pushed across a surface, with the section content riding in on their tail. The full-motion default for the awards section."
status: stable
surface: internal
scope: frontend
runtime: browser
tags:
  - award-motion
  - awards
  - choreography
  - frontend
  - gel
  - js
  - molecule
links:
  - "[[molecules/award-motion/award-motion|molecules/award-motion/award-motion]]"
  - "[[molecules/award-motion/reduced|molecules/award-motion/reduced]]"
  - "[[organisms/awards/AwardsAnimations|organisms/awards/AwardsAnimations]]"
  - "[[config/ix/motion|config/ix/motion]]"
backlinks:
  - "[[molecules/award-motion/award-motion|molecules/award-motion/award-motion]]"
---

## Exports

| Export | Bound to | Returns |
| --- | --- | --- |
| `init(view, gelManager)` | variant `init` | — (sets start state only) |
| `createSlideIn(view, gelManager)` | variant `buildIntro` | intro timeline |
| `createSlideOut(view, gelManager)` | variant `buildOutro` | outro timeline |

Registered as `AWARD_VARIANT_FACTORIES.slide` in
[[molecules/award-motion/award-motion|award-motion.js]].

## Motion

Concept: a sheet of paper pushed across a surface — momentum in, friction out,
overlapping action between the two sheets and the content.

**`init`** — the geometry pass, deliberately separated from the scrubbed intro.
Both gels (`gel_awards_backing`, `gel_awards_tint`) are sized to the section
rect, rotated to `-25°` with `transformOrigin: "top center"`, refreshed, then
parked offscreen (`x: 144`, `y: <own height>`). `gel_backing` is set to
`mixBlendMode: "normal"` so the reveal starts as a solid block; the section
itself goes `multiply`.

> `gel.refresh()` reads `getBoundingClientRect()`, so it must run at full size.
> All measurement lives here — never inside the scrubbed intro tween.

**`createSlideIn`** — three nested timelines:

1. `tlBacking` — backing sheet glides to `x:-12, y:0` and settles to `rotation:-3`.
2. `tlTint` — tint sheet trails to `x:-24, y:0`, `rotation:-4`.
3. `tlContent` — `context` → masthead (`header` + `subheading` as one rigid
   block) → `list`, each `from` an offscreen rotated state.

Assembled with `>-=${GEL_DUR * 0.95}` between stages, so the sheets overlap each
other and the content rides in on the tail of the tint sheet.

**`createSlideOut`** — collapses `gel_backing` to `scaleY: 0`.

## Why `from`, not `to`

Content uses `from` so GSAP captures each child's laid-out position as the end
state and re-reads it on refresh. No destination is ever computed, so the
cascade adapts to the section's fluid dimensions. The children are not the
trigger element, which is what avoids the pin-measurement feedback loop that
previously made `view` jitter.

## Tuning knobs

All paced from `AWARDS_INTRO` in [[config/ix/motion|config/ix/motion.js]]:

- `duration` (`DUR`) — content share of the scroll range.
- `gelDuration` (`GEL_DUR`) — sheet share. Raise to make the sheets occupy more
  scroll and read slower against the content.
- `stagger` (`STAGGER`) — placed as `<${STAGGER}`, i.e. offset from the previous
  step's **start**, keeping the cascade even.
- `OVERLAP` (`GEL_DUR * 0.95`) — raise to tighten the seam between stages.

## Reduced motion

Not handled here. The `reduced` profile swaps the whole variant for
[[molecules/award-motion/reduced|reduced.js]], so this file is never built.
