# Choreography Contracts

Canonical shared terms for choreography runtime.

This folder defines stable names and IDs used across sections, managers, and
event consumers. Treat these files as a project-wide vocabulary.

## What Belongs Here

- Event names shared across modules.
- Timeline label and timeline ID constants.
- DOM selector constants used as shared references.
- Asset path constants referenced by runtime modules.

## What Does Not Belong Here

- Interaction tuning values (put those in `../ix/`).
- Decorative display defaults (put those in `../displays/`).
- DOM generation or rendering logic (belongs in runtime modules).

## Export Map

- `events.js` -> `EVENTS`
- `labels.js` -> `LABELS`
- `paths.js` -> `ASSET_PATHS`
- `selectors.js` -> `SELECTORS`
- `timelines.js` -> `TIMELINE_IDS`

## Contract Rules

- Prefer additive changes to avoid breaking existing consumers.
- Rename keys only with coordinated updates to all call sites.
- Keep naming explicit and domain-scoped (`section:event:phase` pattern where relevant).
- Keep values deterministic and free of runtime side effects.

## Usage

Import contracts from the config barrel:

```js
import { EVENTS, LABELS, SELECTORS, TIMELINE_IDS } from "../index.js";
```

This keeps import paths stable even if files are reorganized inside `contracts/`.
