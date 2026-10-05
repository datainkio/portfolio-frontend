---
title: Section Motion Presets
description: "Per-section motion presets for the choreography system, one file per consumer area."
type: index
---

# Section Motion Presets

Section-specific timing and transform values, split out of `../motion.js`. Each
file imports what it needs (`ANIMATION_DEFAULTS`, `motion`, `motionTokens`,
`toSeconds`) from `../motion.js`.

Presets stay in `config/` rather than beside their organisms because molecules
and atoms consume them too (`hero-motion`, `award-motion`, `card-motion`,
`text-split-reveal`). Moving them under `organisms/` would make molecules import
from organisms.

| File                   | Exports                                                              | Consumers                                          |
| ---------------------- | -------------------------------------------------------------------- | -------------------------------------------------- |
| `hero.js`              | `HERO_INTRO_HOLD`, `HERO_INTRO`, `HERO_MISSION_REVEAL`, `HERO_OUTRO` | `LandingSequence`, `HeroTriggers`, `hero-motion/*` |
| `awards.js`            | `AWARDS_INTRO`                                                       | `award-motion/*`                                   |
| `card.js`              | `CARD_PARALLAX`                                                      | `card-motion/parallax`                             |
| `organizations.js`     | `ORGANIZATIONS_ANIMATION_DEFAULTS`                                   | `OrganizationsAnimations`                          |
| `work.js`              | `WORK_ANIMATION_DEFAULTS`                                            | `WorkAnimations`                                   |
| `background.js`        | `BACKGROUND_ANIMATION_DEFAULTS`                                      | `BackgroundVideoAnimations`                        |
| `project-header.js`    | `PROJECT_HEADER_ANIMATION`                                           | `ProjectHeaderManager`                             |
| `text-split-reveal.js` | `TEXT_SPLIT_REVEAL`                                                  | `atoms/text-split-reveal`                          |

`presets.js` re-exports all of them, and `../ix.js` re-exports `presets.js`, so
everything is also reachable from `config/index/index.js`.

## Adding a preset

Put it in the file for its consumer area, or add a new `<section>.js` (with a
`.md` sidecar) and export it from `presets.js`. Global defaults and tokens stay
in `../motion.js`; ScrollTrigger configs go in the organism's `*Triggers.js`.
