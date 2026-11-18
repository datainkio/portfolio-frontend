---
description: "Runtime infrastructure — shared foundation for section scroll triggers, managing a single ScrollTrigger instance with safe rebind and kill lifecycle. bind() accepts an optional animation param passed through to ScrollTrigger, enabling snap-to-labels on sections that link their timeline."
status: stable
tags:
  - choreography
  - system
links:
  - "[[system/gsap|system/gsap]]"
  - "[[config/index|config/index]]"
---

# AbstractSectionTriggers

Owns the one viewport `ScrollTrigger` a section has. `bind(callbacks)`
creates it on the section's `view`, merging the callbacks over
`_getTriggerDefaults()`, which returns `SCROLL_DEFAULTS`
([[scrolltriggers]]) unless a subclass overrides it with the section's own
config. Calling `bind` again kills the previous trigger first, so a
breakpoint rebuild is safe.

`toggleActions` decides which callbacks are wired: a direction whose action
is `none` gets no callback. `isScrubbed()` reports whether the trigger's
config sets `scrub`; [[AbstractSection]] uses it to leave a scrubbed
timeline's playhead alone.

Whether a section pins, scrubs or fires once is set here, per section, and
doesn't vary by breakpoint. Profiles only decide whether the trigger is
bound at all.

## Reduced motion

This class has no reduced-motion branch of its own. [[AbstractSection]]
calls `kill()` instead of `bind()` when the resolved profile turns the
trigger channel off, which the `reduced` profile always does.
