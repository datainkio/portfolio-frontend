# Card Motion

**Status:** Draft v1
**Audience:** Humans + AI agents (Concierge, Choreographer, Frontend implementers)  
**Scope:** Motion authored via **GSAP** across the Card.js organism amd card-motion.js molecule.

## Intent

Given: A card has a single timeline containing three tweens in this order: intro, interstitial, and outro. Playback of the timeline is controlled via scrub.

As the user scrolls through the Work section of my homepage, project cards enter and exit the view. The intro makes a card appear to be "dealt" into the viewport from below. The interstitial plays when the card reaches a particular x,y position, and then the outro makes the to be "flicked" or "thrown" out the top of the viewport.
Cards appear to a curved path as the user scrolls. As they move, they maintain alignment with the path. A helpful metaphor is fish swimming up a river.

## Goals

1. Respect user motion preferences (system settings) and reduce vestibular triggers.
2. Keep motion **optional** for comprehension: state and content must remain clear without animation.
3. Preserve a rapid-iteration DX while enforcing consistent accessibility outcomes.
4. Ensure the choreography system can make deterministic, auditable decisions.

Breakpoints (sm/md/lg/xl) are not a priority at this point.

## Rules & Requirements

### Follow existing patterns

- Use the values in the config files by default. No magic numbers.

### Keep transforms GPU-friendly

- Prefer animating `opacity`, `transform` (translate/scale/rotate), and `filter` (sparingly)
- Avoid animating layout properties (`top/left/width/height`) unless unavoidable and controlled.
- If height animation is required: use a controlled strategy (GSAP measurement or CSS technique) and test reduced-motion behavior.

### All GSAP entry points MUST gate by reduced motion:

- If reduced: apply final state or fade-only.
- Do not register ScrollTrigger, observers, or loops.
- Required helper: Central `isReducedMotion()` utility (with optional override for testing). Example:

```js
if (isReducedMotion()) {
  // Option A: final state
  root.classList.add("is-revealed");
  return;
}
```

## Pattern Types

- **ui**: Micro-interactions, affordances (hover, focus, pressed, expand/collapse).
- **reveal**: Element entrances, list/grid reveals, simple attention cues.
- **narrative**: Scroll storytelling, parallax, pinning, scrubbing, long timelines.
