# Choreography Config Package

`sections.js` exposes `SECTION_BEHAVIOR`, which currently supports:

- `autoPlayIntroOnEnter`: automatically runs `section.playIntro()` when a section enters the viewport.
- `autoPlayOutroOnLeave`: automatically runs `section.playOutro()` when a section leaves the viewport.

```mermaid
flowchart TB
  subgraph CFG[frontend/js/choreography/config]
    IDX[index.js\nbarrel export]
    ACC[accessibility.js\nACCESSIBILITY_SETTINGS]
    ARR[arrangements.js\nSECTION_TO_GEL_ARRANGEMENT\nGEL_ARRANGEMENTS\nGEL_ARRANGEMENT_TRANSITION\nCOLOR_CLASSES]
    EVT[events.js\nEVENTS]
    MOT[motion.js\nmotionTokens\nmotion\nANIMATION_DEFAULTS]
    PTH[paths.js\nASSET_PATHS]
    SCR[scrolltriggers.js\nSCROLL_DEFAULTS\nHERO_TRIGGER\nBIO_TRIGGER]
    SEL[selectors.js\nSELECTORS]
    SEC[sections.js\nSECTION_BEHAVIOR]
  end

  IDX --> ACC
  IDX --> ARR
  IDX --> EVT
  IDX --> MOT
  IDX --> PTH
  IDX --> SCR
  IDX --> SEL
  IDX --> SEC

  subgraph EXT[External Consumers]
    BUS[AnimationBus / sections / managers]
    GSAP[vendor/gsap.js]
    ENTRY[config/index.js imports\n(used across choreography)]
  end

  BUS --> EVT
  BUS --> ARR
  BUS --> MOT
  BUS --> SEL
  BUS --> SEC
  GSAP --> MOT
  ENTRY --> IDX
```
