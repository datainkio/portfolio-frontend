---
id: frontend.js.choreography.molecules.hero-motion.simple
role: "Hero `simple` variant — a no-op baseline. All three factories return correctly tagged but empty timelines, giving the hero a fully static rendering."
status: stable
surface: internal
scope: frontend
runtime: browser
tags:
  - choreography
  - frontend
  - hero
  - hero-motion
  - js
  - molecule
links:
  - "[[molecules/hero-motion/hero-motion|molecules/hero-motion/hero-motion]]"
  - "[[molecules/hero-motion/shutter|molecules/hero-motion/shutter]]"
  - "[[config/ix/profiles|config/ix/profiles]]"
backlinks:
  - "[[molecules/hero-motion/hero-motion|molecules/hero-motion/hero-motion]]"
---

## Exports

| Export | Bound to | Returns |
| --- | --- | --- |
| `init(view)` | variant `init` | empty landing timeline |
| `createIntro(view)` | variant `buildIntro` | empty intro timeline |
| `createOutro(view)` | variant `buildOutro` | empty outro timeline |

Registered as `HERO_VARIANT_FACTORIES.simple` in
[[molecules/hero-motion/hero-motion|hero-motion.js]].

## Behavior

Each factory returns a bare `gsap.timeline({ id: TIMELINE_IDS.* })`. The ids
matter: `AbstractSection._bindCallbacks` looks timelines up by
`TIMELINE_IDS.landing` / `.intro` / `.outro` and warns when one is missing, so a
timeline that animates nothing must still exist and carry the right id for the
lifecycle to complete cleanly.

No SplitText, no gel, no ScrollTrigger, no `addPause()`.

## When to select it

Via `SECTION_OVERRIDES.hero` in [[config/ix/profiles|profiles.js]], as:

- a static baseline for diagnosing whether a hero problem is motion-related,
- a breakpoint or page context where the shutter choreography is unwanted,
- the safe target when the hero gel is absent from the markup.

Not the reduced-motion path — that is the `reduced` variant, which is
deliberately shaped around low-vestibular requirements rather than being merely
empty.

## Notes

`SplitText`, `HERO_LANDING`, `HERO_INTRO`, `HERO_SELECTORS`, and the local
`selectHeroEl` helper are imported but unused — inherited from the variant
template it was copied from.
