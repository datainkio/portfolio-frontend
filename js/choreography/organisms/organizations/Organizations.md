---
description: "Organizations section controller — manages lifecycle and bus coordination, and gates the logo marquee on reduced motion and visibility."
status: stable
tags:
  - choreography
links:
  - "[[AbstractSection|AbstractSection]]"
  - "[[config/index|config/index]]"
  - "[[OrganizationsAnimations|OrganizationsAnimations]]"
  - "[[OrganizationsTriggers|OrganizationsTriggers]]"
---

# Organizations

Section controller for `#organizations`.

## Marquee lifecycle

- `_applyResponsiveLifecycle` runs on every reduced-motion or breakpoint change
  (`gsap.matchMedia`). When motion is allowed, it rebuilds the marquee, which
  re-measures each row, and binds the marquee visibility trigger. Under the
  `reduced` profile (the OS setting or the `testReducedMotion` dev flag), it
  kills that trigger and tears the marquee down to the static grid.
- Visibility comes from `OrganizationsTriggers.bindMarquee`, not the section
  trigger. The section trigger is `once: true`, so its enter/leave events stop
  after the first pass.
- `_onEnter`, `_onEnterBack` and `_onIntroComplete` resume the marquee because
  `playIntro()` pauses every other phase, idle included.
