---
title: Accessibility
description: "How the choreography honours reduced motion: the rules, the settings that enforce them, and which modules document their reduced-motion behaviour."
type: reference
order: 1
---

Reduced motion always wins. When the visitor's system asks for it, every
section resolves the `reduced` profile, whatever the breakpoint (see
[Profiles](/docs/motion/reference/profiles/)).
[ReducedMotionHandler](/docs/motion/managers/ReducedMotionHandler/ReducedMotionHandler/)
is the authority for the system preference.

## Rules

These come from the motion accessibility policy,
`specs/animation/motion-accessibility-policy.md`.

{{ motionDocs.overview.accessibilityRules | safe }}

## Media conditions

The conditions `gsap.matchMedia` evaluates, from `config/ix/breakpoints.js`:

<!-- prettier-ignore-start -->

| Key | Media query |
| --- | ----------- |
{% for r in motionDocs.config.breakpoints -%}
| `{{ r.key }}` | `{{ r.value }}` |
{% endfor %}

<!-- prettier-ignore-end -->

## Settings

`ACCESSIBILITY_SETTINGS`, from `config/ix/profiles.js`:

<!-- prettier-ignore-start -->

| Key | Value |
| --- | ----- |
{% for r in motionDocs.config.accessibility -%}
| `{{ r.key }}` | `{{ r.value }}` |
{% endfor %}

<!-- prettier-ignore-end -->

## Documentation coverage

Every module that binds a ScrollTrigger or branches on reduced motion, and
whether its sidecar says what happens. "Section" means the sidecar has a
`## Reduced motion` heading; "Mentioned" means the notes cover it somewhere
else. The code columns are a text search of the source, so treat them as a
prompt to look, not as proof.

<!-- prettier-ignore-start -->

| Module | Binds ScrollTrigger | Code branches on reduced motion | Sidecar |
| ------ | ------------------- | ------------------------------- | ------- |
{% for c in motionDocs.coverage -%}
| [{{ c.path }}]({{ c.url }}) | {{ "Yes" if c.usesScrollTrigger else "No" }} | {{ "Yes" if c.codeBranch else "No" }} | {{ { "section": "Section", "mentioned": "Mentioned", "none": "**Not documented**" }[c.documented] }} |
{% endfor %}

<!-- prettier-ignore-end -->
