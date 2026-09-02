---
description: "Single source of truth for responsive breakpoint values, shared by Tailwind config and the choreography runtime."
type: script
---

# Breakpoints Config

Single source of truth for the site's responsive breakpoints.

## Source

- Path: `breakpoints.config.js`

## Purpose

Exports `SCREENS`, imported by both [[tailwind.config|tailwind.config.js]] (CSS layout breakpoints) and [[breakpoints|js/choreography/config/ix/breakpoints.js]] (GSAP `matchMedia()` breakpoints) so the two can't drift out of sync — previously each hardcoded the same four values independently.

## Relationships

- Imported by:
  - [[tailwind.config.js]]
  - [[breakpoints.js|js/choreography/config/ix/breakpoints.js]]

## Notes for Future Maintenance

- Change breakpoint values only here — both consumers derive from this file.
- Run `npm run build:css` and `npm run build:js` after any change to confirm both the generated Tailwind media queries and the choreography bundle picked up the new values.
