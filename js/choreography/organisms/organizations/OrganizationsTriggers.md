---
description: "Organizations triggers module — ORGANIZATIONS_TRIGGER for the section lifecycle, plus a separate marquee visibility trigger."
status: stable
tags:
  - choreography
links:
  - "[[AbstractSectionTriggers|AbstractSectionTriggers]]"
  - "[[scrolltriggers|scrolltriggers]]"
  - "[[selectors|selectors]]"
---

# OrganizationsTriggers

`ORGANIZATIONS_TRIGGER` extends `SCROLL_DEFAULTS`; `id = SELECTORS.organizations`. It lives here with its organism, like `HERO_TRIGGER` and `AWARDS_TRIGGER` — `config/ix/scrolltriggers.js` holds only `SCROLL_DEFAULTS`.

## Marquee visibility

`ORGANIZATIONS_MARQUEE_TRIGGER` (`top bottom` → `bottom top`) reports whether any
part of the section is on screen. `bindMarquee(onToggle)` creates it and reports
the current state immediately. `killMarquee()` removes it, and `kill()` removes
both triggers.

It exists because `SCROLL_DEFAULTS` is `once: true`: the section trigger stops
reporting after the first entry, but the marquee has to pause every time the
section leaves.
