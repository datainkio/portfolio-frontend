---
id: frontend.js.choreography.config.ix.profiles
role: "Motion profiles config — defines per-breakpoint timeline and trigger capability profiles plus section-specific overrides; resolved at runtime via resolveSectionMotionProfile."
status: stable
surface: internal
scope: frontend
runtime: browser
tags:
  - choreography
  - config
  - frontend
  - js
  - motion-profiles
  - profile
links:
  - "[[config/ix/breakpoints/breakpoints|config/ix/breakpoints]]"
backlinks:
  - "[[config/index/index|config/index]]"
---

# profiles

Per-breakpoint motion profiles + section overrides. `resolveSectionMotionProfile(sectionKey, conditions)` shallow-merges `SECTION_OVERRIDES[section][key]` over `MOTION_PROFILES[key]`. `reduced` always wins (via `getActiveMotionProfileKey`); `ACCESSIBILITY_SETTINGS.testReducedMotion` is the dev force-on chokepoint.

## Channels (post-Drop)

- **timeline** — `{ enabled }` only. Gates lifecycle playback + ScrollTrigger binding. The old `durationScale`/`staggerScale`/`distanceScale`/`easePreset` flags were unconsumed dead scaffolding and were **dropped**.
- **trigger** — `{ enabled }` only. Gates ScrollTrigger binding. **Capability (pin/scrub/once) is NOT here** — it lives in each section's base trigger config (`BIO_TRIGGER`, `AWARDS_TRIGGER`, `HERO_TRIGGER`) and is not breakpoint-varying. To reintroduce per-breakpoint capability, merge `profile.trigger` over `_getTriggerDefaults()` in `AbstractSectionTriggers.bind()`.
- **animation** — `{ variant }`. Live, per-section/per-breakpoint. Selects the variant factory the organism runs via `_applyResponsiveLifecycle → setVariant`. Untouched by the Drop.

`hero.reduced` override re-enables both `timeline` + `trigger` so the shutter still runs under reduced motion (intentional a11y tradeoff).

## Card states

- **`static`** (`CARD_STATIC`) — card motion intentionally OFF, the development baseline. Distinct from a11y `reduced`: it disables **both** channels at every breakpoint so `Card.js` takes its static-reset branch (`clearProps:all`) for **all** users, not only `prefers-reduced-motion`. Use it to lock the CSS-only visual strategy before layering motion.
- **`?cardVariant=<variant>`** — dev live-override handled in `resolveSectionMotionProfile` (card-only). Forces a variant on (`clip`/`fade`/`parallax`/`throw`) without editing this file or rebuilding; `off`/`static`/`none` force the static baseline. Other sections are untouched.
