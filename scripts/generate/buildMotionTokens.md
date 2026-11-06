---
description: Sidecar for buildMotionTokens.js — mirrors the choreography duration and ease tokens into styles/motion.css so CSS and GSAP can share one source.
type: script
tags:
  - design-tokens
  - motion
  - tooling
links:
  - "[motion.js](../../js/choreography/tokens/motion/motion.md)"
---

# buildMotionTokens.js

Writes `styles/motion.css` from `js/choreography/tokens/motion/motion.js`. This
makes the named duration and ease steps available as Tailwind utilities.

The JS file stays the authority for motion. Figma has no way to express an easing
curve, so motion is the one non-colour group the Figma sync doesn't own.

Nothing uses these utilities yet. Tailwind only emits a theme variable when
something uses it, so the file doesn't change the compiled CSS. Moving a
component off `duration-200` changes its timing, because the scale has no 200ms
step, so that's a design decision to make per component.

## Usage

```bash
npm run build:motion
```

Rerun it after changing the motion tokens and commit the result.
