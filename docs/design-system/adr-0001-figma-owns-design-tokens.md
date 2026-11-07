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

- **Status:** Accepted by Russ, 2026-11-06. The Figma side was authored the same day, and its styles are published to the library.
- **Scope:** Colour, spacing, radius, shadow, and type tokens in `frontend/`.

## Context

The inventory showed that Figma supplied only colours and, in name, font families.
Every other visual value came from Tailwind's defaults or a block in
`decorations.css`.
`slate` was the site's second grey, with heavy use and no Figma record.

## Decision

1. **Slate joins the palette.** It's added to Figma as a paint style family, and
   `neutral` stays as well.
2. **Every spacing, radius, shadow, and type value in use becomes a token.**
3. **Figma is the source of truth for those tokens.** `npm run build:design`
   writes `styles/tokens.css`, and the file is never edited by hand.

## How Figma exposes them

Type tokens come from the file's existing `fontSize/*`, `lineHeight/*`, and
`fontWeight/sans/*` text styles. Spacing, container, radius, shadow, and letter
spacing tokens are named layers on the existing `#️ Tokens` page. A layer named
`spacing/4` defines that token, and its width sets the value.
[TokenService](../../figma/services/TokenService.md) lists the property read for
each group.

The alternatives for the layer groups don't work here:

- **Figma Variables:** the
  [REST endpoint needs an Enterprise plan](https://developers.figma.com/docs/rest-api/variables/).
- **Figma styles:** Figma has no style type for spacing or radius.

Layers also work on any plan, through the file endpoint the sync already calls. If
the account moves to Enterprise, Variables would be the better source, and only
`TokenService` would need to change.

## Exceptions

- **Motion stays in JavaScript.** `js/choreography/tokens/motion/motion.js` remains
  the authority, and `npm run build:motion` mirrors it to `styles/motion.css`.
  Figma can't express an easing curve. The decision named spacing, radius, shadow,
  and type, so this doesn't contradict it.
- **Fonts stay in code.** `styles/typography/` is maintained by hand, and the sync
  no longer writes it. The site self-hosts IBM Plex Sans and DraftPaper for load
  performance. Syncing would have replaced the self-hosted faces with Google Fonts
  imports and removed `--font-body`. The body font was settled on 2026-11-06: IBM
  Plex Sans, and the Figma file's body and sans styles now name it.
- **Relative values stay in code.** A Figma number can't express `auto`, `full`,
  `screen`, fractions, `dvh`, `vh`, `ch`, or `%`. `0`, `px`, and `none` have no
  theme entry to override.

## Consequences

- `styles/tokens.css` was first seeded from what the site rendered. The token layers
  were created on 2026-11-06, and the first sync reproduced those values, so the seed
  script was deleted. It would have overwritten Figma's values.
- `npm run build` depends on working Figma credentials. Deploys use `npm run quick`
  and read the committed token files, so they don't.
- A partial token set fails the sync instead of falling back to Tailwind's
  defaults. Some default values differ from what the site renders, so a silent
  fallback would change it.

## Still open

- `fontWeight/sans/extrabold` and `black` stay on Poppins in Figma. IBM Plex Sans has
  no 800 or 900 weight, and the sync reads the number from the style, so moving them
  would change `--font-weight-extrabold` and `--font-weight-black` to 700.
- `headings/H1` to `H4` should move to DraftPaper in Figma, to match the site's
  `font-display`. Figma's plugin environment can't load that font, so this is a manual
  change. The sync doesn't read these styles.

## Later decisions

- **`blue`, `red`, `green`, `yellow`, and `gray` were dropped on 2026-11-06.** They
  had no Figma record. Templates and scripts now use the nearest palette step, or
  `semantic-fail` for invalid states. The contact form status text uses `tertiary-600` and
  `secondary-700`, because the semantic colours fall short of 4.5:1 on its paper background.
