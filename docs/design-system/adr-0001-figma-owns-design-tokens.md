---
title: "ADR 0001: Figma owns design tokens"
description: "Decision record for who owns each design token group, how Figma exposes non-colour tokens to the sync, and which values stay out of the token layer."
type: reference
status: active
tags:
  - design-system
  - design-tokens
  - figma
  - decision
links:
  - "[Figma worklist](figma-worklist.md)"
  - "[Inventory](inventory.md)"
  - "[TokenService](../../figma/services/TokenService.md)"
---

# ADR 0001: Figma owns design tokens

- **Status:** Accepted by Russ, 2026-11-06. The Figma side isn't authored yet.
- **Scope:** Colour, spacing, radius, shadow, and type tokens in `frontend/`.

## Context

The inventory showed that Figma supplied only colours and font families. Every
other visual value came from Tailwind's defaults or a block in `decorations.css`.
`slate` was the site's second grey, with heavy use and no Figma record.

## Decision

1. **Slate joins the palette.** It's added to Figma as a paint style family, and
   `neutral` stays as well.
2. **Every spacing, radius, shadow, and type value in use becomes a token.**
3. **Figma is the source of truth for those tokens.** `npm run build:design`
   writes `styles/tokens.css`, and the file is never edited by hand.

## How Figma exposes them

Non-colour tokens are named layers on a Figma page called `Tokens`. A layer named
`spacing/4` defines that token, and its width sets the value.
[TokenService](../../figma/services/TokenService.md) lists the property read for
each group.

The alternatives don't work here:

- **Figma Variables:** the
  [REST endpoint needs an Enterprise plan](https://developers.figma.com/docs/rest-api/variables/).
- **Figma styles:** Figma has no style type for spacing or radius, so they'd cover
  only part of the set.

Layers also work on any plan, through the file endpoint the sync already calls. If
the account moves to Enterprise, Variables would be the better source, and only
`TokenService` would need to change.

## Exceptions

- **Motion stays in JavaScript.** `js/choreography/tokens/motion/motion.js` remains
  the authority, and `npm run build:motion` mirrors it to `styles/motion.css`.
  Figma can't express an easing curve. The decision named spacing, radius, shadow,
  and type, so this doesn't contradict it.
- **Relative values stay in code.** A Figma number can't express `auto`, `full`,
  `screen`, fractions, `dvh`, `vh`, `ch`, or `%`. `0`, `px`, and `none` have no
  theme entry to override.

## Consequences

- Until the `Tokens` page exists, `styles/tokens.css` is seeded from what the site
  renders today, and `npm run seed:tokens` regenerates it. Once the page exists, the
  seed script has to stop being used, because it would overwrite Figma's values.
- `npm run build` depends on working Figma credentials. Deploys use `npm run quick`
  and read the committed token files, so they don't.
- A partial `Tokens` page fails the sync instead of falling back to Tailwind's
  defaults. Some default values differ from what the site renders, so a silent
  fallback would change it.

## Still open

- `blue`, `red`, `green`, `yellow`, and `gray` also have no Figma record. This
  decision only covered `slate`.
