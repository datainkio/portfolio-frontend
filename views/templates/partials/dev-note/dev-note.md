---
title: Dev Note (console channel)
description: "Emits the developer-facing console.log narrative — the IXD/motion half of"
type: template
tags:
  - dev-channel
  - console
links:
  - "[home](../../pages/home/home.md)"
  - "[ADR 0005](../../../../context/handoffs/2026-06-29-dev-channel-narrative-plan.md)"
---

# Dev Note (console channel)

Emits the **developer-facing `console.log` narrative** — the IXD/motion half of
the two-channel system defined in [ADR 0005](../../../../context/handoffs/2026-06-29-dev-channel-narrative-plan.md).
Audience: a designer/developer who opened DevTools and is watching the page boot.
The implicit question to answer: _"will working with this person make me a hero
to my bosses?"_ — answered here with evidence of runtime discipline.

## Channel contract

- **Medium:** `console.log`, styled with `%c` (pattern already established here).
- **Pairs with:** the HTML-comment channel hosted in [[home.md]] (templating
  strategy). The two **cross-reference, never duplicate**.
- **Cost:** zero UX / critical-path cost; runs after load.
- **Voice:** confident, terse, a little playful — competence, not bragging.

## Content outline (IXD / motion strategy)

Delivered as styled lines firing in **choreography order**, so the reader sees
the sequence unfold rather than reading a wall of text.

1. **Branded banner** — Russ Lebo / Creative Technologist. "Made you look —
   here's how it works." Sets expectation that the logs narrate the choreography.
2. **The boot contract** — `DOMContentLoaded → director:ready → preloader:out →
LandingSequence`. One styled line per beat _as it fires_. Why gated, not
   raced: the hero reveal (LCP) is deterministic, never bypassed.
3. **Director architecture** — `AnimationDirector` single coordinator;
   `AnimationBus` pub/sub; no rogue globals; `SECTION_REGISTRY` lifecycle
   (register → init → refresh → destroy).
4. **Motion intent vocabulary** — label each section's beat as it enters:
   orient / reveal / transition / emphasize / express-identity. Call out
   structural vs decorative (decorative = degradable).
5. **Responsive behavior** — `gsap.matchMedia()` variants; CardManager
   per-breakpoint scroll variants. Motion is authored per breakpoint, not patched.
6. **Accessibility / reduced-motion** — detect `prefers-reduced-motion`; log
   which branch ran (full vs reduced `gsap.set`). Every ScrollTrigger has a
   reduced branch — prove it at runtime. _(This is the line that wins the
   boss-question.)_
7. **Performance discipline** — compositor-only props (transform/opacity),
   ScrollSmoother wrapper/content, idle-deferred boot. Optionally log measured
   boot ms (observability as a selling point).
8. **Sign-off / CTA** — "Built with intent. Want this rigor on your team? →"
   contact. Cross-link: "structure lives in View Source."

## Known defects (tracked, not yet fixed)

See ADR 0005 scope boundary + `context/goals/Frontend_tasks/fix-dev-channel-defects.md`.

- **Mount placement:** included in `home.njk` _before_ `<head>`, so the
  `<script>` renders as a direct child of `<html>` (non-conformant). Move the
  mount inside `<body>` (or `<head>`) before expanding this channel.
- **`type="module"` defers** the first log; acceptable for now, revisit if banner
  timing matters.

## Notes for Future Maintenance

- Keep this outline in sync with `home.md` (the paired comment channel) and with
  the choreography section list in `js/choreography/system/registry.js`.
- Copy lives in the partial's frontmatter maps (`styles`, `copy`); update there.
