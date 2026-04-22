# Choreography Config Package

Centralized configuration for choreography runtime behavior, with one barrel
entrypoint at `index.js`.

## Why This Structure Exists

- Findability: constants are grouped by intent so engineers can locate values quickly.
- Discoverability: folder names communicate purpose without opening files.
- Change safety: shared contracts stay stable while interaction tuning evolves independently.

## Folder Taxonomy

### `contracts/` - Shared vocabulary

Canonical terms used across modules. These values establish project-wide naming
and should be treated as durable contracts.

- `events.js` -> `EVENTS`
- `labels.js` -> `LABELS`
- `paths.js` -> `ASSET_PATHS`
- `selectors.js` -> `SELECTORS`
- `timelines.js` -> `TIMELINE_IDS`

### `ix/` - Interaction design tuning

Constants that shape motion and interaction behavior and are expected to be
tuned as design evolves.

- `accessibility.js` -> `ACCESSIBILITY_SETTINGS`
- `motion.js` -> `motionTokens`, `motion`, `ANIMATION_DEFAULTS`, `HERO_ANIMATION_DEFAULTS`, `BACKGROUND_ANIMATION_DEFAULTS`, `BIO_ANIMATION_DEFAULTS`, `ORGANIZATIONS_ANIMATION_DEFAULTS`, `WORK_ANIMATION_DEFAULTS`, `AWARDS_ANIMATION_DEFAULTS`
- `scrolltriggers.js` -> `SCROLL_DEFAULTS`, `HERO_TRIGGER`, `BIO_TRIGGER`, `ORGANIZATIONS_TRIGGER`, `WORK_TRIGGER`, `AWARDS_TRIGGER`

### `displays/` - Decorative display configuration

Defaults for purely decorative display systems.

- `arrangements.js` -> `SECTION_TO_GEL_ARRANGEMENT`, `GEL_ARRANGEMENT_TRANSITION`, `GEL_ARRANGEMENTS`
- `ruler.js` -> `RULER_DEFAULTS`, `RULER_INTRO_DEFAULTS`
- `leader-lines.js` -> `SOCKETS` (id-keyed origin/terminus socket pairs with `element`, `x`, `y`, optional `scope`), `LINE_STYLES` (LeaderLine options plus optional `classes` for SVG styling)
- `printermarks.js` -> reserved for printer-marks display defaults

## Placement Rules

- Add values to `contracts/` when they define shared names or IDs used across modules.
- Add values to `ix/` when they tune interaction design behavior.
- Add values to `displays/` when they tune decorative visual systems.
- Keep decorative generators themselves (DOM/rendering logic) outside config,
  in `frontend/js/displays/`.

## Usage

Import from the barrel to avoid deep import paths:

```js
import { EVENTS, motion, RULER_DEFAULTS } from "./index.js";
```

## Package Map

```mermaid
flowchart TB
  subgraph CFG[frontend/js/choreography/config]
    IDX[index.js\nbarrel export]
    subgraph CTR[contracts]
      EVT[events.js\nEVENTS]
      LBL[labels.js\nLABELS]
      PTH[paths.js\nASSET_PATHS]
      SEL[selectors.js\nSELECTORS]
      TML[timelines.js\nTIMELINE_IDS]
    end
    subgraph IX[ix]
      ACC[accessibility.js\nACCESSIBILITY_SETTINGS]
      MOT[motion.js\nmotionTokens\nmotion\nANIMATION_DEFAULTS\nHERO/BACKGROUND/BIO/ORGANIZATIONS/WORK/AWARDS defaults]
      SCR[scrolltriggers.js\nSCROLL_DEFAULTS\nHERO_TRIGGER\nBIO_TRIGGER\nORGANIZATIONS_TRIGGER\nWORK_TRIGGER\nAWARDS_TRIGGER]
    end
    subgraph DSP[displays]
      ARR[arrangements.js\nSECTION_TO_GEL_ARRANGEMENT\nGEL_ARRANGEMENTS\nGEL_ARRANGEMENT_TRANSITION]
      RUL[ruler.js\nRULER_DEFAULTS\nRULER_INTRO_DEFAULTS]
      PRN[printermarks.js\n(display defaults)]
    end
  end

  IDX --> CTR
  IDX --> IX
  IDX --> DSP
```
